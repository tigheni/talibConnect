import logo from '../assets/logo.svg';
import { Link } from 'react-router-dom';

export default function NavBoard() {
   return (
      <nav className="h-18 bg-white flex    items-center ">
         <div className="flex-shrink-0 flex   ">
            <Link to="/">
               <img
                  src={logo}
                  className="h-14 md:h-32  w-auto object-contain "
                  alt="logo"
               />
            </Link>
         </div>

         <div className="hidden md:flex flex-1 text-black justify-center gap-10 ">
            <div className="flex gap-10">
               <Link
                  to="/"
                  className="text-sm font-medium hover:bg-gray-100 p-2 rounded-lg transition-all ease-in duration-200"
               >
                  Home
               </Link>
               <Link
                  to="/browse"
                  className="text-sm font-medium hover:bg-gray-100 p-2 rounded-lg transition-all ease-in duration-200"
               >
                  Browse
               </Link>
               <Link
                  to="/about"
                  className="text-sm font-medium hover:bg-gray-100 p-2 rounded-lg transition-all ease-in duration-200"
               >
                  About
               </Link>
               <Link
                  to="/Contact"
                  className="text-sm font-medium hover:bg-gray-100 p-2 rounded-lg transition-all ease-in duration-200"
               >
                  Contact
               </Link>
            </div>
         </div>

         <div className="ml-auto hidden md:flex items-center gap-5 p-10">
            <Link
               to="/login"
               className="text-sm font-medium px-4 py-2 rounded-lg   hover:bg-gray-100 border border-transparent hover:border-gray-300 duration-300  ease-in-out"
            >
               Login
            </Link>

            <Link
               to="/register"
               className="cursor-pointer bg-[#63E87E] shadow-[0px_4px_32px_0_rgba(99,232,126,.40)] px-6 py-3 rounded-xl border-[1px] border-[#63E87E] text-[#0f0f0f] font-medium group"
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
   );
}
