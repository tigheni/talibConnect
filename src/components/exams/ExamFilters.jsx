import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import { YEAR_OPTIONS } from "../../constants/uploadForm";
import { useState } from "react";

const selectBase =
  "w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-700 text-sm outline-none transition-all duration-200 focus:border-[#5ae4a8] focus:ring-2 focus:ring-[#5ae4a8]/25 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed appearance-none";

export default function ExamFilters({
  universityFilter,
  setUniversityFilter,
  subjectFilter,
  setSubjectFilter,
  systemFilter,
  setSystemFilter,
  yearFilter,
  setYearFilter,
  institutions,
  subjects,
  systems,
  searchTerm,
  onSearchChange,
  activeFilterCount,
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  const availableYears = (YEAR_OPTIONS[systemFilter] || []).map(
    (year) => year.value,
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />

          <input
            type="text"
            value={searchTerm}
            onChange={onSearchChange}
            placeholder="Search by title, subject, or university..."
            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:border-[#5ae4a8] focus:ring-2 focus:ring-[#5ae4a8]/25 focus:bg-white focus:outline-none transition-all text-sm"
          />
        </div>

        <button
          type="button"
          onClick={() => setFiltersOpen((open) => !open)}
          className={`flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-medium border transition-all duration-200 shrink-0 ${
            filtersOpen || activeFilterCount > 0
              ? "bg-[#5ae4a8]/10 border-[#5ae4a8] text-[#2f9e6d]"
              : "bg-[#16203a] border-gray-300 text-white hover:border-gray-300"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#5ae4a8] text-black text-xs font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {filtersOpen && (
        <div className="bg-white border-b border-gray-100 animate-[slideDown_0.4s_ease-in]">
          <div className="max-w-5xl mx-auto px-6 py-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Institution */}
              <div className="relative">
                <select
                  value={universityFilter}
                  onChange={(e) => setUniversityFilter(e.target.value)}
                  className={selectBase}
                >
                  <option value="">All institutions</option>

                  {institutions.map((institution) => (
                    <option key={institution} value={institution}>
                      {institution}
                    </option>
                  ))}
                </select>

                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className={selectBase}
                >
                  <option value="">All subjects</option>

                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>

                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={systemFilter}
                  onChange={(e) => setSystemFilter(e.target.value)}
                  className={selectBase}
                >
                  <option value="">All systems</option>

                  {systems.map((system) => (
                    <option key={system} value={system}>
                      {system === "lmd"
                        ? "LMD"
                        : system === "engineering"
                          ? "Engineering"
                          : "Medical"}
                    </option>
                  ))}
                </select>

                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className={selectBase}
                  disabled={!systemFilter}
                >
                  <option value="">Year of study</option>

                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>

                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
