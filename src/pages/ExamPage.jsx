import ExamCard from "../components/ExamCard";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useSearchParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/Pagination";
import useMobile from "../hooks/useMobile";
import {
  Search,
  SlidersHorizontal,
  X,
  LayoutGrid,
  List,
  SearchX,
  ChevronDown,
} from "lucide-react";

export default function ExamPage() {
  const [subjectFilter, setSubjectFilter] = useState("");
  const [universityFilter, setUniversityFilter] = useState("");
  const [systemFilter, setSystemFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const isMobile = useMobile();

  const [viewMode, setViewMode] = useState(() => (isMobile ? "grid" : "list"));
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    () => searchParams.get("search") || "",
  );

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("exams")
        .select("*")
        .order("created_at", { ascending: false })
        .eq("status", "approved");

      if (error) {
        console.error("Error fetching exams:", error);
      } else {
        setExams(data || []);
      }

      setLoading(false);
    };

    fetchExams();
  }, []);

  const institutions = [
    ...new Set(exams.map((exam) => exam.institution).filter(Boolean)),
  ];
  const subjects = [
    ...new Set(exams.map((exam) => exam.subject).filter(Boolean)),
  ];
  const systems = [
    ...new Set(
      exams
        .flatMap((exam) => exam.systems || [])
        .map((s) => s.system)
        .filter(Boolean),
    ),
  ];
  const allYears = [
    ...new Set(
      exams
        .flatMap((exam) => exam.systems || [])
        .flatMap((s) => s.years || [])
        .filter(Boolean),
    ),
  ];
  const availableYears = systemFilter
    ? allYears.filter((year) =>
        exams.some((exam) =>
          (exam.systems || []).some(
            (s) => s.system === systemFilter && s.years.includes(year),
          ),
        ),
      )
    : allYears;

  const filteredExams = exams.filter((exam) => {
    const matchSearch =
      (exam.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (exam.subject || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (exam.institution || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchSubject = !subjectFilter || exam.subject === subjectFilter;
    const matchInstitution =
      !universityFilter || exam.institution === universityFilter;
    const matchSystem =
      !systemFilter ||
      (exam.systems || []).some((s) => s.system === systemFilter);

    const matchYear =
      !yearFilter ||
      (exam.systems || []).some((s) => (s.years || []).includes(yearFilter));

    return (
      matchSearch &&
      matchSubject &&
      matchInstitution &&
      matchSystem &&
      matchYear
    );
  });

  const [currentPage, setCurrentPage] = useState(1);
  const examsPerPage = 9;
  const totalPages = Math.ceil(filteredExams.length / examsPerPage);
  const startIndex = (currentPage - 1) * examsPerPage;
  const endIndex = startIndex + examsPerPage;
  const currentExams = filteredExams.slice(startIndex, endIndex);

  const activeFilters = [
    universityFilter && {
      key: "university",
      label: universityFilter,
      clear: () => setUniversityFilter(""),
    },
    subjectFilter && {
      key: "subject",
      label: subjectFilter,
      clear: () => setSubjectFilter(""),
    },
    systemFilter && {
      key: "system",
      label:
        systemFilter === "lmd"
          ? "LMD"
          : systemFilter === "engineering"
            ? "Engineering"
            : "Medical",
      clear: () => {
        setSystemFilter("");
        setYearFilter("");
      },
    },
    yearFilter && {
      key: "year",
      label: yearFilter,
      clear: () => setYearFilter(""),
    },
  ].filter(Boolean);

  const selectBase =
    "w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-700 text-sm outline-none transition-all duration-200 focus:border-[#5ae4a8] focus:ring-2 focus:ring-[#5ae4a8]/25 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed appearance-none";

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="min-h-screen bg-gray-50/40">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 pt-14 pb-8 text-center">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#2f9e6d] font-roboto-mono">
            {exams.length}+ exams shared
          </span>
          <h1 className="text-3xl md:text-4xl text-slate-900 font-bold mt-2 mb-6 tracking-tight">
            Find your exam
          </h1>

          <div className="flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by title, subject, or university..."
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:border-[#5ae4a8] focus:ring-2 focus:ring-[#5ae4a8]/25 focus:bg-white focus:outline-none transition-all text-sm"
              />
            </div>
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-medium border transition-all duration-200 shrink-0 ${
                filtersOpen || activeFilters.length > 0
                  ? "bg-[#5ae4a8]/10 border-[#5ae4a8] text-[#2f9e6d]"
                  : "bg-[#16203a] border-gray-300 text-white hover:border-gray-300"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilters.length > 0 && (
                <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#5ae4a8] text-black text-xs font-bold">
                  {activeFilters.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      {filtersOpen && (
        <div className="bg-white border-b border-gray-100 animate-[slideDown_0.4s_ease-in]">
          <div className="max-w-5xl mx-auto px-6 py-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="relative">
                <select
                  value={universityFilter}
                  onChange={(e) => {
                    setUniversityFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className={selectBase}
                >
                  <option value="">All institutions</option>
                  {institutions.map((uni) => (
                    <option key={uni} value={uni}>
                      {uni}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={subjectFilter}
                  onChange={(e) => {
                    setSubjectFilter(e.target.value);
                    setCurrentPage(1);
                  }}
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
                  onChange={(e) => {
                    setSystemFilter(e.target.value);
                    setYearFilter("");
                    setCurrentPage(1);
                  }}
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
                  onChange={(e) => {
                    setYearFilter(e.target.value);
                    setCurrentPage(1);
                  }}
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

      <div className="max-w-5xl mx-auto px-6 pt-5 pb-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500">
            <span className="font-semibold text-gray-800">
              {filteredExams.length}
            </span>{" "}
            exam{filteredExams.length !== 1 ? "s" : ""}
          </span>
          {activeFilters.map((f) => (
            <button
              key={f.key}
              onClick={f.clear}
              className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full bg-[#5ae4a8]/10 border border-[#5ae4a8]/30 text-[#2f9e6d] text-xs font-medium hover:bg-[#5ae4a8]/20 transition-colors"
            >
              {f.label}
              <X className="w-3 h-3" />
            </button>
          ))}
        </div>

        {!isMobile && (
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === "grid"
                  ? "bg-white shadow-sm text-[#2f9e6d]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              aria-label="List view"
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === "list"
                  ? "bg-white shadow-sm text-[#2f9e6d]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* RESULTS */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredExams.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {currentExams.map((exam, index) => (
              <ExamCard
                key={exam.uuid}
                exam={exam}
                viewMode={viewMode}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <SearchX className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1.5">
              No exams found
            </h3>
            <p className="text-gray-500 text-sm">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSubjectFilter("");
                setUniversityFilter("");
                setCurrentPage(1);
                setSystemFilter("");
                setYearFilter("");
              }}
              className="mt-6 px-6 py-2.5 bg-[#5ae4a8] text-black font-medium rounded-xl shadow-[0px_4px_20px_0_rgba(99,232,126,.30)] hover:bg-[#4bcc94] hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Clear all filters
            </button>
          </div>
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </main>
  );
}
