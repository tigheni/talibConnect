import logo from '../assets/logo.svg';
import { Link } from 'react-router-dom';

export default function NavBoard() {
   return (
      <div className="fixed top-3 left-0 right-0 z-50 flex justify-center font-roboto-mono ">
         <nav className="h-16 w-full max-w-5xl mx-4 flex items-center justify-between rounded-2xl bg-white/90 backdrop-blur-md border border-black/15 shadow-lg px-6">
            <div className="flex-shrink-0 flex   ">
               <Link to="/">
                  <img
                     src={logo}
                     className="h-6 w-auto object-contain"
                     alt="logo"
                  />
               </Link>
            </div>
            <div className="hidden md:flex flex-1 text-black justify-center px-20 ">
               <div className="flex gap-2">
                  <Link
                     to="/"
                     className="text-sm font-medium px-4 py-2 btn_hover_effects rounded-lg"
                  >
                     Home
                  </Link>
                  <Link
                     to="/browse"
                     className="text-sm font-medium px-4 py-2 btn_hover_effects rounded-lg"
                  >
                     Upload
                  </Link>
                  <Link
                     to="/about"
                     className="text-sm font-medium px-4 py-2 btn_hover_effects rounded-lg"
                  >
                     Exams
                  </Link>
                  <Link
                     to="/Contact"
                     className="text-sm font-medium px-4 py-2 btn_hover_effects rounded-lg"
                  >
                     Contact
                  </Link>
               </div>
            </div>
            <div className="ml-auto hidden md:flex items-center gap-5 ">
               <Link
                  to="/login"
                  className="login-btn text-sm font-medium px-4 py-2 rounded-lg border border-gray-300 transition-all duration-300"
               >
                  <span className="relative z-10">Login</span>
               </Link>

               <Link
                  to="/register"
                  className="cursor-pointer bg-[#4FE56D] shadow-[0px_4px_32px_0_rgba(99,232,126,.40)] px-6 py-3 rounded-xl border-[1px] border-[#63E87E] text-[#0f0f0f] font-medium group"
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
            <div className="ml-auto md:hidden">
               <button className="text-2xl">☰</button>
            </div>
         </nav>
      </div>
   );
}
