import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [pendingExams, setPendingExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function loadPendingExams() {
      const { data, error } = await supabase
        .from("exams")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) {
        setMessage(error.message);
      } else {
        setPendingExams(data || []);
      }

      setLoading(false);
    }
    const checkAdmin = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (user?.email !== "oussama.adame12@gmail.com") {
        navigate("/");
        return;
      }
      loadPendingExams();
    };
    checkAdmin();
  }, [navigate]);

  const handleApprove = async (id) => {
    const { error } = await supabase
      .from("exams")
      .update({ status: "approved" })
      .eq("id", id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setPendingExams((prev) => prev.filter((exam) => exam.id !== id));
    setMessage("Exam approved!");
  };

  const handleReject = async (id) => {
    const { error } = await supabase.from("exams").delete().eq("id", id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setPendingExams((prev) => prev.filter((exam) => exam.id !== id));
    setMessage("Exam rejected and deleted.");
  };
  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">Admin Panel</h1>
      <p className="text-gray-600 mb-6">
        Pending exams ({pendingExams.length})
      </p>

      {message && (
        <div className="bg-green-500/10 border border-green-500 text-green-500 rounded-lg p-3 mb-4">
          {message}
        </div>
      )}

      {pendingExams.length === 0 ? (
        <p className="text-gray-500">No pending exams. All clear!</p>
      ) : (
        <div className="space-y-4">
          {pendingExams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white rounded-xl shadow p-4 border"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{exam.title}</h3>
                  <p className="text-sm text-gray-600">
                    {exam.university} • {exam.subject} • {exam.year}
                  </p>
                  <p className="text-sm text-gray-500">
                    Uploaded by: {exam.uploader_name || "Unknown"}
                  </p>
                  <a
                    href={exam.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#5ae4a8] text-sm hover:underline"
                  >
                    View PDF
                  </a>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(exam.id)}
                    className="px-4 py-2 bg-[#5ae4a8] text-black rounded-lg hover:bg-[#3bc85a]"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(exam.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
