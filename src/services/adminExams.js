import { supabase } from "../lib/supabase";

const PENDING_EXAM_FIELDS =
  "uuid,title,institution,year,created_at,file_path,teacher_consent,subject";

export async function fetchPendingExams() {
  return supabase
    .from("exams")
    .select(PENDING_EXAM_FIELDS)
    .eq("status", "pending")
    .order("created_at", { ascending: false });
}

export async function approveExam(uuid) {
  return supabase.from("exams").update({ status: "approved" }).eq("uuid", uuid);
}

export async function rejectExam(uuid) {
  const { data, error } = await supabase.rpc("reject_exam", { p_exam_uuid: uuid });
  return { data, error };
}

export async function createExamPreviewUrl(filePath) {
  const { data, error } = await supabase.storage
    .from("exams")
    .createSignedUrl(filePath, 60 * 60);

  return { url: data?.signedUrl, error };
}
