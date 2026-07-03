import { IoIosArrowBack } from "react-icons/io";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function ExamViewer() {
  const [exam, setExam] = useState(null);
  const { id } = useParams();

  const fetchExamById = async () => {
    const { data, error } = await supabase
      .from("exams")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error:", error);
    } else {
      setExam(data);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchExamById();
  }, [id]);
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
          onClick={() => window.history.back()}
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
