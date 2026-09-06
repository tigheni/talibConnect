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
            <ul className="mt-3 list-disc space-y-2 pl-5 leading-7">
              <li>
                Account details such as username, email address, and role.
              </li>
              <li>
                Academic profile details you choose to provide, such as study
                system, year, institution, faculty, department, and wilaya.
              </li>
              <li>
                Uploaded exam files and related metadata, including title,
                subject, year, and uploader information.
              </li>
              <li>
                Contact form messages and the information you submit with them.
              </li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              2. How We Use Information
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 leading-7">
              <li>To create and manage your account.</li>
              <li>
                To complete your profile and personalize the archive experience.
              </li>
              <li>To store, review, approve, and display exam papers.</li>
              <li>To track downloads and help maintain the archive.</li>
              <li>To respond to support messages and moderation requests.</li>
              <li>
                To improve the site, detect abuse, and keep the service secure.
              </li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              3. Services We Use
            </h2>
            <p className="mt-2 leading-7">
              TalibConnect uses Supabase for authentication, database storage,
              and file storage. We also use Cloudflare Workers for the contact
              form email workflow. These providers may process limited technical
              data on our behalf to deliver their services.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              4. Sharing and Public Visibility
            </h2>
            <p className="mt-2 leading-7">
              We do not sell your personal data. Some profile and exam metadata
              may be visible to other users as part of the archive, such as
              uploaded exam titles, subjects, institutions, years, and uploader
              names. We may also share data with service providers that help us
              run the platform, but only as needed for the service to function.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              5. Storage and Retention
            </h2>
            <p className="mt-2 leading-7">
              Your data is stored in the systems that power TalibConnect until
              it is no longer needed for the purposes described in this policy,
              unless we must keep it longer for legal, security, or operational
              reasons. Uploaded files may be retained while they remain part of
              the public archive or until they are removed by moderation.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              6. Security
            </h2>
            <p className="mt-2 leading-7">
              We use reasonable technical and organizational measures to protect
              the platform. No system is perfect, so we cannot guarantee
              absolute security. You should keep your credentials private and
              contact us if you suspect unauthorized access.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              7. Your Choices and Rights
            </h2>
            <p className="mt-2 leading-7">
              Depending on your location and applicable law, you may have the
              right to access, correct, update, delete, or object to certain
              uses of your personal data. You can also contact us if you want
              help updating your account information or removing content you
              uploaded.
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
            Effective date: September 6, 2026
          </p>
        </div>
      </div>
    </main>
  );
}
