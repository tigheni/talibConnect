import { useState } from "react";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";

export function useDownloadExam() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const downloadExam = async (exam) => {
    setLoading(true);
    setError(null);

    try {
      toast.loading("Downloading", { id: "download" });

      const { data: signedUrlData, error: signedUrlError } =
        await supabase.storage
          .from("exams")
          .createSignedUrl(exam.file_path, 60 * 60);

      if (signedUrlError) {
        throw signedUrlError;
      }

      const response = await fetch(signedUrlData.signedUrl);

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

      toast.success("Download complete", { id: "download" });
    } catch (err) {
      console.error("Download error:", err);
      setError(err.message);
      toast.error("Failed to download PDF", { id: "download" });
    } finally {
      setLoading(false);
    }
  };

  return { downloadExam, loading, error };
}
