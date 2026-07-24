import logo from "../assets/logo.svg";
import { Link, useNavigate, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import useMobile from "../hooks/useMobile";

export default function NavBoard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/exams";
  const isMobile = useMobile();

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      const userEmail = data.user?.email;
      setIsAdmin(userEmail === "oussama.adame12@gmail.com");
    };

    getUser();
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      },
    );

    return () => listener?.subscription.unsubscribe();
  }, []);

  return (
    <div
      className={`sticky top-0 p-3 left-0 right-0 z-50 flex justify-center font-roboto-mono ${
        isHome
          ? " rounded-2xl border border-white/30 bg-white/70 backdrop-blur-xl shadow-xl m-1 "
          : ""
      }`}
    >
      <nav className="relative h-16 w-full sm:max-w-3xl lg:max-w-6xl mx-5 flex items-center justify-between rounded-xl bg-white/80 backdrop-blur-xl border border-black/10 shadow-[0_8px_30px_rgba(0,0,0,0.08)] px-5 sm:px-6 transition-shadow duration-300">
        <Link
          to="/"
          className="shrink-0 transition-transform duration-200 hover:scale-[1.03] active:scale-95"
        >
          <img
            src={logo}
            srcSet={`${logo} 2x`}
            className="h-4 sm:h-5 md:h-6 lg:h-8 w-auto"
            alt="logo"
            width={250}
            height={100}
          />
        </Link>

        <div className="hidden lg:flex flex-1 justify-center px-4 xl:px-10">
          <div className="flex items-center gap-1 bg-black/[0.03] rounded-full p-1 border border-black/5">
            <NavLink
              to="/"
              end
              aria-label="Go to Homepage"
              className={({ isActive }) =>
                `relative text-sm font-medium px-4 py-2 rounded-full whitespace-nowrap shrink-0 transition-all duration-200 ${
                  isActive
                    ? "bg-white text-black shadow-sm"
                    : "text-black/60 hover:text-black hover:bg-white/60"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/upload"
              aria-label="Upload a new exam"
              className={({ isActive }) =>
                `relative text-sm font-medium px-4 py-2 rounded-full whitespace-nowrap shrink-0 transition-all duration-200 ${
                  isActive
                    ? "bg-white text-black shadow-sm"
                    : "text-black/60 hover:text-black hover:bg-white/60"
                }`
              }
            >
              Upload
            </NavLink>
            <NavLink
              to="/exams"
              aria-label="Browse all exams"
              className={({ isActive }) =>
                `relative text-sm font-medium px-4 py-2 rounded-full whitespace-nowrap shrink-0 transition-all duration-200 ${
                  isActive
                    ? "bg-white text-black shadow-sm"
                    : "text-black/60 hover:text-black hover:bg-white/60"
                }`
              }
            >
              Exams
            </NavLink>
            <NavLink
              to="/contact"
              aria-label="contact us here"
              className={({ isActive }) =>
                `relative text-sm font-medium px-4 py-2 rounded-full whitespace-nowrap shrink-0 transition-all duration-200 ${
                  isActive
                    ? "bg-white text-black shadow-sm"
                    : "text-black/60 hover:text-black hover:bg-white/60"
                }`
              }
            >
              Contact
            </NavLink>
            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `relative text-sm font-medium px-4 py-2 rounded-full whitespace-nowrap shrink-0 transition-all duration-200 ${
                    isActive
                      ? "bg-white text-black shadow-sm"
                      : "text-black/60 hover:text-black hover:bg-white/60"
                  }`
                }
              >
                Admin
              </NavLink>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {user && !isMobile ? (
            <>
              <div className="flex items-center gap-2.5 pr-1">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#5ae4a8] to-[#3fcf8e] flex items-center justify-center text-black font-bold text-sm ring-2 ring-[#5ae4a8]/30 ring-offset-2 ring-offset-white">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#5ae4a8] border-2 border-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 hidden lg:block">
                  {user.user_metadata?.username}
                </span>
              </div>

              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  setUser(null);
                  navigate("/");
                }}
                className="text-[#f35f62] bg-[#3b1c1d] text-sm font-medium px-4 py-2.5 rounded-xl border-none transition-all duration-200 hover:scale-105 hover:bg-[#4a2223] active:scale-95"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/login"
                className="login-btn text-sm font-medium px-4 py-2.5 rounded-xl border border-gray-400 text-gray-800 transition-all duration-200 hover:border-gray-600 hover:bg-black/[0.05]"
              >
                <span className="relative z-10">Login</span>
              </Link>

              <Link
                to="/register"
                className="cursor-pointer bg-[var(--cp)] shadow-[0px_4px_32px_0_rgba(99,232,126,.40)] px-6 py-2.5 rounded-xl border border-[#5ae4a8] text-[#0f0f0f] font-medium group transition-transform duration-200 hover:scale-[1.03] active:scale-95"
              >
                <div className="relative overflow-hidden h-5 leading-5">
                  <p className="leading-5 group-hover:-translate-y-5 duration-[0.6s] ease-[cubic-bezier(0.19,1,0.22,1)]">
                    Register
                  </p>
                  <p className="absolute top-5 left-0 leading-5 group-hover:top-0 duration-[0.6s] ease-[cubic-bezier(0.19,1,0.22,1)]">
                    Register
                  </p>
                </div>
              </Link>
            </div>
          )}
        </div>
        <div className="lg:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="relative w-10 h-10 flex flex-col items-center justify-center gap-[5px] focus:outline-none"
          >
            <span
              className={`block h-[2px] w-6 bg-black rounded-full transition-all duration-300 ${
                isMenuOpen ? "rotate-45 translate-y-[7px]" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-6 bg-black rounded-full transition-all duration-300 ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block h-[2px] w-6 bg-black rounded-full transition-all duration-300 ${
                isMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""
              }`}
            />
          </button>
        </div>
        {isMenuOpen && (
          <>
            <div
              className="fixed inset-0 top-[72px] bg-black/20 backdrop-blur-[2px] lg:hidden animate-[fadeIn_0.2s_ease]"
              onClick={() => setIsMenuOpen(false)}
            />
            <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white/95 backdrop-blur-xl rounded-2xl border border-black/10 shadow-2xl flex flex-col p-3 gap-1 lg:hidden animate-[slideDown_0.25s_cubic-bezier(0.19,1,0.22,1)]">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-medium px-4 py-3 rounded-xl text-gray-800 transition-colors duration-150 hover:bg-black/[0.04] active:bg-black/[0.06]"
              >
                Home
              </Link>
              <Link
                to="/exams"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Browse all exams"
                className="text-sm font-medium px-4 py-3 rounded-xl text-gray-800 transition-colors duration-150 hover:bg-black/[0.04] active:bg-black/[0.06]"
              >
                Exams
              </Link>
              <Link
                to="/upload"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Upload a new exam"
                className="text-sm font-medium px-4 py-3 rounded-xl text-gray-800 transition-colors duration-150 hover:bg-black/[0.04] active:bg-black/[0.06]"
              >
                Upload
              </Link>

              <div className="h-px bg-black/10 my-1.5 mx-2" />

              {user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-2">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#5ae4a8] to-[#3fcf8e] flex items-center justify-center text-black font-bold text-sm ring-2 ring-[#5ae4a8]/30">
                      {user.email?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user.user_metadata?.username ||
                        user.email?.split("@")[0] ||
                        "User"}
                    </span>
                  </div>
                  <button
                    onClick={async () => {
                      await supabase.auth.signOut();
                      setUser(null);
                      setIsMenuOpen(false);
                    }}
                    className="text-left text-[#f35f62] text-sm font-medium px-4 py-3 rounded-xl transition-colors duration-150 hover:bg-[#3b1c1d]/5"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-1 p-1">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm font-medium px-4 py-3 rounded-xl text-gray-800 border border-gray-300 text-center transition-colors duration-150 hover:bg-black/[0.03]"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm font-medium px-4 py-3 rounded-xl bg-[var(--cp)] text-[#0f0f0f] text-center shadow-[0px_4px_20px_0_rgba(99,232,126,.35)] transition-transform duration-150 active:scale-95"
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
