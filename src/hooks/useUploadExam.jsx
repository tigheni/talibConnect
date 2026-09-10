import { useState } from "react";
import { validateExamForm } from "../validators/validateExamForm";
import { uploadExamWithFile } from "../services/examUpload";

export function useUploadExam() {
  const [loading, setLoading] = useState(false);

  const uploadExam = async (examData, file, hasNoDepartments = false) => {
    const { isValid, errors } = validateExamForm(
      examData,
      file,
      hasNoDepartments,
    );
    if (!isValid) return { success: false, errors, validation: true };

    setLoading(true);
    try {
      await uploadExamWithFile({
        examData,
        file,
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
