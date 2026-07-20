import ExamCard from "../components/ExamCard";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.search.value;
    if (query.trim()) {
      navigate(`/exams?search=${query}`);
    }
  };
  const [recentExams, setRecentExams] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      const { data: examsData, error: examsError } = await supabase
        .from("exams")
        .select("*")
        .order("created_at", { ascending: false })
        .eq("status", "approved");

      if (examsError) {
        console.error("Error fetching exams:", examsError);
        return;
      }

      const { data: userData, error: userError } =
        await supabase.rpc("get_user_count");
      const userCount = userError ? 0 : userData || 0;

      const { data: uniData, error: uniError } = await supabase
        .from("exams")
        .select("institution")
        .eq("status", "approved");
      let universityCount = 0;
      if (!uniError && uniData) {
        const uniqueUniversities = [
          ...new Set(uniData.map((item) => item.institution)),
        ];

        uniqueUniversities[0]
          ? (universityCount = uniqueUniversities.length)
          : (universityCount = 0);
      }
      setRecentExams(examsData.slice(0, 6) || []);

      setStats([
        {
          id: 1,
          number: `${examsData?.length || 0}+`,
          label: "Exams Available",
        },
        { id: 2, number: `${universityCount}+`, label: "institutions" },
        { id: 3, number: `${userCount}+`, label: "Active Students" },
      ]);
    };

    fetchAllData();
  }, []);
  return (
    <main className="font-inter">
      <header className="hero relative overflow-hidden">
        <div className="hero-content relative flex flex-col items-center justify-center gap-6 px-4  ">
          <span className=" hidden text-xs font-medium tracking-wide uppercase px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-black/10 text-gray-700 shadow-sm">
            10,000+ students already here
          </span>

          <h1 className="text-5xl md:text-6xl font-bold text-center leading-tight drop-shadow-md max-w-7xl">
            Ace your exams with past papers from{" "}
            <span className="text-[#3fcf8e]">Algerian institutions</span>
          </h1>

          <h2 className="text-base md:text-xl italic text-center mx-auto drop-shadow text-gray-700">
            Every past exam, organized in one place
          </h2>

          <form
            role="search"
            className="w-full flex justify-center mt-2 px-4"
            onSubmit={handleSearch}
          >
            <div className="relative  w-full max-w-[22rem] sm:max-w-md md:max-w-lg focus-within:max-w-full sm:focus-within:max-w-xl md:focus-within:max-w-2xl transition-[max-width] duration-300 ease-in-out">
              <svg
                className="absolute z-10 left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="7" strokeWidth="2" />
                <line
                  x1="16.5"
                  y1="16.5"
                  x2="22"
                  y2="22"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>

              <input
                type="search"
                name="search"
                placeholder="Search your exams now"
                aria-label="Search exams"
                className="w-full placeholder-[#575757] bg-white/90 backdrop-blur-md border border-black/10 focus:border-[#5ae4a8] focus:ring-2 focus:ring-[#5ae4a8]/25 outline-none transition-all duration-300 ease-in-out pl-10 pr-16 py-3.5 rounded-xl shadow-sm"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#5ae4a8] text-black text-sm font-semibold px-4 py-2 rounded-lg shadow-[0px_4px_16px_0_rgba(99,232,126,.35)] transition-transform duration-200 hover:scale-105 active:scale-95"
              >
                GO!
              </button>
            </div>
          </form>
          <div className="flex w-full max-w-xl relative flex-wrap justify-center gap-2 mt-2">
            {[
              "Mathematics",
              "Physics",
              "Chemistry",
              "Law",
              "Medicine",
              "Computer Science",
              "Biology",
            ].map((subject) => (
              <button
                key={subject}
                className="px-4 py-1.5 rounded-full border border-black/10 bg-white/70 backdrop-blur-md text-black text-sm font-medium transition-all duration-200 hover:border-[#5ae4a8] hover:text-[#2f9e6d] hover:bg-white active:scale-95"
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
      <section className="py-16">
        <div className="text-center px-4">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#3fcf8e]">
            The numbers
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-black mt-2 mb-3">
            Our community by the numbers
          </h2>
          <p className="text-gray-600">
            Join 10,000+ students already preparing smarter
          </p>
        </div>
        <div className="max-w-6xl mx-auto py-10 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/5 transition-all duration-300 hover:border-[#5ae4a8]/30 hover:-translate-y-1"
              >
                <h3 className="text-4xl md:text-5xl font-bold text-[#5ae4a8] mb-2 tracking-tight">
                  {stat.number}
                </h3>
                <p className="text-gray-400 text-sm uppercase tracking-wide">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-4">
        <div className="flex items-end justify-between flex-wrap gap-2 mb-1">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Latest exam papers
            </h1>
            <p className="text-gray-600 mt-1">
              Freshly uploaded by students like you
            </p>
          </div>
          <Link
            to="/exams"
            className="text-sm font-medium text-[#2f9e6d] hover:text-[#237a54] transition-colors duration-150 whitespace-nowrap"
          >
            View all exams →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {recentExams.map((exams) => (
            <ExamCard key={exams.uuid} exam={exams} viewMode={"grid"} />
          ))}
        </div>
      </section>
      <div className="max-w-6xl mx-auto my-8 py-8">
        <div className="flex justify-center gap-1.5">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="w-1 h-3 bg-gray-800/70 rounded-full"
              style={{ transform: "rotate(45deg)" }}
            ></div>
          ))}
        </div>
      </div>
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl p-8 md:p-14 text-center border border-white/5">
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[#5ae4a8]/10 blur-3xl pointer-events-none" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to ace your exams?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
              Join for free. Start browsing exams in 30 seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-[#5ae4a8] text-black px-8 py-3 rounded-xl font-semibold shadow-[0px_4px_24px_0_rgba(99,232,126,.35)] transition-all duration-300 hover:bg-[#4bc864] hover:scale-105 active:scale-95"
              >
                Register now
              </Link>
              <Link
                to="/exams"
                className="border border-gray-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-white/10 hover:border-gray-400"
              >
                Browse exams
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
