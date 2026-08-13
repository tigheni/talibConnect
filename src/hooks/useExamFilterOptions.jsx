import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const SYSTEMS = ["lmd", "engineering", "medical_education"];

export function useExamFilterOptions() {
  const [options, setOptions] = useState({
    institutions: [],
    subjects: [],
    systems: SYSTEMS,
  });

  useEffect(() => {
    let active = true;

    const fetchOptions = async () => {
      const { data, error } = await supabase
        .from("exams")
        .select("institution, subject, systems")
        .eq("status", "approved");

      if (error || !active) return;

      const institutions = [
        ...new Set((data || []).map((exam) => exam.institution).filter(Boolean)),
      ].sort();
      const subjects = [
        ...new Set((data || []).map((exam) => exam.subject).filter(Boolean)),
      ].sort();
      setOptions({ institutions, subjects, systems: SYSTEMS });
    };

    fetchOptions();
    return () => {
      active = false;
    };
  }, []);

  return options;
}
