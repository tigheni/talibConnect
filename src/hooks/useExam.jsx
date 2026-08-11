import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExams() {
      setLoading(true);

      const { data, error } = await supabase
        .from("exams")
        .select("*")
        .order("created_at", { ascending: false })
        .eq("status", "approved");

      if (error) {
        console.error("Error fetching exams:", error);
      } else {
        setExams(data ?? []);
      }

      setLoading(false);
    }

    fetchExams();
  }, []);

  return { exams, loading };
}
