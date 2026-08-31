import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const PAGE_SIZE = 9;

export function useExams(filters = {}, page = 1) {
  const [exams, setExams] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExams = useCallback(async () => {
    setLoading(true);
    setError(null);

    const from = Math.max(0, (page - 1) * PAGE_SIZE);
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from("exams")
      .select(
        "title,subject,institution,systems,uuid,teacher_name,uploader_name,file_type,year,downloads,file_path",
        {
          count: "exact",
        },
      )
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .range(from, to);

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
    filters.searchTerm,
    filters.subjectFilter,
    filters.universityFilter,
    filters.systemFilter,
    filters.yearFilter,
  ]);

  useEffect(() => {
    let active = true;

    const loadExams = async () => {
      await Promise.resolve();

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
    loading,
    error,
    pageSize: PAGE_SIZE,
    refetch: fetchExams,
  };
}
