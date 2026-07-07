import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useSubjects() {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      const { data, error } = await supabase.from("exams").select("subject");
      if (error) {
        console.error("Error fetching subjects:", error);
        return;
      }
      const uniqueSubjects = [
        ...new Set((data || []).map((item) => item.subject).filter(Boolean)),
      ];
      setSubjects(uniqueSubjects);
    };
    fetchSubjects();
  }, []);

  return subjects;
}
