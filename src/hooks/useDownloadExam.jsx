import { useState } from "react";
import { supabase } from "../lib/supabase";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/useAuth";

import { useNavigate } from "react-router-dom";
export function useDownloadExam() {
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const downloadExam = async (exam) => {
    setLoadingDownload(true);
    setError(null);

    try {
      const { data: signedUrlData, error: signedUrlError } =
        await supabase.storage
          .from("exams")
          .createSignedUrl(exam.file_path, 60 * 60);

      if (signedUrlError) {
        throw signedUrlError;
      }

      const response = await fetch(signedUrlData.signedUrl);
      if (!user) {
        toast((t) => (
          <div className="flex items-center gap-3">
            <span>🔒 Please log in to download this file.</span>

            <button
              onClick={() => {
                toast.dismiss(t.id);
                navigate("/login");
              }}
              className="font-medium underline"
            >
              Login
            </button>
          </div>
        ));
        return;
      }
      if (!response.ok) {
        throw new Error("Failed to fetch file");
      }
      toast.loading("Downloading", { id: "download" });

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `${exam.title}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      const { error: countError } = await supabase.rpc("increment_download", {
        p_exam_uuid: exam.uuid,
      });

      if (countError) {
        console.error("DOWNLOAD COUNTER ERROR:", countError);
      }
      toast.success("Download complete", { id: "download" });
    } catch (err) {
      setError(err.message);
      toast.error("Failed to download PDF", { id: "download" });
    } finally {
      setLoadingDownload(false);
    }
  };

  return { downloadExam, loadingDownload, error };
}
