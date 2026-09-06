import logo from "../assets/logo.svg";
import { Link, useNavigate, NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import useMobile from "../hooks/useMobile";
import { useAuth } from "../context/authContext/useAuth";
import { useLoginModal } from "../context/loginContext/useLoginModal";
export default function NavBoard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isMobile } = useMobile();
  const { openLogin } = useLoginModal();

  const { user, isAdmin } = useAuth();

  const location = useLocation();

  const handleUploadClick = () => {
    if (!user) {
      openLogin("/upload");
      return;
    }

    navigate("/upload");
  };

  const navLinkClass = ({ isActive }) =>
    `relative rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 ${
      isActive
        ? "bg-[#2f9e6d] text-white shadow-sm"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
    }`;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMenuOpen(false);
    navigate("/");
  };

  return (
    <div className="sticky top-0 z-50 flex justify-center px-3 pt-3">
      <nav className="relative font-mono flex h-16 w-full max-w-[120rem] items-center justify-between rounded-2xl border border-slate-200 bg-white/80 px-4 shadow-[0_12px_35px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:px-6">
        <Link
          to="/"
          className="shrink-0 transition-transform duration-200 hover:scale-[1.03] active:scale-95"
        >
          <img
            src={logo}
            srcSet={`${logo} 2x`}
            className="h-5 w-auto sm:h-6 lg:h-7"
            alt="logo"
            width={250}
            height={100}
          />
        </Link>

        <div className="hidden lg:flex flex-1 justify-center px-4 xl:px-10">
          <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <button
              onClick={handleUploadClick}
              className={navLinkClass({
                isActive: location.pathname === "/upload",
              })}
            >
              Upload
            </button>
            <NavLink to="/exams" className={navLinkClass}>
              Exams
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className={navLinkClass}>
                Admin
              </NavLink>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {user && !isMobile ? (
            <>
              <div className="hidden items-center gap-2.5 pr-1 sm:flex">
                <div className="relative">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#5ae4a8] to-[#2f9e6d] text-sm font-bold text-white ring-2 ring-[#5ae4a8]/25 ring-offset-2 ring-offset-white">
                    {(user.user_metadata?.username || user.email || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#5ae4a8]" />
                </div>
                <span className="hidden text-sm font-medium text-slate-700 xl:block">
                  {user.user_metadata?.username || user.email?.split("@")[0]}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-rose-100 active:scale-95"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="hidden items-center gap-3 lg:flex">
              <button
                onClick={() => openLogin()}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-slate-400 hover:bg-slate-50"
              >
                Login
              </button>

              <Link
                to="/register"
                className="rounded-xl border border-[#2f9e6d] bg-[#2f9e6d] px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(47,158,109,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#237a54] active:scale-95"
              >
                Register
              </Link>
            </div>
          )}

          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="relative flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-xl border border-slate-200 bg-white lg:hidden"
          >
            <span
              className={`block h-[2px] w-6 rounded-full bg-slate-900 transition-all duration-300 ${
                isMenuOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-6 rounded-full bg-slate-900 transition-all duration-300 ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block h-[2px] w-6 rounded-full bg-slate-900 transition-all duration-300 ${
                isMenuOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>

        {isMenuOpen && (
          <>
            <div
              className="fixed inset-0 top-[72px] z-40 bg-black/20 backdrop-blur-[2px] lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 flex flex-col gap-1 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl lg:hidden">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50"
              >
                Home
              </Link>
              <Link
                to="/exams"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50"
              >
                Exams
              </Link>
              <Link
                to="/upload"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50"
              >
                Upload
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50"
              >
                Contact
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50"
                >
                  Admin
                </Link>
              )}

              <div className="my-1 h-px bg-slate-200" />

              {user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#5ae4a8] to-[#2f9e6d] text-sm font-bold text-white">
                      {user.user_metadata?.username?.charAt(0).toUpperCase() ||
                        "U"}
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {user.user_metadata?.username ||
                        user.email?.split("@")[0] ||
                        "User"}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-left text-sm font-medium text-rose-700 transition-colors duration-150 hover:bg-rose-100"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 p-1">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      openLogin();
                    }}
                    className="rounded-xl border border-slate-300 px-4 py-3 text-center text-sm font-medium text-slate-700"
                  >
                    Login
                  </button>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-xl border border-[#2f9e6d] bg-[#2f9e6d] px-4 py-3 text-center text-sm font-bold text-white transition-transform duration-150 hover:bg-[#237a54] active:scale-95"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </nav>
    </div>
  );
}
