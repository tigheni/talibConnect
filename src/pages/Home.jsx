export default function Home() {
   return (
      <div>
         <header className="h-screen flex flex-col justify-center items-center text-white text-center px-4">
            <h1 className="text-4xl  md:text-6xl font-bold mb-4 drop-shadow-md"></h1>
            <p className="text-lg md:text-xl max-w-md drop-shadow"></p>
         </header>
         <main className="relative z-10 bg-white text-gray-800 min-h-screen py-16 px-8">
            <div className="max-w-3xl mx-auto">
               <h2 className="text-3xl font-bold mb-4"></h2>
               <p className="text-gray-600 leading-relaxed"></p>
            </div>
         </main>
      </div>
   );
}
