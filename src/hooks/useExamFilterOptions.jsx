import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const SYSTEMS = ["lmd", "engineering", "medical_education"];

const uniqueValues = (rows, key) => {
  return [...new Set(rows.map((row) => row[key]).filter(Boolean))].sort();
};

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
        .select("institution, subject")
        .eq("status", "approved");

      if (error || !active) return;

      const institutions = uniqueValues(data, "institution");

      const subjects = uniqueValues(data, "subject");

      setOptions({ institutions, subjects, systems: SYSTEMS });
    };

    fetchOptions();
    return () => {
      active = false;
    };
  }, []);

  return options;
}
