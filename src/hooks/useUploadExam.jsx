import { useState } from "react";
import { supabase } from "../lib/supabase";
import { validateExamForm } from "../validators/validateExamForm";

export function useUploadExam() {
  const [loading, setLoading] = useState(false);

  const uploadExam = async (examData, file) => {
    const { isValid, errors } = validateExamForm(examData, file);
    if (!isValid) return { isValid: false, errors };

    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const uploaderId = user?.id;

      if (!uploaderId) {
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, username")
        .eq("id", uploaderId)
        .single();
      const isAdmin = profile.role === "admin";

      if (profileError) throw new Error("User profile not found");

      const cleanFileName = file.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9.-]/g, "_");

      const filePath = `${Date.now()}_${cleanFileName}`;

      const { error: uploadError } = await supabase.storage
        .from("exams")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("exams")
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase.from("exams").insert({
        title: examData.title.toUpperCase(),
        year: parseInt(examData.year),
        wilaya: examData.wilaya,
        institution: examData.institution,
        faculty: examData.faculty,
        department: examData.department,
        subject: examData.subject.toUpperCase(),
        file_url: urlData.publicUrl,
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

      return { success: true };
    } catch (err) {
      console.log(err);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { uploadExam, loading };
}
