import { EmailMessage } from 'cloudflare:email';

const jsonHeaders = {
   'Content-Type': 'application/json',
};

function corsHeaders(origin, env) {
   const allowedOrigin = env.CORS_ORIGIN || origin || '*';

   return {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
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
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
}

function encodeHeader(value) {
   return String(value).replaceAll('\r', '').replaceAll('\n', '');
}

function buildContactEmail({ from, to, replyTo, subject, name, email, message }) {
   const html = `
      <h2>New contact message</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replaceAll('\n', '<br>')}</p>
   `;
   const text = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
   const boundary = `talibconnect-${crypto.randomUUID()}`;

   return [
      `From: TalibConnect <${encodeHeader(from)}>`,
      `To: ${encodeHeader(to)}`,
      `Reply-To: ${encodeHeader(replyTo)}`,
      `Subject: ${encodeHeader(subject)}`,
      'MIME-Version: 1.0',
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      '',
      `--${boundary}`,
      'Content-Type: text/plain; charset=UTF-8',
      'Content-Transfer-Encoding: 8bit',
      '',
      text,
      '',
      `--${boundary}`,
      'Content-Type: text/html; charset=UTF-8',
      'Content-Transfer-Encoding: 8bit',
      '',
      html,
      '',
      `--${boundary}--`,
      '',
   ].join('\r\n');
}

function validateContactForm(data) {
   const name = typeof data.name === 'string' ? data.name.trim() : '';
   const email = typeof data.email === 'string' ? data.email.trim() : '';
   const message = typeof data.message === 'string' ? data.message.trim() : '';

   if (!name || !email || !message) {
      return { error: 'Name, email, and message are required.' };
   }

   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { error: 'Please provide a valid email address.' };
   }

   return { value: { name, email, message } };
}

export default {
   async fetch(request, env) {
      const origin = request.headers.get('Origin');

      if (request.method === 'OPTIONS') {
         return new Response(null, {
            status: 204,
            headers: corsHeaders(origin, env),
         });
      }

      if (request.method !== 'POST') {
         return jsonResponse(
            { error: 'Method not allowed.' },
            405,
            origin,
            env,
         );
      }

      if (!env.CONTACT_EMAIL || !env.TO_EMAIL || !env.CONTACT_FROM) {
         return jsonResponse(
            { error: 'Email service is not configured.' },
            500,
            origin,
            env,
         );
      }

      let payload;
      try {
         payload = await request.json();
      } catch {
         return jsonResponse(
            { error: 'Invalid JSON payload.' },
            400,
            origin,
            env,
         );
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
               error: 'Failed to send email.',
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
