import ReturnBackButton from "../components/ReturnBackButton";
import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <main className="m-5">
      <ReturnBackButton />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#2f9e6d]">
            Privacy
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            This policy explains what information TalibConnect collects, how it
            is used, and the choices you have when using the site.
          </p>
        </div>

        <div className="space-y-6 text-slate-700">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              1. Information We Collect
            </h2>
            <p className="mt-2 leading-7">
              The TalibConnect operator is responsible for this processing. We
              collect only the information needed to operate the archive and
              respond to requests. Anonymous submissions are not used to build
              visitor profiles.
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 leading-7">
              <li>
                Resource-submission metadata, such as title, subject, year,
                institution, faculty, department, and wilaya, together with
                the submitted file. Do not include personal information in a
                submission unless it is necessary for the resource itself.
              </li>
              <li>
                Contact form messages and the information you submit with them.
              </li>
              <li>
                Technical information processed by Supabase, Cloudflare, and
                hosting systems, such as IP address, timestamps, browser or
                request metadata, security events, and error logs.
              </li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              2. How We Use Information
            </h2>
            <p className="mt-2 leading-7">
              Processing is based on operating the educational service,
              responding to voluntary contact requests, maintaining security,
              and the consent collected at submission. You can withdraw
              optional contact consent by contacting us; this does not affect
              processing already completed.
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 leading-7">
              <li>To store, review, approve, and display exam papers.</li>
              <li>To count approved-resource downloads without identifying individual visitors in the app.</li>
              <li>To respond to support messages and moderation requests.</li>
              <li>
                To improve the site, detect abuse, and keep the service secure.
              </li>
              <li>
                Administrator authentication is used only to review and manage
                submissions; visitors are not asked to create public accounts.
              </li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              3. Services We Use
            </h2>
            <p className="mt-2 leading-7">
              TalibConnect uses Supabase for database and file storage; it is
              also used for administrator authentication. We use Cloudflare
              Workers for the contact form email workflow. These providers and
              hosting/logging systems may process technical data such as IP
              addresses, request metadata, and error logs to operate and secure
              the service.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              4. Sharing and Public Visibility
            </h2>
            <p className="mt-2 leading-7">
              We do not sell your personal data. Approved resource metadata
              such as titles, subjects, institutions, and years is visible in
              the public archive. Pending and rejected submissions are visible
              only to administrators. We may share data with service providers
              only as needed to run the platform.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              5. Storage and Retention
            </h2>
            <p className="mt-2 leading-7">
              Approved metadata and files are retained while they are useful to
              the archive or required for legal and security purposes. Pending
              and rejected files are deleted after moderation and abuse-review
              needs end, with a target maximum of 90 days. Contact messages are
              deleted after the request is resolved and no later than 12 months
              unless a longer period is legally necessary. Backups and provider
              logs may follow their documented retention periods.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              6. Security
            </h2>
            <p className="mt-2 leading-7">
              We use reasonable technical and organizational measures to protect
              the platform. No system is perfect, so we cannot guarantee
              absolute security. Administrator credentials must be kept private;
              contact us if you suspect unauthorized access.
            </p>
            <p className="mt-3 leading-7">
              To request access, correction, deletion, restriction, or removal
              of content, use the contact form and include enough information
              to locate the request. We will verify the request before acting;
              anonymous submissions may be impossible to associate with a
              person. You may also contact the competent Algerian data
              protection authority where applicable.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              7. Your Choices and Rights
            </h2>
            <p className="mt-2 leading-7">
              Depending on your location and applicable law, you may have the
              right to access, correct, delete, or object to certain uses of
              personal data. Because public submissions are anonymous, we may
              not be able to connect a request to a particular submitter without
              sufficient identifying details. You can contact us to request
              removal of content you submitted.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              8. Children&apos;s Privacy
            </h2>
            <p className="mt-2 leading-7">
              TalibConnect is intended for students and educators. If you are
              under the age required by your local law to consent to online data
              collection, please use the platform only with appropriate parental
              or institutional guidance.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              9. Changes to This Policy
            </h2>
            <p className="mt-2 leading-7">
              We may update this policy as the product evolves or as legal
              requirements change. The effective date below shows when it was
              last updated.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              10. Contact
            </h2>
            <p className="mt-2 leading-7">
              For privacy questions or requests, use the contact form or email{" "}
              <a className="underline">
                <Link to="/contact">contact us</Link>
              </a>
              .
            </p>
          </section>

          <p className="px-1 pb-2 text-xs uppercase tracking-[0.22em] text-slate-500">
            Effective date: September 10, 2026
          </p>
        </div>
      </div>
    </main>
  );
}
