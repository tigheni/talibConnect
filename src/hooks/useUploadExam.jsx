import { useState } from "react";
import { supabase } from "../lib/supabase";
import { validateExamForm } from "../validators/validateExamForm";

import { useAuth } from "../context/useAuth";

export function useUploadExam() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const uploadExam = async (examData, file) => {
    const { isValid, errors } = validateExamForm(examData, file);
    if (!isValid) return { success: false, errors };

    setLoading(true);
    try {
      const uploaderId = user?.id;
      if (!uploaderId) {
        return {
          success: false,
          errors: { auth: "You must be signed in to upload an exam." },
        };
      }

      const cleanFileName = file.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9.-]/g, "_");

      const filePath = `${uploaderId}/${crypto.randomUUID()}_${cleanFileName}`;

      const { error: uploadError } = await supabase.storage
        .from("exams")
        .upload(filePath, file, { upsert: false });

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase.from("exams").insert({
        title: examData.title.toUpperCase(),
        year: parseInt(examData.year),
        wilaya: examData.wilaya,
        institution: examData.institution,
        faculty: examData.faculty,
        department: examData.department,
        subject: examData.subject.toUpperCase(),
        file_path: filePath,
        file_type: "PDF",
        uploader_id: uploaderId,
        teacher_name: examData.teacher_name || "Anonymous",
        teacher_consent: examData.teacher_consent,
        systems: examData.systems || [],
      });

      if (dbError) {
        await supabase.storage.from("exams").remove([filePath]);
        throw dbError;
      }

      return { success: true, errors: null };
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      return {
        success: false,
        errors: { upload: err?.message || "Failed to upload exam." },
      };
    } finally {
      setLoading(false);
    }
  };

  return { uploadExam, loading };
}
