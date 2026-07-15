import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#0b0b0b]">
      <div className="absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#5AE4A8]/10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-white">
              Talib<span className="text-[#5AE4A8]">Connect</span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-gray-400">
              The platform helping Algerian university students discover, share
              and access previous exams in one place.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold">Explore</h3>

            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 transition hover:text-[#5AE4A8]"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/exams"
                  className="text-gray-300 transition hover:text-[#5AE4A8]"
                >
                  Exams
                </Link>
              </li>

              <li>
                <Link
                  to="/upload"
                  className="text-gray-300 transition hover:text-[#5AE4A8]"
                >
                  Upload Exams
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="text-gray-300 transition hover:text-[#5AE4A8]"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold">Resources</h3>

            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link
                  to="/faq"
                  className="text-gray-300 transition hover:text-[#5AE4A8]"
                >
                  FAQ
                </Link>
              </li>

              <li>
                <Link
                  to="/privacy"
                  className="text-gray-300 transition hover:text-[#5AE4A8]"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/terms"
                  className="text-gray-300 transition hover:text-[#5AE4A8]"
                >
                  Terms of Use
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 transition hover:text-[#5AE4A8]"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold">Community</h3>

            <p className="mt-5 text-sm leading-7 text-gray-300">
              Built by students, for students. Help thousands of Algerian
              students by sharing your previous exams.
            </p>

            <Link
              to="/upload"
              className="mt-6 inline-flex rounded-xl bg-[#5AE4A8] px-5 py-3 text-sm font-semibold text-black transition hover:scale-105"
            >
              Upload an Exam
            </Link>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-5 border-t border-white pt-8 text-sm text-gray-300 md:flex-row">
          <p>© {new Date().getFullYear()} TalibConnect. All rights reserved.</p>

          <p>Made with ❤️ for Algerian Students</p>
        </div>
      </div>
    </footer>
  );
}
