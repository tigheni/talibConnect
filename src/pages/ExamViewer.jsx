import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import LoadingSpinner from "../components/LoadingSpinner";
import ReturnBackButton from "../components/ReturnBackButton";

export default function ExamViewer() {
  const [exam, setExam] = useState(null);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExamById = async () => {
      try {
        setLoading(true);
        setError("");
        setExam(null);

        const { data, error } = await supabase
          .from("exams")
          .select("*")
          .eq("uuid", id)
          .single();

        if (error) throw error;

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

        <div className="flex justify-between  align-center ">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">{exam.title}</h1>
            <p className="text-gray-600 mb-6">
              {exam.university} • {exam.subject} • {exam.year}
            </p>
          </div>
          <div>
            <a
              href={exam.file_url}
              download
              className="mt-4 inline-block bg-[#5ae4a8] text-black px-6 py-3 rounded-lg hover:bg-[#3bc85a] transition"
            >
              Download PDF
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <iframe
            src={exam.file_url}
            className="w-full h-[100vh]"
            title={exam.title}
          />
        </div>
      </div>
    </main>
  );
}
