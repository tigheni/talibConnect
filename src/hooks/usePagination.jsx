import { useState } from "react";
export function pagination() {
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
  return { totalPages, currentExams };
}
