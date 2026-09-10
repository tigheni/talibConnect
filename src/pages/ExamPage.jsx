import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/Pagination";
import ExamHeader from "../components/exams/ExamHeader";
import ExamFilters from "../components/exams/ExamFilters";
import ExamToolbar from "../components/exams/ExamToolbar";
import ExamResults from "../components/exams/ExamResults";
import useMobile from "../hooks/useMobile";

import { useExams } from "../hooks/useExams";
import { useExamFilterOptions } from "../hooks/useExamFilterOptions";
import SEO from "../components/SEO";

const EXAMS_PER_PAGE = 12;
const FILTER_KEYS = ["university", "subject", "system", "year", "search"];
const SYSTEM_LABELS = {
  lmd: "LMD",
  engineering: "Engineering",
  medical: "Medical",
};

export default function ExamPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { viewMode, setViewMode, isMobile } = useMobile();

  const searchTimeout = useRef(null);

  const universityFilter = searchParams.get("university") || "";
  const subjectFilter = searchParams.get("subject") || "";
  const systemFilter = searchParams.get("system") || "";
  const yearFilter = searchParams.get("year") || "";
  const searchTerm = searchParams.get("search") || "";

  const [searchInput, setSearchInput] = useState(searchTerm);

  const currentPage = Math.max(1, Number(searchParams.get("page")) || 1);

  useEffect(() => {
    // This state intentionally mirrors the URL after navigation.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchInput(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    return () => {
      clearTimeout(searchTimeout.current);
    };
  }, []);

  const filters = {
    searchTerm,
    subjectFilter,
    universityFilter,
    systemFilter,
    yearFilter,
  };

  const { exams, totalCount, totalPages, loading, error } = useExams(
    filters,
    currentPage,
    EXAMS_PER_PAGE,
  );

  const { institutions, subjects, systems } = useExamFilterOptions();

  const updateParams = (updates = {}, resetPage = true) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    if (resetPage) {
      params.delete("page");
    }

    setSearchParams(params);
  };

  const handleFilterChange = (key, value, relatedUpdates = {}) => {
    updateParams({ [key]: value, ...relatedUpdates });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;

    setSearchInput(value);

    clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(() => {
      handleFilterChange("search", value);
    }, 300);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);

    if (page > 1) {
      params.set("page", page);
    } else {
      params.delete("page");
    }

    setSearchParams(params);
  };

  const activeFilters = [
    ["university", universityFilter, {}],
    ["subject", subjectFilter, {}],
    ["system", systemFilter, { year: "" }],
    ["year", yearFilter, {}],
  ]
    .filter(([, value]) => value)
    .map(([key, value, relatedUpdates]) => ({
      key,
      label: key === "system" ? SYSTEM_LABELS[value] || value : value,
      clear: () => handleFilterChange(key, "", relatedUpdates),
    }));

  const handleClearFilters = () => {
    clearTimeout(searchTimeout.current);

    setSearchInput("");

    const params = new URLSearchParams(searchParams);

    FILTER_KEYS.forEach((key) => params.delete(key));
    params.delete("page");

    setSearchParams(params);
  };

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50/40 px-4 sm:px-6 py-16">
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
    <>
      <SEO
        title="Past Exams from Algerian Universities | TalibConnect"
        description="Browse and search approved past exam papers by subject, university, teacher, and year."
        path="/exams"
      />
      <main className="min-h-screen bg-gray-50/40">
        <ExamHeader examCount={totalCount} />

        <ExamFilters
          universityFilter={universityFilter}
          setUniversityFilter={(value) =>
            handleFilterChange("university", value)
          }
          subjectFilter={subjectFilter}
          setSubjectFilter={(value) => handleFilterChange("subject", value)}
          systemFilter={systemFilter}
          setSystemFilter={(value) =>
            handleFilterChange("system", value, { year: "" })
          }
          yearFilter={yearFilter}
          setYearFilter={(value) => handleFilterChange("year", value)}
          institutions={institutions}
          subjects={subjects}
          systems={systems}
          searchTerm={searchInput}
          onSearchChange={handleSearchChange}
          activeFilterCount={activeFilters.length}
        />

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

        <div className="mx-auto max-w-[120rem] px-4 sm:px-6 lg:px-12 py-8">
          <ExamResults
            exams={exams}
            viewMode={viewMode}
            onClearFilters={handleClearFilters}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </main>
    </>
  );
}
