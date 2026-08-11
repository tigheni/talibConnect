import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/Pagination";
import ExamHeader from "../components/exams/ExamHeader";
import ExamFilters from "../components/exams/ExamFilters";
import ExamToolbar from "../components/exams/ExamToolbar";
import ExamResults from "../components/exams/ExamResults";
import useMobile from "../hooks/useMobile";
import useExamFilters from "../hooks/useExamFilters";
import { useExams } from "../hooks/useExam";

export default function ExamPage() {
  const [subjectFilter, setSubjectFilter] = useState("");
  const [universityFilter, setUniversityFilter] = useState("");
  const [systemFilter, setSystemFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const isMobile = useMobile();

  const [viewMode, setViewMode] = useState(() => (isMobile ? "grid" : "list"));
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    () => searchParams.get("search") || "",
  );
  const { exams, loading } = useExams();

  const { institutions, subjects, systems, availableYears, filteredExams } =
    useExamFilters(exams, {
      searchTerm,
      subjectFilter,
      universityFilter,
      systemFilter,
      yearFilter,
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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="min-h-screen bg-gray-50/40">
      <ExamHeader
        examCount={exams.length}
        searchTerm={searchTerm}
        onSearchChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        filtersOpen={filtersOpen}
        onToggleFilters={() => setFiltersOpen((open) => !open)}
        activeFilterCount={activeFilters.length}
      />
      {filtersOpen && (
        <ExamFilters
          universityFilter={universityFilter}
          setUniversityFilter={setUniversityFilter}
          subjectFilter={subjectFilter}
          setSubjectFilter={setSubjectFilter}
          systemFilter={systemFilter}
          setSystemFilter={setSystemFilter}
          yearFilter={yearFilter}
          setYearFilter={setYearFilter}
          institutions={institutions}
          subjects={subjects}
          systems={systems}
          availableYears={availableYears}
          setCurrentPage={setCurrentPage}
        />
      )}

      <ExamToolbar
        examCount={filteredExams.length}
        activeFilters={activeFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        isMobile={isMobile}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <ExamResults
          exams={currentExams}
          viewMode={viewMode}
          onClearFilters={() => {
            setSearchTerm("");
            setSubjectFilter("");
            setUniversityFilter("");
            setSystemFilter("");
            setYearFilter("");
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
