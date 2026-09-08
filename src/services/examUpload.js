import { supabase } from "../lib/supabase";

function sanitizeFileName(fileName) {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.-]/g, "_");
}

function buildExamRecord(examData, filePath, uploaderId, isAdmin) {
  return {
    title: examData.title.toUpperCase(),
    year: parseInt(examData.year, 10),
    wilaya: examData.wilaya,
    institution: examData.institution,
    faculty: examData.faculty,
    department: examData.department,
    subject: examData.subject.toUpperCase(),
    file_path: filePath,
    file_type: "PDF",
    uploader_id: uploaderId,
    ...(isAdmin ? { uploader_name: "admin" } : {}),
    teacher_name: examData.teacher_name?.trim() || "Anonymous",
    teacher_consent: examData.teacher_consent,
    systems: examData.systems || [],
  };
}

export async function uploadExamWithFile({ examData, file, uploaderId, isAdmin }) {
  const filePath = `${uploaderId}/${crypto.randomUUID()}_${sanitizeFileName(file.name)}`;

  const { error: uploadError } = await supabase.storage
    .from("exams")
    .upload(filePath, file, { upsert: false });

  if (uploadError) throw uploadError;

  const { error: databaseError } = await supabase
    .from("exams")
    .insert(buildExamRecord(examData, filePath, uploaderId, isAdmin));

  if (databaseError) {
    await supabase.storage.from("exams").remove([filePath]);
    throw databaseError;
  }
}
