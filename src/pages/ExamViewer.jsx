import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { supabase } from "../lib/supabase";
import LoadingSpinner from "../components/LoadingSpinner";
import ReturnBackButton from "../components/ReturnBackButton";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export default function ExamViewer() {
  const [exam, setExam] = useState(null);
  const { id } = useParams();

  const shortId = id.match(/[a-f0-9]{8}$/)?.[0];

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [numPages, setNumPages] = useState(null);
  const [pdfError, setPdfError] = useState("");
  const [containerWidth, setContainerWidth] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchExamById = async () => {
      try {
        setLoading(true);
        setError("");
        setExam(null);

        if (!shortId) {
          setError("Invalid exam URL");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("exams")
          .select("*")
          .eq("short_id", shortId)
          .single();

        if (error) throw error;

        if (!data) {
          throw new Error("Exam not found");
        }
        setExam(data);
      } catch (err) {
        setError(
          err.message || "An unexpected error occurred. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchExamById();
  }, [id]);

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

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <ReturnBackButton />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2 break-words">
              {exam.title}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              {exam.university} • {exam.subject} • {exam.year}
            </p>
          </div>
          <div className="flex-shrink-0 w-full sm:w-auto">
            <a
              href={exam.file_url}
              download
              className="w-full sm:w-auto inline-block text-center bg-[#5ae4a8] text-black px-6 py-3 rounded-lg hover:bg-[#3bc85a] transition"
            >
              Download PDF
            </a>
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
              <a
                href={exam.file_url}
                download
                className="bg-[#5ae4a8] text-black px-6 py-3 rounded-lg hover:bg-[#3bc85a] transition"
              >
                Download PDF instead
              </a>
            </div>
          ) : (
            <Document
              file={exam.file_url}
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
