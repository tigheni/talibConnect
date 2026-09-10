import logo from "../assets/logo.svg";
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/authContext/useAuth";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAdmin } = useAuth();
  const navLinkClass = ({ isActive }) => `rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${isActive ? "bg-[#2f9e6d] text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"}`;
  const closeMenu = () => setIsMenuOpen(false);
  const logoutAdmin = async () => { await supabase.auth.signOut(); closeMenu(); };
  const links = <>
    <NavLink to="/" end className={navLinkClass}>Home</NavLink>
    <NavLink to="/exams" className={navLinkClass}>Exams</NavLink>
    <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
    {isAdmin && <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>}
  </>;

  return <div className="sticky top-0 z-50 flex justify-center px-3 pt-3">
    <nav className="relative flex h-16 w-full max-w-[120rem] items-center justify-between rounded-2xl border border-slate-200 bg-white/80 px-4 font-mono shadow-[0_12px_35px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:px-6">
      <Link to="/" className="shrink-0" onClick={closeMenu}><img src={logo} className="h-5 w-auto sm:h-6 lg:h-7" alt="TalibConnect" width={250} height={100} /></Link>
      <div className="hidden flex-1 justify-center px-4 lg:flex"><div className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1">{links}</div></div>
      <div className="flex items-center gap-3">
        <Link
          to="/upload"
          className="hidden rounded-xl bg-[#2f9e6d] px-4 py-2.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(47,158,109,0.2)] transition hover:bg-[#237a54] lg:block"
        >
          Submit resource
        </Link>
        {isAdmin && <button onClick={logoutAdmin} className="hidden rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 lg:block">Admin logout</button>}
        <button onClick={() => setIsMenuOpen((open) => !open)} aria-label={isMenuOpen ? "Close menu" : "Open menu"} className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-xl lg:hidden">{isMenuOpen ? "×" : "☰"}</button>
      </div>
      {isMenuOpen && <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 flex flex-col gap-1 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_20px_60px_rgba(15,23,42,0.12)] lg:hidden">
        <Link to="/" onClick={closeMenu} className="rounded-xl px-4 py-3 text-sm text-slate-700">Home</Link><Link to="/exams" onClick={closeMenu} className="rounded-xl px-4 py-3 text-sm text-slate-700">Exams</Link><Link to="/upload" onClick={closeMenu} className="rounded-xl px-4 py-3 text-sm text-slate-700">Submit resource</Link><Link to="/contact" onClick={closeMenu} className="rounded-xl px-4 py-3 text-sm text-slate-700">Contact</Link>
        {isAdmin && <><Link to="/admin" onClick={closeMenu} className="rounded-xl px-4 py-3 text-sm text-slate-700">Admin</Link><button onClick={logoutAdmin} className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-left text-sm text-rose-700">Admin logout</button></>}
      </div>}
    </nav>
  </div>;
}
