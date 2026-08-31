import { useEffect, useRef, useState } from "react";
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

  const { exams, totalCount, loading, error } = useExams(filters, currentPage);

  const { institutions, subjects, systems } = useExamFilterOptions();

  const totalPages = Math.ceil(totalCount / EXAMS_PER_PAGE);

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

  const handleUniversityChange = (value) => {
    updateParams({
      university: value,
    });
  };

  const handleSubjectChange = (value) => {
    updateParams({
      subject: value,
    });
  };

  const handleSystemChange = (value) => {
    updateParams({
      system: value,
      year: "",
    });
  };

  const handleYearChange = (value) => {
    updateParams({
      year: value,
    });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;

    setSearchInput(value);

    clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(() => {
      updateParams({
        search: value,
      });
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
    universityFilter && {
      key: "university",
      label: universityFilter,
      clear: () => {
        updateParams({
          university: "",
        });
      },
    },

    subjectFilter && {
      key: "subject",
      label: subjectFilter,
      clear: () => {
        updateParams({
          subject: "",
        });
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
        updateParams({
          system: "",
          year: "",
        });
      },
    },

    yearFilter && {
      key: "year",
      label: yearFilter,
      clear: () => {
        updateParams({
          year: "",
        });
      },
    },
  ].filter(Boolean);

  const handleClearFilters = () => {
    clearTimeout(searchTimeout.current);

    setSearchInput("");

    const params = new URLSearchParams(searchParams);

    params.delete("university");
    params.delete("subject");
    params.delete("system");
    params.delete("year");
    params.delete("search");
    params.delete("page");

    setSearchParams(params);
  };

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
      <ExamHeader examCount={totalCount} />

      <ExamFilters
        universityFilter={universityFilter}
        setUniversityFilter={handleUniversityChange}
        subjectFilter={subjectFilter}
        setSubjectFilter={handleSubjectChange}
        systemFilter={systemFilter}
        setSystemFilter={handleSystemChange}
        yearFilter={yearFilter}
        setYearFilter={handleYearChange}
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

      <div className="mx-auto max-w-7xl px-6 py-8">
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
  );
}
