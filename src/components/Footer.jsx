import { Link } from "react-router-dom";
import { FaInstagram, FaFacebook, FaEnvelope } from "react-icons/fa";
export default function Footer() {
  return (
    <footer className="bg-[#111111] border-t border-gray-800 ">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">TalibConnect</h3>
            <p className="text-gray-400 text-sm">
              Helping Algerian students ace their exams through shared
              knowledge.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 text-sm hover:text-[#
5ae4a8
] transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/exams"
                  className="text-gray-400 text-sm hover:text-[#
5ae4a8
] transition"
                >
                  Exams
                </Link>
              </li>
              <li>
                <Link
                  to="/upload"
                  className="text-gray-400 text-sm hover:text-[#
5ae4a8
] transition"
                >
                  Upload
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 text-sm hover:text-[#
5ae4a8
] transition"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 text-sm hover:text-[#
5ae4a8
] transition"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-gray-400 text-sm hover:text-[#
5ae4a8
] transition"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-400 text-sm hover:text-[#
5ae4a8
] transition"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-400 text-sm hover:text-[#
5ae4a8
] transition"
                >
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-[#
5ae4a8
] transition"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#
5ae4a8
] transition"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="mailto:contact@talibconnect.com"
                className="text-gray-400 hover:text-[#
5ae4a8
] transition"
              >
                <FaEnvelope size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} TalibConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
