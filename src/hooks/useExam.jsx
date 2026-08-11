import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchExams() {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("exams")
        .select("*")
        .order("created_at", { ascending: false })
        .eq("status", "approved");

      if (cancelled) return;

      if (fetchError) {
        console.error("Error fetching exams:", fetchError);
        setError(fetchError);
        setExams([]);
      } else {
        setExams(data ?? []);
      }

      setLoading(false);
    }

    fetchExams();

    return () => {
      cancelled = true;
    };
  }, []);

  return { exams, loading, error };
}
