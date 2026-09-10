import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatCard } from "../../ui/StatCard";
export function HomeHeader({ stats, subjects = [] }) {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const searchInputRef = useRef(null);

  const heroStats = useMemo(
    () => [
      { label: "Approved papers", value: stats[0].number },
      { label: "Universities covered", value: stats[1].number },
      { label: "Subjects available", value: stats[2].number },
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

  const subjectSuggestions = subjects.slice(0, 12);
  const subjectsLength = Math.max(0, subjects.length - 12);

  return (
    <header className="relative min-h-0 overflow-hidden border-b border-slate-200 bg-gradient-to-b from-white to-slate-50 pb-12 pt-20 md:py-16 lg:h-auto lg:py-16">
      <div className="mx-auto flex h-auto w-full max-w-[120rem] items-center px-4 sm:px-6 lg:px-10 lg:py-0 2xl:px-12">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative">
            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#237a54]">
              Algerian exam archive
            </p>
            <h1 className="mt-3 max-w-4xl text-3xl font-black tracking-[-0.05em] text-slate-900 sm:text-5xl lg:text-6xl">
              Find approved exam papers from Algerian universities.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">
              Search exam papers by subject, university, teacher, or year. The
              homepage shows the latest approved uploads in one place.
            </p>

            <form onSubmit={handleSearch} className="mt-8 max-w-3xl">
              <div className="flex flex-col gap-2 rounded-[1.4rem] border border-slate-200 bg-white p-2 shadow-[0_12px_35px_rgba(15,23,42,0.08)] transition-shadow duration-300 focus-within:shadow-[0_12px_35px_rgba(15,23,42,0.14)] sm:flex-row sm:items-stretch sm:gap-3 sm:p-3">
                <div className="flex flex-1 items-center gap-3 rounded-[1rem] border border-slate-300 bg-slate-50 px-4 py-3 transition-colors duration-200 focus-within:border-[#2f9e6d]/30 focus-within:bg-white">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 shrink-0 text-[#2f9e6d]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.2-3.2" />
                  </svg>

                  <span className="hidden shrink-0 font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500 sm:inline">
                    Search
                  </span>

                  <span className="hidden h-4 w-px shrink-0 bg-slate-200 sm:inline-block" />

                  <input
                    ref={searchInputRef}
                    type="search"
                    name="search"
                    placeholder="subject, university, year"
                    aria-label="Search exams"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="w-full bg-transparent text-[15px] text-slate-900 outline-none placeholder:text-slate-400 [&::-webkit-search-cancel-button]:hidden"
                  />

                  {searchValue && (
                    <button
                      type="button"
                      onClick={() => setSearchValue("")}
                      aria-label="Clear search"
                      className="shrink-0 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
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
                  className="rounded-[1rem] border border-[#2f9e6d] bg-[#2f9e6d] px-6 py-3.5 text-sm font-bold uppercase tracking-[0.22em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#237a54] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f9e6d]"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="mt-4 flex flex-wrap gap-2">
              {subjectSuggestions.map((subject) => (
                <button
                  key={subject}
                  type="button"
                  onClick={() => handleSubjectClick(subject)}
                  className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-slate-950 hover:text-slate-950"
                >
                  {subject}
                </button>
              ))}
              {subjectsLength > 0 && (
                <span
                  key={subjectsLength}
                  className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-slate-950 hover:text-slate-950"
                >
                  + {subjectsLength}
                </span>
              )}
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
