import ExamCard from "../components/ExamCard";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [universityCount, setUniversityCount] = useState(0);
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
      setUserCount(userCount);
      setUniversityCount(universityCount);

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
    <div className="font-inter">
      <header className="hero">
        <div className="hero-content flex flex-col items-center justify-center gap-5 ">
          <h1 className="text-2xl md:text-4xl font-bold  drop-shadow-md">
            Ace your exams with past papers from Algerian institutions
          </h1>
          <h2 className="text-lg md:text-xl italic mx-auto drop-shadow">
            Every past exam, Organized in one place
          </h2>
          <form
            role="search"
            className="w-full flex justify-center"
            onSubmit={handleSearch}
          >
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
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
                placeholder="Search Your Exams Now"
                aria-label="Search exams"
                className="w-75 placeholder-[#575757] md:w-100 border focus:w-[90vw] focus:md:w-[50vw] transition-all  focus:border-gray-500 outline-none duration-300 ease-in-out px-9 py-3 rounded-lg"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#5ae4a8] text-black text-sm px-3 py-1 rounded-md hover:bg-[#52c76a]"
              >
                GO!
              </button>
            </div>
          </form>
          <div className="flex w-90 relative flex-wrap justify-center gap-2 mt-4">
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
                className="px-4 py-1.5  rounded-lg border border-gray-300 bg-gray-200 text-black text-sm  hover:text-green-600 transition-colors duration-200"
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
      <section>
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-3">
            Our Community By the Numbers
          </h2>
          <p className="text-gray-600">
            Join 10,000+ students already preparing smarter
          </p>
        </div>
        <section className="max-w-6xl mx-auto py-12 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800 "
              >
                <h3 className="text-3xl md:text-4xl font-bold text-[#5ae4a8] mb-2">
                  {stat.number}
                </h3>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      </section>
      <section className="max-w-6xl mx-auto px-2">
        <h1 className="text-2xl font-bold mb-4">Latest Exam Papers</h1>
        <p className="text-gray-600">Freshly uploaded by students like you</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {recentExams.map((exams) => (
            <ExamCard key={exams.id} exam={exams} viewMode={"grid"} />
          ))}
        </div>
      </section>

      <div className="max-w-6xl mx-auto my-8 py-8">
        <div className="flex justify-center gap-1">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="w-1 h-3 bg-gray-800"
              style={{ transform: "rotate(45deg)" }}
            ></div>
          ))}
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="bg-gradient-to-r from-[#1a1a1a] to-[#0a0a0a] rounded-2xl p-8 md:p-12 text-center border border-gray-800">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Ace Your Exams?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Join for free. Start browsing exams in 30 seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#5ae4a8] text-black px-8 py-3 rounded-lg font-semibold hover:bg-[#4bc864] transition-all duration-300 transform hover:scale-105">
              <Link to="/register">Register Now</Link>
            </button>
            <button className="border border-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300">
              <Link to="/exams">Browse Exams</Link>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
