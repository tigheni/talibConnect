import { supabase } from "../lib/supabase";

const MAX_PDF_SIZE = 10 * 1024 * 1024;

function buildSubmissionPayload(examData, uploadId) {
  return {
    p_upload_id: uploadId,
    p_title: examData.title,
    p_year: parseInt(examData.year, 10),
    p_wilaya: examData.wilaya,
    p_institution: examData.institution,
    p_faculty: examData.faculty,
    p_department: examData.department || null,
    p_subject: examData.subject,
    p_teacher_name: examData.teacher_name?.trim() || null,
    p_teacher_consent: Boolean(examData.teacher_consent),
    p_systems: examData.systems || [],
  };
}

async function hasPdfSignature(file) {
  const header = new Uint8Array(await file.slice(0, 5).arrayBuffer());
  return String.fromCharCode(...header) === "%PDF-";
}

export async function uploadExamWithFile({ examData, file }) {
  if (file.size > MAX_PDF_SIZE || !(await hasPdfSignature(file))) {
    throw new Error("The selected file is not a valid PDF.");
  }

  const uploadId = crypto.randomUUID();
  const filePath = `submissions/${uploadId}.pdf`;

  const { error: uploadError } = await supabase.storage
    .from("exams")
    .upload(filePath, file, {
      upsert: false,
      contentType: "application/pdf",
    });

  if (uploadError) throw uploadError;

  const { error: databaseError } = await supabase.rpc(
    "submit_anonymous_exam",
    buildSubmissionPayload(examData, uploadId),
  );

  if (databaseError) {
    console.error("SUBMISSION RPC ERROR:", databaseError);
    throw new Error("Your file was uploaded but the submission could not be saved. Please contact support if this continues.");
  }
}
