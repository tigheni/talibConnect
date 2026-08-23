import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/Pagination";
import ExamHeader from "../components/exams/ExamHeader";
import ExamFilters from "../components/exams/ExamFilters";
import ExamToolbar from "../components/exams/ExamToolbar";
import ExamResults from "../components/exams/ExamResults";
import useMobile from "../hooks/useMobile";
import { useExams } from "../hooks/useExam";
import { useExamFilterOptions } from "../hooks/useExamFilterOptions";

const EXAMS_PER_PAGE = 9;

export default function ExamPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [subjectFilter, setSubjectFilter] = useState(
    () => searchParams.get("subject") || "",
  );

  const [universityFilter, setUniversityFilter] = useState(
    () => searchParams.get("university") || "",
  );

  const [systemFilter, setSystemFilter] = useState(
    () => searchParams.get("system") || "",
  );

  const [yearFilter, setYearFilter] = useState(
    () => searchParams.get("year") || "",
  );

  const isMobile = useMobile();
  const [viewMode, setViewMode] = useState(() => (isMobile ? "grid" : "list"));

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState(
    () => searchParams.get("search") || "",
  );

  const [searchInput, setSearchInput] = useState(searchTerm);
  const searchTimeout = useRef(null);

  const filters = {
    searchTerm,
    subjectFilter,
    universityFilter,
    systemFilter,
    yearFilter,
  };

  const { exams, totalCount, loading, error } = useExams(filters, currentPage);

  const { institutions, subjects, systems } = useExamFilterOptions();

  const totalPages = Math.ceil(totalCount / EXAMS_PER_PAGE);

  const activeFilters = [
    universityFilter && {
      key: "university",
      label: universityFilter,
      clear: () => {
        const params = new URLSearchParams(searchParams);

        setUniversityFilter("");
        params.delete("university");
        setSearchParams(params);

        setCurrentPage(1);
      },
    },
    subjectFilter && {
      key: "subject",
      label: subjectFilter,
      clear: () => {
        const params = new URLSearchParams(searchParams);

        setSubjectFilter("");
        params.delete("subject");
        setSearchParams(params);
        setCurrentPage(1);
      },
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
        const params = new URLSearchParams(searchParams);

        setSystemFilter("");
        setYearFilter("");
        params.delete("system");
        params.delete("year");
        setSearchParams(params);
        setCurrentPage(1);
      },
    },
    yearFilter && {
      key: "year",
      label: yearFilter,
      clear: () => {
        const params = new URLSearchParams(searchParams);

        setYearFilter("");
        params.delete("year");
        setSearchParams(params);
        setCurrentPage(1);
      },
    },
  ].filter(Boolean);

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50/40 px-6 py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-black text-slate-950">
            Unable to load exams
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Something went wrong while loading the exam archive. Please try
            again.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50/40">
      <ExamHeader
        examCount={totalCount}
        searchTerm={searchInput}
        onSearchChange={(e) => {
          const value = e.target.value;
          setSearchInput(value);

          clearTimeout(searchTimeout.current);
          searchTimeout.current = setTimeout(() => {
            setSearchTerm(value);
            setCurrentPage(1);
          }, 300);
        }}
        filtersOpen={filtersOpen}
        onToggleFilters={() => setFiltersOpen((open) => !open)}
        activeFilterCount={activeFilters.length}
      />

      {filtersOpen && (
        <ExamFilters
          universityFilter={universityFilter}
          setUniversityFilter={(value) => {
            setUniversityFilter(value);
            setCurrentPage(1);
          }}
          subjectFilter={subjectFilter}
          setSubjectFilter={(value) => {
            setSubjectFilter(value);
            setCurrentPage(1);
          }}
          systemFilter={systemFilter}
          setSystemFilter={(value) => {
            setSystemFilter(value);
            setCurrentPage(1);
          }}
          yearFilter={yearFilter}
          setYearFilter={(value) => {
            setYearFilter(value);
            setCurrentPage(1);
          }}
          institutions={institutions}
          subjects={subjects}
          systems={systems}
          setCurrentPage={setCurrentPage}
        />
      )}

      <ExamToolbar
        examCount={totalCount}
        activeFilters={activeFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        isMobile={isMobile}
      />
      {loading && (
        <div className="py-4">
          <LoadingSpinner />
        </div>
      )}

      <div className="mx-auto max-w-7xl px-6 py-8">
        <ExamResults
          exams={exams}
          viewMode={viewMode}
          onClearFilters={() => {
            const params = new URLSearchParams(searchParams);

            clearTimeout(searchTimeout.current);
            setSearchInput("");
            setSearchTerm("");
            setSubjectFilter("");
            setUniversityFilter("");
            setSystemFilter("");
            setYearFilter("");
            params.delete("university");
            params.delete("subject");
            params.delete("system");
            params.delete("year");
            setSearchParams(params);
            setCurrentPage(1);
          }}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </main>
  );
}
