import { ChevronDown } from "lucide-react";
import { YEAR_OPTIONS } from "../../constants/uploadForm";
import { useSearchParams } from "react-router-dom";
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
  setCurrentPage,
}) {
  const availableYears = (YEAR_OPTIONS[systemFilter] || []).map(
    (year) => year.value,
  );
  const [searchParams, setSearchParams] = useSearchParams();

  const handleUniversityChange = (e) => {
    const value = e.target.value;

    setUniversityFilter(value);
    updateFilter("university", value);
    setCurrentPage(1);
  };

  const handleSubjectChange = (e) => {
    const value = e.target.value;

    setSubjectFilter(value);
    updateFilter("subject", value);
    setCurrentPage(1);
  };

  const handleSystemChange = (e) => {
    const value = e.target.value;

    setSystemFilter(value);
    setYearFilter("");

    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set("system", value);
    } else {
      params.delete("system");
    }

    params.delete("year");

    setSearchParams(params);
    setCurrentPage(1);
  };

  const handleYearChange = (e) => {
    const value = e.target.value;

    setYearFilter(value);
    updateFilter("year", value);
    setCurrentPage(1);
  };

  const updateFilter = (name, value) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    setSearchParams(params);
  };

  return (
    <div className="bg-white border-b border-gray-100 animate-[slideDown_0.4s_ease-in]">
      <div className="max-w-5xl mx-auto px-6 py-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <select
              value={universityFilter}
              onChange={handleUniversityChange}
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
              onChange={handleSubjectChange}
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
              onChange={handleSystemChange}
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
              onChange={handleYearChange}
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
  );
}
