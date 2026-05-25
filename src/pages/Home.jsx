export default function Home() {
  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.search.value;
    console.log('Search query:', query);
  };
  return (
    <div>
      <header className="hero font-inter ">
        <div className="hero-content flex flex-col items-center justify-center gap-5 mt-35">
          <h1 className="text-2xl md:text-4xl font-bold  drop-shadow-md">
            Your ultimate hub to prepare for and master your finals
          </h1>
          <h2 className="text-lg md:text-xl italic mx-auto drop-shadow">
            Every past exam, Organized in one place
          </h2>
          <form
            role="search"
            className="w-full flex justify-center"
            onSubmit={handleSearch}
          >
            <div class="relative">
              <svg
                class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="7" stroke-width="2" />
                <line
                  x1="16.5"
                  y1="16.5"
                  x2="22"
                  y2="22"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
              <input
                type="search"
                name="search"
                placeholder="Search Your Exams Now"
                aria-label="Search exams"
                className="w-75 md:w-100 border focus:w-[50vw] transition-all  focus:border-gray-300 outline-none duration-300 ease-in-out px-9 py-3 rounded-lg"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-black text-sm px-3 py-1 rounded-md hover:bg-gray-200"
              >
                GO!
              </button>
            </div>
          </form>
          <div className="flex w-90 relative flex-wrap justify-center gap-2 mt-4">
            {[
              'Mathematics',
              'Physics',
              'Chemistry',
              'Law',
              'Medicine',
              'Computer Science',
              'Biology',
            ].map((subject) => (
              <button
                key={subject}
                className="px-4 py-1.5  rounded-lg border border-white text-white text-sm hover:bg-white hover:text-green-600 transition-colors duration-200"
                onClick={() => {
                  document.querySelector('input[name="search"]').value =
                    subject;
                }}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>
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
