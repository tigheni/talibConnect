import Footer from "../components/Footer";
import ReturnBackButton from "../hooks/ReturnBackButton";

export default function Terms() {
  return (
    <div className="m-5">
      <ReturnBackButton />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold mb-2">
              1. Account Responsibility
            </h2>
            <p>
              You are responsible for maintaining the security of your account
              and password. Sharing your account is prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">2. User Conduct</h2>
            <p>
              You agree to use TalibConnect only for lawful purposes. Do not
              upload illegal, harmful, or copyrighted content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">3. Content Ownership</h2>
            <p>
              You retain ownership of the exams you upload. By uploading, you
              affirm you have the right to share them.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">4. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account for
              violating these terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              5. Limitation of Liability
            </h2>
            <p>
              TalibConnect is provided "as is". We are not liable for any
              damages arising from your use of the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">6. Governing Law</h2>
            <p>These terms shall be governed by the laws of Algeria.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">7. Contact</h2>
            <p>Email: contact@talibconnect.com</p>
          </section>
        </div>
      </div>
    </div>
  );
}
