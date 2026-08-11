import { EmailMessage } from "cloudflare:email";

const jsonHeaders = {
  "Content-Type": "application/json",
};

function corsHeaders(origin, env) {
  const allowedOrigin = env.CORS_ORIGIN || origin || "*";

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function jsonResponse(body, status, origin, env) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...jsonHeaders,
      ...corsHeaders(origin, env),
    },
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function encodeHeader(value) {
  return String(value).replaceAll("\r", "").replaceAll("\n", "");
}

function buildContactEmail({
  from,
  to,
  replyTo,
  subject,
  name,
  email,
  message,
}) {
  const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>New contact message</title>
          <style>
            body {
              margin: 0;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
              background: #f4f6fb;
              color: #111827;
            }
            .wrapper {
              padding: 24px;
            }
            .card {
              max-width: 600px;
              margin: 0 auto;
              background: #ffffff;
              border-radius: 18px;
              box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
              overflow: hidden;
            }
            .header {
              padding: 24px;
              background: linear-gradient(135deg, #4f46e5, #7c3aed);
              color: #ffffff;
            }
            .header h2 {
              margin: 0;
              font-size: 24px;
            }
            .content {
              padding: 24px;
            }
            .field {
              margin-bottom: 18px;
            }
            .field strong {
              display: block;
              margin-bottom: 8px;
              font-size: 14px;
              color: #374151;
            }
            .value {
              background: #f8fafc;
              padding: 16px;
              border-radius: 14px;
              line-height: 1.6;
              word-break: break-word;
            }
            .message {
              white-space: pre-wrap;
            }
            .footer {
              padding: 20px 24px;
              background: #f8fafc;
              text-align: center;
              color: #6b7280;
              font-size: 13px;
            }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="card">
              <div class="header">
                <h2>New contact message</h2>
              </div>
              <div class="content">
                <div class="field">
                  <strong>Name</strong>
                  <div class="value">${escapeHtml(name)}</div>
                </div>
                <div class="field">
                  <strong>Email</strong>
                  <div class="value">${escapeHtml(email)}</div>
                </div>
                <div class="field">
                  <strong>Message</strong>
                  <div class="value message">${escapeHtml(message).replaceAll("\n", "<br>")}</div>
                </div>
              </div>
              <div class="footer">
                Sent from the TalibConnect contact form.
              </div>
            </div>
          </div>
        </body>
      </html>
   `;
  const text = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
  const boundary = `talibconnect-${crypto.randomUUID()}`;

  return [
    `From: TalibConnect <${encodeHeader(from)}>`,
    `To: ${encodeHeader(to)}`,
    `Reply-To: ${encodeHeader(replyTo)}`,
    `Subject: ${encodeHeader(subject)}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    text,
    "",
    `--${boundary}`,
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    html,
    "",
    `--${boundary}--`,
    "",
  ].join("\r\n");
}

function validateContactForm(data) {
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const message = typeof data.message === "string" ? data.message.trim() : "";

  if (!name || !email || !message) {
    return { error: "Name, email, and message are required." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please provide a valid email address." };
  }

  return { value: { name, email, message } };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(origin, env),
      });
    }

    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed." }, 405, origin, env);
    }

    if (!env.CONTACT_EMAIL || !env.TO_EMAIL || !env.CONTACT_FROM) {
      return jsonResponse(
        { error: "Email service is not configured." },
        500,
        origin,
        env,
      );
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON payload." }, 400, origin, env);
    }

    const validation = validateContactForm(payload);
    if (validation.error) {
      return jsonResponse({ error: validation.error }, 400, origin, env);
    }

    const { name, email, message } = validation.value;
    const subject = `New TalibConnect contact message from ${name}`;

    const rawEmail = buildContactEmail({
      from: env.CONTACT_FROM,
      to: env.TO_EMAIL,
      replyTo: email,
      subject,
      name,
      email,
      message,
    });
    const emailMessage = new EmailMessage(
      env.CONTACT_FROM,
      env.TO_EMAIL,
      rawEmail,
    );

    try {
      await env.CONTACT_EMAIL.send(emailMessage);
    } catch (error) {
      return jsonResponse(
        {
          error: "Failed to send email.",
          providerError: error.message,
        },
        502,
        origin,
        env,
      );
    }

    return jsonResponse({ ok: true }, 200, origin, env);
  },
};
