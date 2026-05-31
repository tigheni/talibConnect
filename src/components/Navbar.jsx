import logo from '../assets/logo.svg';
import { Link } from 'react-router-dom';

export default function NavBoard() {
   return (
      <div className="fixed top-3 left-0 right-0 z-50 flex justify-center font-roboto-mono ">
         <nav className="h-16 w-full sm:max-w-3xl lg:max-w-5xl mx-5 flex items-center justify-between rounded-2xl bg-white/90 backdrop-blur-md border border-black/15 shadow-lg px-6">
            <Link to="/">
               <img src={logo} className="h-4  md:h-8 w-auto" alt="logo" />
            </Link>
            <div className="hidden sm:p-3  md:flex flex-1 text-black justify-center px-20 ">
               <div className="flex gap-5">
                  <Link
                     to="/"
                     className="text-sm font-medium sm:p-2 px-4 py-2 btn_hover_effects rounded-lg"
                  >
                     Home
                  </Link>
                  <Link
                     to="/browse"
                     className="text-sm font-medium sm:p-2 px-4  py-2 btn_hover_effects rounded-lg"
                  >
                     Upload
                  </Link>
                  <Link
                     to="/about"
                     className="text-sm font-medium sm:p-2 px-4 py-2 btn_hover_effects rounded-lg"
                  >
                     Exams
                  </Link>
                  <Link
                     to="/Contact"
                     className="text-sm font-medium sm:p-2 px-4 py-2 btn_hover_effects rounded-lg"
                  >
                     Contact
                  </Link>
               </div>
            </div>
            <div className=" hidden  md:flex items-center gap-5 ">
               <Link
                  to="/login"
                  className="login-btn text-sm font-medium sm:p-2  px-4 py-2 rounded-lg border border-gray-300 transition-all duration-300"
               >
                  <span className="relative z-10">Login</span>
               </Link>

               <Link
                  to="/register"
                  className="cursor-pointer sm:p-2 bg-[#4FE56D] shadow-[0px_4px_32px_0_rgba(99,232,126,.40)] px-6 py-3 rounded-xl border-[1px] border-[#63E87E] text-[#0f0f0f] font-medium group"
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
