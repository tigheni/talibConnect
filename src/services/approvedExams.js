import { supabase } from "../lib/supabase";
export default async function fetchApprovedExams(PAGE_SIZE, page) {
  const from = Math.max(0, (page - 1) * PAGE_SIZE);
  const to = from + PAGE_SIZE - 1;
  let query = supabase
    .from("exams")
    .select(
      "title,subject,institution,systems,uuid,teacher_name,file_type,year,downloads,file_path",
      {
        count: "exact",
      },
    )
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .range(from, to);
  return { query };
}
