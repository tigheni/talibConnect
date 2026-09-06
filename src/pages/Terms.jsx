import ReturnBackButton from "../components/ReturnBackButton";
import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <main className="m-5">
      <ReturnBackButton />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#2f9e6d]">
            TalibConnect
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">
            Terms of Use
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            These terms explain how TalibConnect works and what is expected from
            everyone using the platform. By creating an account, browsing the
            archive, uploading a file, or using the site in any way, you agree
            to these terms.
          </p>
        </div>

        <div className="space-y-6 text-slate-700">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              1. What TalibConnect Is
            </h2>
            <p className="mt-2 leading-7">
              TalibConnect is an educational archive for Algerian university
              exam papers. The platform helps students and teachers discover,
              upload, review, and download exam files. We may moderate, approve,
              reject, or remove content at our discretion to keep the archive
              organized and safe.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              2. Accounts and Security
            </h2>
            <p className="mt-2 leading-7">
              You are responsible for the activity that happens under your
              account. Keep your login credentials private, use accurate
              information, and notify us if you believe your account has been
              compromised. You may not impersonate someone else or create an
              account using false information.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              3. Eligibility and Use
            </h2>
            <p className="mt-2 leading-7">
              You may use the site only for lawful, educational purposes. Do not
              attempt to break, scrape, overload, reverse engineer, or interfere
              with the platform or its services. Do not use TalibConnect to
              distribute malware, spam, or other harmful content.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              4. Uploads and Content
            </h2>
            <p className="mt-2 leading-7">
              If you upload an exam, you confirm that you have the right to
              share it and that it does not violate any law, school policy, or
              third-party rights. Uploads may be reviewed by administrators
              before they appear in the public archive. We may remove content
              that is incomplete, misleading, duplicated, infringing, or
              otherwise unsuitable for the platform.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              5. Educational Content and Downloads
            </h2>
            <p className="mt-2 leading-7">
              Exam files and related metadata are shared for educational
              purposes. Download availability may depend on your account status,
              file permissions, or platform settings. We do not guarantee that
              every paper will be accurate, complete, or available forever.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              6. Intellectual Property
            </h2>
            <p className="mt-2 leading-7">
              TalibConnect, including its branding, design, code, and content we
              create, is protected by applicable intellectual property laws. You
              may not copy, reproduce, distribute, or create derivative works
              from our own materials without permission, except where the law
              allows it.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              7. Moderation and Termination
            </h2>
            <p className="mt-2 leading-7">
              We may suspend, restrict, or terminate access to the platform at
              any time if we believe a user has violated these terms, abused the
              service, or created risk for other users, our systems, or our
              partners.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              8. Disclaimers and Limitation of Liability
            </h2>
            <p className="mt-2 leading-7">
              TalibConnect is provided on an "as is" and "as available" basis.
              We do not promise uninterrupted service or error-free content. To
              the extent permitted by law, TalibConnect is not responsible for
              losses, damages, or decisions made based on content shared on the
              platform.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              9. Changes to These Terms
            </h2>
            <p className="mt-2 leading-7">
              We may update these terms when the product changes or when we need
              to clarify how the service operates. If the changes are material,
              we may show a notice on the site or update the effective date
              below.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              10. Contact
            </h2>
            <p className="mt-2 leading-7">
              Questions about these terms can be sent through the contact page
              or by email at{" "}
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
