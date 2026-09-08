import { supabase } from "../lib/supabase";

const PENDING_EXAM_FIELDS =
  "uuid,title,institution,year,created_at,file_path,teacher_consent,uploader_name,subject";

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

export async function rejectExam(exam) {
  const { error: storageError } = await supabase.storage
    .from("exams")
    .remove([exam.file_path]);

  if (storageError) return { error: storageError };

  return supabase.from("exams").delete().eq("uuid", exam.uuid);
}

export async function createExamPreviewUrl(filePath) {
  const { data, error } = await supabase.storage
    .from("exams")
    .createSignedUrl(filePath, 60 * 60);

  return { url: data?.signedUrl, error };
}
