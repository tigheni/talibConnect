import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import ReturnBackButton from "../hooks/ReturnBackButton";
export default function Privacy() {
  return (
    <div className="m-5">
      <ReturnBackButton />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Data We Collect</h2>
            <p>
              When you register, we collect your name, email address, and role
              (student/teacher). We also collect usage data and store uploaded
              exam files.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              2. How We Use Your Data
            </h2>
            <p>
              We use your data to provide and improve TalibConnect, manage your
              account, and moderate content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              3. Legal Basis (Algerian Law 18-07)
            </h2>
            <p>
              We process your data based on your explicit consent when you
              register and agree to these terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              4. Data Sharing & Storage
            </h2>
            <p>
              We do not sell or rent your personal data. Your data is stored
              securely via database.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">5. Your Rights</h2>
            <p>
              You have the right to access, correct, delete, or object to the
              processing of your data. Contact us at contact@talibconnect.com or
              at &nbsp;
              <a className="underline">
                <Link to="/contact">contact us</Link>
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">6. Contact Us</h2>
            <p>Email: contact@talibconnect.com</p>
          </section>
        </div>
      </div>
    </div>
  );
}
