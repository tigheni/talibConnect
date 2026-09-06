import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { supabase } from "../lib/supabase";
import LoadingSpinner from "../components/LoadingSpinner";
import { useDownloadExam } from "../hooks/useDownloadExam";
import ReturnBackButton from "../components/ReturnBackButton";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export default function ExamViewer() {
  const [exam, setExam] = useState(null);
  const { id } = useParams();

  const examUuid = id.match(
    /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i,
  )?.[0];
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [numPages, setNumPages] = useState(null);
  const [pdfError, setPdfError] = useState("");
  const [containerWidth, setContainerWidth] = useState(null);
  const containerRef = useRef(null);
  const { downloadExam, loadingDownload } = useDownloadExam();

  useEffect(() => {
    const fetchExamById = async () => {
      try {
        setLoading(true);
        setError("");
        setExam(null);

        if (!examUuid) {
          setError("Invalid exam URL");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("exams")
          .select("title,institution,subject,year,uuid,file_path")
          .eq("uuid", examUuid)
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          throw new Error("Exam not found");
        }

        const { data: signedUrlData, error: signedUrlError } =
          await supabase.storage
            .from("exams")
            .createSignedUrl(data.file_path, 60 * 60);

        if (signedUrlError) throw signedUrlError;

        setExam(data);
        setFileUrl(signedUrlData.signedUrl);
      } catch (err) {
        setError(
          err.message || "An unexpected error occurred. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchExamById();
  }, [examUuid]);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [exam]);

  if (loading) {
    return <LoadingSpinner />;
  }
  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-xl">{error}</p>
      </main>
    );
  }
  if (!exam) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-xl">Exam not found</p>
      </main>
    );
  }
  if (!fileUrl) {
    return <LoadingSpinner />;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-6xl 2xl:max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <ReturnBackButton />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2 break-words">
              {exam.title}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              {exam.institution} • {exam.subject} • {exam.year}
            </p>
          </div>
          <div className="flex-shrink-0 w-full sm:w-auto">
            <button
              onClick={() => downloadExam(exam)}
              disabled={loadingDownload}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-[#5ae4a8] text-black rounded-xl hover:bg-[#3bc85a] transition-all font-medium text-center text-sm"
            >
              Download
            </button>
          </div>
        </div>

        <div
          ref={containerRef}
          className="bg-white rounded-lg shadow-lg overflow-hidden p-2 sm:p-4"
        >
          {pdfError ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <p className="text-red-500 text-lg">
                Couldn't load the PDF preview.
              </p>
              <button
                onClick={() => downloadExam(exam)}
                disabled={loadingDownload}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-[#5ae4a8] text-black rounded-xl hover:bg-[#3bc85a] transition-all font-medium text-center text-sm"
              >
                Download
              </button>
            </div>
          ) : (
            <Document
              file={fileUrl}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              onLoadError={() => setPdfError("Failed to load PDF document")}
              loading={
                <div className="flex justify-center py-12">
                  <LoadingSpinner />
                </div>
              }
            >
              {containerWidth &&
                Array.from(new Array(numPages || 0), (_, i) => (
                  <div
                    key={`page_${i + 1}`}
                    className="mb-4 flex justify-center"
                  >
                    <Page
                      pageNumber={i + 1}
                      width={containerWidth - 16}
                      renderAnnotationLayer={true}
                      renderTextLayer={true}
                    />
                  </div>
                ))}
            </Document>
          )}
        </div>
      </div>
    </main>
  );
}
