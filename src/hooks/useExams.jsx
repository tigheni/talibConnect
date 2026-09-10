import { useCallback, useEffect, useState } from "react";
import fetchApprovedExams from "../services/approvedExams.js";

export function useExams(filters = {}, page = 1, pageSize) {
  const [exams, setExams] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const totalPages = pageSize
    ? Math.ceil(totalCount / pageSize)
    : 0;

  const fetchExams = useCallback(async () => {
    setLoading(true);
    setError(null);

    let { query } = await fetchApprovedExams(pageSize, page);

    if (filters.searchTerm?.trim()) {
      const search = filters.searchTerm.trim().replace(/[%_,]/g, " ");
      query = query.or(
        `title.ilike.%${search}%,subject.ilike.%${search}%,institution.ilike.%${search}%`,
      );
    }

    if (filters.subjectFilter) {
      query = query.eq("subject", filters.subjectFilter);
    }

    if (filters.universityFilter) {
      query = query.eq("institution", filters.universityFilter);
    }

    if (filters.systemFilter) {
      query = query.contains(
        "systems",
        JSON.stringify([{ system: filters.systemFilter }]),
      );
    }

    if (filters.yearFilter && filters.systemFilter) {
      query = query.contains(
        "systems",
        JSON.stringify([
          { system: filters.systemFilter, years: [filters.yearFilter] },
        ]),
      );
    }

    const { data, count, error: queryError } = await query;

    if (queryError) {
      setError(queryError);
      setExams([]);
      setTotalCount(0);
    } else {
      setExams(data ?? []);
      setTotalCount(count ?? 0);
    }

    setLoading(false);
  }, [
    page,
    pageSize,
    filters.searchTerm,
    filters.subjectFilter,
    filters.universityFilter,
    filters.systemFilter,
    filters.yearFilter,
  ]);

  useEffect(() => {
    let active = true;

    const loadExams = async () => {
      if (active) {
        fetchExams();
      }
    };

    loadExams();

    return () => {
      active = false;
    };
  }, [fetchExams]);

  return {
    exams,
    totalCount,
    totalPages,
    loading,
    error,
    refetch: fetchExams,
  };
}
