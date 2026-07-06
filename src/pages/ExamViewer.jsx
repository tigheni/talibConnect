import { IoIosArrowBack } from "react-icons/io";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import LoadingSpinner from "../components/LoadingSpinner";

export default function ExamViewer() {
  const [exam, setExam] = useState(null);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExamById = async () => {
      try {
        setLoading(true);
        setError("");
        setExam(null);

        const { data, error } = await supabase
          .from("exams")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        setExam(data);
      } catch (err) {
        setError(err.message || "An unexpected error occurred. Please try again.");
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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }
  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-xl">Exam not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-[#4FE56D] text-black rounded-lg hover:bg-[#3bc85a] transition mb-4"
        >
          <IoIosArrowBack className="text-xl" />
          Back to Exams
        </button>

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
              className="mt-4 inline-block bg-[#4FE56D] text-black px-6 py-3 rounded-lg hover:bg-[#3bc85a] transition"
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
    </div>
  );
}
