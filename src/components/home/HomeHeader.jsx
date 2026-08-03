import { useMemo, useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
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
export function HomeHeader({ stats }) {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const searchInputRef = useRef(null);

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

  const fetchSubjects = async () => {
    const { data, error } = await supabase
      .from("exams")
      .select("subject")
      .eq("status", "approved");
    setSubjectsLength(data.length - 15);

    if (error) {
      throw error;
    }

    return [...new Set(data.slice(0, 15).map((item) => item.subject))];
  };
  const [subjects, setSubjects] = useState([]);
  const [subjectsLength, setSubjectsLength] = useState([]);

  useEffect(() => {
    const loadSubjects = async () => {
      const data = await fetchSubjects();
      setSubjects(data);
    };
    loadSubjects();
  }, []);
  return (
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
                    placeholder="subject, university, year"
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
              {subjects.map((subject) => (
                <button
                  key={subject}
                  type="button"
                  onClick={() => handleSubjectClick(subject)}
                  className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-slate-950 hover:text-slate-950"
                >
                  {subject}
                </button>
              ))}
              <button
                key={subjectsLength}
                type="button"
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-slate-950 hover:text-slate-950"
              >
                + {subjectsLength}
              </button>
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
  );
}
