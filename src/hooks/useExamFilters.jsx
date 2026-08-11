import { useMemo } from "react";

export default function useExamFilters(exams, filters) {
  const {
    searchTerm,
    subjectFilter,
    universityFilter,
    systemFilter,
    yearFilter,
  } = filters;

  const institutions = useMemo(
    () => [...new Set(exams.map((exam) => exam.institution).filter(Boolean))],
    [exams],
  );

  const subjects = useMemo(
    () => [...new Set(exams.map((exam) => exam.subject).filter(Boolean))],
    [exams],
  );

  const systems = useMemo(
    () => [
      ...new Set(
        exams
          .flatMap((exam) => exam.systems || [])
          .map((system) => system.system)
          .filter(Boolean),
      ),
    ],
    [exams],
  );

  const allYears = useMemo(
    () => [
      ...new Set(
        exams
          .flatMap((exam) => exam.systems || [])
          .flatMap((system) => system.years || [])
          .filter(Boolean),
      ),
    ],
    [exams],
  );

  const availableYears = systemFilter
    ? allYears.filter((year) =>
        exams.some((exam) =>
          (exam.systems || []).some(
            (system) =>
              system.system === systemFilter && system.years.includes(year),
          ),
        ),
      )
    : allYears;

  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      const search = searchTerm.toLowerCase();

      const matchSearch =
        (exam.title || "").toLowerCase().includes(search) ||
        (exam.subject || "").toLowerCase().includes(search) ||
        (exam.institution || "").toLowerCase().includes(search);

      const matchSubject = !subjectFilter || exam.subject === subjectFilter;

      const matchInstitution =
        !universityFilter || exam.institution === universityFilter;

      const matchSystem =
        !systemFilter ||
        (exam.systems || []).some((system) => system.system === systemFilter);

      const matchYear =
        !yearFilter ||
        (exam.systems || []).some((system) =>
          (system.years || []).includes(yearFilter),
        );

      return (
        matchSearch &&
        matchSubject &&
        matchInstitution &&
        matchSystem &&
        matchYear
      );
    });
  }, [
    exams,
    searchTerm,
    subjectFilter,
    universityFilter,
    systemFilter,
    yearFilter,
  ]);

  return {
    institutions,
    subjects,
    systems,
    availableYears,
    filteredExams,
  };
}
