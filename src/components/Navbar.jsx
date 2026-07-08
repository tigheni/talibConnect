import logo from "../assets/logo.svg";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
      className={`sticky top-0 p-3 left-0 right-0 z-50 flex justify-center  font-roboto-mono ${isHome ? "bg-gradient-to-br from-gray-50 to-white shadow-sm" : ""} `}
    >
      <nav className="h-16 w-full sm:max-w-3xl lg:max-w-5xl mx-5 flex items-center justify-between rounded-xl bg-white/90 backdrop-blur-md border border-black/15 shadow-lg px-6">
        <Link to="/">
          <img src={logo} className="h-4  md:h-8 w-auto" alt="logo" />
        </Link>
        <div className="hidden sm:p-3  md:flex flex-1 text-black justify-center px-20 ">
          <div className="flex gap-5">
            <Link
              to="/"
              className="text-sm font-medium sm:p-2 px-4 py-2 btn_hover_effects rounded-xl"
            >
              Home
            </Link>
            <Link
              to="/upload"
              className="text-sm font-medium sm:p-2 px-4  py-2 btn_hover_effects rounded-xl"
            >
              Upload
            </Link>
            <Link
              to="/exams"
              className="text-sm font-medium sm:p-2 px-4 py-2 btn_hover_effects rounded-xl"
            >
              Exams
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium sm:p-2 px-4 py-2 btn_hover_effects rounded-xl"
            >
              Contact
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-sm font-medium px-4 py-2">
                Admin
              </Link>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {user && !isMobile ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#4FE56D] flex items-center justify-center text-black font-bold text-sm">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-gray-700 hidden md:block">
                  {user.user_metadata?.username}
                </span>
              </div>

              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  setUser(null);
                  navigate("/");
                }}
                className=" text-[#f35f62] bg-[#3b1c1d] text-sm font-medium sm:p-2   px-4 py-2 rounded-xl border-none  transition-all duration-200 hover:scale-110"
              >
                Logout
              </button>
            </>
          ) : (
            <div className=" hidden  md:flex items-center gap-5 ">
              <Link
                to="/login"
                className="login-btn text-sm font-medium sm:p-2  px-4 py-2 rounded-xl border border-gray-400 transition-all duration-200"
              >
                <span className="relative z-10 ">Login</span>
              </Link>

              <Link
                to="/register"
                className="cursor-pointer sm:p-2 bg-[var(--cp)] shadow-[0px_4px_32px_0_rgba(99,232,126,.40)] px-6 py-3 rounded-xl border-[1px] border-[#5ae4a8] text-[#0f0f0f] font-medium group"
              >
                <div className="relative overflow-hidden">
                  <p className="group-hover:-translate-y-10 duration-[1.2s] ease-[cubic-bezier(0.19,1,0.22,1)]">
                    Register
                  </p>
                  <p className="absolute top-7 left-0 group-hover:top-0 duration-[1.2s] ease-[cubic-bezier(0.19,1,0.22,1)]">
                    Register
                  </p>
                </div>
              </Link>
            </div>
          )}
        </div>
        <div className=" md:hidden ">
          <button
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
            }}
            className="text-2xl font-bold focus:outline-none"
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
          {isMenuOpen && (
            <div className="absolute top-16 left-0 right-0 bg-white/90 backdrop-blur-md flex flex-col p-4 gap-3 shadow-lg">
              <Link to="/">Home</Link>
              <Link to="/exams">Exams</Link>
              <Link to="/upload">Upload</Link>

              {user ? (
                <>
                  <div className="flex gap-2 py-2">
                    <div className="w-8 h-8 rounded-full bg-[#4FE56D] flex items-center justify-center text-black font-bold text-sm">
                      {user.email?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="text-sm text-gray-700">
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
                    className="text-red-500 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    Register
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
