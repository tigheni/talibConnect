import { supabase } from "../lib/supabase";
import { useState } from "react";
import toast from "react-hot-toast";
export function useDownloadExam() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const downloadExam = async (exam) => {
    setLoading(true);
    setError(null);
    try {
      toast.loading("Downloading", { id: "download" });

      const response = await fetch(exam.file_url);
      if (!response.ok) {
        throw new Error("Failed to fetch file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${exam.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      if (!response.ok) {
        throw new Error("Failed to fetch file");
      }
      const { error: updateError } = await supabase
        .from("exams")
        .update({ downloads: (exam.downloads || 0) + 1 })
        .eq("uuid", exam.uuid);

      if (updateError) throw updateError;

      toast.success("Download complete!", { id: "download" });
      return { success: true };
    } catch (err) {
      console.error("Download failed:", err);
      setError(err.message);
      toast.error("Failed to download file", { id: "download" });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  return { downloadExam, error, loading };
}
