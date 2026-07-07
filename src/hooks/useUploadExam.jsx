import { useState } from "react";
import { supabase } from "../lib/supabase";
import { validateExamForm } from "../validators/validateExamForm";

export function useUploadExam() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const uploadExam = async (examData, file) => {
    const { isValid, errors } = validateExamForm(examData, file);
    if (!isValid) return { isValid: false, errors };

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const uploaderId = user?.id;
      const isAdmin = user?.email === "oussama.adame12@gmail.com";

      if (!uploaderId) {
        setError("You must be logged in to upload");
        return { success: false };
      }

      const cleanFileName = file.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9.-]/g, "_");
      const filePath = `${Date.now()}_${cleanFileName}`;

      const { error: uploadError } = await supabase.storage
        .from("exams")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("exams")
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase.from("exams").insert({
        title: examData.title,
        year: parseInt(examData.year),
        university: examData.university,
        subject: examData.subject,
        file_url: urlData.publicUrl,
        file_type: "PDF",
        downloads: 0,
        uploader_name: isAdmin
          ? "Admin"
          : user.user_metadata?.username || "unknown",
        uploader_id: uploaderId,
        status: "pending",
        uploader_role: isAdmin
          ? "admin"
          : user.user_metadata?.role || "student",
      });

      if (dbError) throw dbError;

      setSuccess("Your exam has been successfully uploaded.");
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { uploadExam, loading, error, success };
}
