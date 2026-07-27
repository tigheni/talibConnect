import ExamCard from "../components/ExamCard";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Law",
  "Medicine",
  "Computer Science",
  "Biology",
];

const FEATURES = [
  {
    title: "Fast search",
    description: "Search by subject, university, teacher, or year.",
    icon: "01",
  },
  {
    title: "Approved papers",
    description: "Only approved exam papers appear on the homepage.",
    icon: "02",
  },
  {
    title: "Clear organization",
    description: "A simple layout that helps students find papers quickly.",
    icon: "03",
  },
];

function formatNumber(value) {
  const num = Number(value) || 0;
  return new Intl.NumberFormat("en-US").format(num);
}

function FeatureBlock({ title, description, icon }) {
  return (
    <div className="group relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      <div className="mb-4">
        <span className="text-3xl font-black tracking-tight text-slate-950">
          {icon}
        </span>
      </div>
      <h3 className="text-lg font-bold tracking-tight text-slate-950">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="group relative rounded-xl border border-[#1E2A4A]/12 bg-[#FBF9F4] px-6 py-5 text-left shadow-[0_1px_2px_rgba(30,42,74,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(30,42,74,0.12)]">
      <div className="absolute inset-y-3 left-0 border-l-2 border-dashed border-[#1E2A4A]/15" />

      <div className="absolute -right-2 -top-2 flex h-9 w-9 rotate-12 items-center justify-center rounded-full border-2 border-[#C1392B]/70 text-[#C1392B]/70 opacity-0 transition-all duration-300 group-hover:-rotate-6 group-hover:opacity-100">
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div className="pl-3">
        <div className="font-serif text-3xl font-bold leading-none tracking-tight text-[#1E2A4A] lg:text-4xl">
          {value}
        </div>
        <div className="mt-2 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-[#1E2A4A]/50">
          {label}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const [stats, setStats] = useState([
    { id: 1, number: "0+", label: "Exams Available" },
    { id: 2, number: "0+", label: "Institutions" },
    { id: 3, number: "0+", label: "Active Students" },
  ]);
  const [recentExams, setRecentExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  const heroStats = useMemo(
    () => [
      { label: "Approved papers", value: stats[0].number },
      { label: "Universities covered", value: stats[1].number },
      { label: "Students helped", value: stats[2].number },
    ],
    [stats],
  );

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchValue.trim();
    if (query) {
      navigate(`/exams?search=${encodeURIComponent(query)}`);
    }
  };

  const handleSubjectClick = (subject) => {
    setSearchValue(subject);
    searchInputRef.current?.focus();
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);

      const { data: examsData, error: examsError } = await supabase
        .from("exams")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (examsError) {
        console.error("Error fetching exams:", examsError);
        setLoading(false);
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
          ...new Set(uniData.map((item) => item.institution).filter(Boolean)),
        ];
        universityCount = uniqueUniversities.length;
      }

      setRecentExams((examsData || []).slice(0, 6));
      setStats([
        {
          id: 1,
          number: `${formatNumber(examsData?.length || 0)}+`,
          label: "Exams Available",
        },
        {
          id: 2,
          number: `${formatNumber(universityCount)}+`,
          label: "Institutions",
        },
        {
          id: 3,
          number: `${formatNumber(userCount)}+`,
          label: "Active Students",
        },
      ]);
      setLoading(false);
    };

    fetchAllData();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="relative h-dvh overflow-hidden border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="grid w-full items-center gap-8 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="relative">
              <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#2f9e6d]">
                Algerian exam archive
              </p>
              <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-[-0.05em] text-slate-950 sm:text-5xl lg:text-6xl lg:leading-[0.95]">
                Find approved exam papers from Algerian universities.
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">
                Search exam papers by subject, university, teacher, or year. The
                homepage shows the latest approved uploads in one place.
              </p>

              <form onSubmit={handleSearch} className="mt-8 max-w-3xl">
                <div className="flex flex-col gap-2 rounded-[1.4rem] border border-[#1E2A4A]/12 bg-white p-2 shadow-[0_12px_35px_rgba(30,42,74,0.08)] transition-shadow duration-300 focus-within:shadow-[0_12px_35px_rgba(30,42,74,0.14)] sm:flex-row sm:items-stretch sm:gap-3 sm:p-3">
                  <div className="flex flex-1 items-center gap-3 rounded-[1rem] border border-[#1E2A4A]/10 bg-[#FBF9F4] px-4 py-3 transition-colors duration-200 focus-within:border-[#1E2A4A]/30 focus-within:bg-white">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4 shrink-0 text-[#1E2A4A]/40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="7" />
                      <path d="m20 20-3.2-3.2" />
                    </svg>

                    <span className="hidden shrink-0 font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-[#1E2A4A]/45 sm:inline">
                      Search
                    </span>

                    <span className="hidden h-4 w-px shrink-0 bg-[#1E2A4A]/10 sm:inline-block" />

                    <input
                      ref={searchInputRef}
                      type="search"
                      name="search"
                      placeholder="subject, university, teacher, year"
                      aria-label="Search exams"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      className="w-full bg-transparent text-[15px] text-[#1E2A4A] outline-none placeholder:text-slate-400 [&::-webkit-search-cancel-button]:hidden"
                    />

                    {searchValue && (
                      <button
                        type="button"
                        onClick={() => setSearchValue("")}
                        aria-label="Clear search"
                        className="shrink-0 rounded-full p-1 text-[#1E2A4A]/40 transition-colors hover:bg-[#1E2A4A]/5 hover:text-[#1E2A4A]/70"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="h-3.5 w-3.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        >
                          <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="rounded-[1rem] border border-[#1E2A4A] bg-[#1E2A4A] px-6 py-3.5 text-sm font-bold uppercase tracking-[0.22em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#16203A] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E2A4A]"
                  >
                    Search
                  </button>
                </div>
              </form>

              <div className="mt-4 flex flex-wrap gap-2">
                {SUBJECTS.map((subject) => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => handleSubjectClick(subject)}
                    className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-slate-950 hover:text-slate-950"
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>
            <div className="hidden lg:flex lg:flex-col lg:justify-center lg:gap-4">
              {heroStats.map((item) => (
                <StatCard
                  key={item.label}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-5 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <FeatureBlock key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <div className="mb-1 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">
              Latest exam papers
            </h2>
            <p className="mt-1 text-gray-600">
              Recently approved papers uploaded by students.
            </p>
          </div>
          <Link
            to="/exams"
            className="whitespace-nowrap text-sm font-medium text-[#2f9e6d] transition-colors duration-150 hover:text-[#237a54]"
          >
            View all exams →
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-52 animate-pulse rounded-2xl bg-slate-100"
                />
              ))
            : recentExams.map((exams) => (
                <ExamCard key={exams.uuid} exam={exams} viewMode={"grid"} />
              ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-[1.8rem] border border-slate-300 bg-slate-950 p-8 shadow-[0_18px_60px_rgba(15,23,42,0.2)] lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
              Registration
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight text-white md:text-5xl">
              Create an account and start browsing papers.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 md:text-base">
              Register for free, search the archive, and find the papers you
              need for revision.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link
              to="/register"
              className="rounded-full bg-white px-8 py-3.5 text-center text-sm font-bold uppercase tracking-[0.22em] text-slate-950 transition-transform duration-200 hover:-translate-y-0.5"
            >
              Register now
            </Link>
            <Link
              to="/exams"
              className="rounded-full border border-white/15 bg-white/5 px-8 py-3.5 text-center text-sm font-bold uppercase tracking-[0.22em] text-white transition-colors duration-200 hover:bg-white/10"
            >
              Browse exams
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
