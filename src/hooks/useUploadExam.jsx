import { useState } from "react";
import { validateExamForm } from "../validators/validateExamForm";
import { uploadExamWithFile } from "../services/examUpload";

import { useAuth } from "../context/authContext/useAuth";

export function useUploadExam() {
  const [loading, setLoading] = useState(false);
  const { user, isAdmin } = useAuth();

  const uploadExam = async (examData, file, hasNoDepartments = false) => {
    const { isValid, errors } = validateExamForm(
      examData,
      file,
      hasNoDepartments,
    );
    if (!isValid) return { success: false, errors, validation: true };

    setLoading(true);
    try {
      const uploaderId = user?.id;
      if (!uploaderId) {
        return {
          success: false,
          errors: { auth: "You must be signed in to upload an exam." },
        };
      }

      await uploadExamWithFile({
        examData,
        file,
        uploaderId,
        isAdmin,
      });

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
