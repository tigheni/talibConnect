import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { validateExamForm } from "../utils/validateExamForm"; // Import from utils

export default function UploadPage() {
  const [subjects, setSubjects] = useState([]);
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    title: "",
    subject: "",
    year: "",
    university: "",
    file: "",
  });
  const [ExamData, setExamData] = useState({
    title: "",
    university: "",
    year: "",
    subject: "",
  });

  useEffect(() => {
    const fetchSubjects = async () => {
      const { data } = await supabase.from("exams").select("subject");
      const uniqueSubjects = [...new Set(data.map((item) => item.subject))];
      setSubjects(uniqueSubjects);
    };
    fetchSubjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate the form
    const { isValid, errors } = validateExamForm(ExamData, file);
    setFieldErrors(errors);

    if (!isValid) {
      return;
    }

    setLoading(true);
    const cleanFileName = file.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = `${Date.now()}_${cleanFileName}`;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const uploaderId = user?.id;
      if (!uploaderId) {
        setError("You must be logged in to upload");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.storage
        .from("exams")
        .upload(filePath, file, { upsert: true });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("exams")
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      const { error: dbError } = await supabase.from("exams").insert({
        title: ExamData.title,
        year: parseInt(ExamData.year),
        university: ExamData.university,
        subject: ExamData.subject,
        file_url: publicUrl,
        file_type: "PDF",
        downloads: 0,
        uploader_name: user.user_metadata?.username || "unknown",
        uploader_id: uploaderId,
      });

      if (dbError) throw dbError;

      alert("Exam uploaded successfully!");

      // Reset form
      setExamData({ title: "", university: "", year: "", subject: "" });
      setFile(null);
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
      setFieldErrors({
        title: "",
        subject: "",
        year: "",
        university: "",
        file: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-6">Upload Exam</h1>
      <form
        className="bg-white rounded-xl p-6 shadow-lg "
        onSubmit={handleSubmit}
      >
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-3 mb-4 text-sm text-center">
            {error}
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1 text-sm">
            Title:
          </label>
          <input
            type="text"
            placeholder="EX: Waves and vibrations"
            value={ExamData.title}
            onChange={(e) =>
              setExamData({ ...ExamData, title: e.target.value })
            }
            className={`w-full bg-gray-100 border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-[#5ae4a8] text-sm ${
              fieldErrors.title ? "border-red-500" : "border-gray-400"
            }`}
          />
          {fieldErrors.title && (
            <div className="text-red-500 text-xs mt-1">{fieldErrors.title}</div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1 text-sm">
            Subject:
          </label>
          <input
            type="text"
            placeholder="e.g., Computer Science, Law, Biochemistry..."
            value={ExamData.subject}
            onChange={(e) =>
              setExamData({ ...ExamData, subject: e.target.value })
            }
            list="subjectSuggestions"
            className={`w-full bg-gray-100 border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-[#5ae4a8] text-sm ${
              fieldErrors.subject ? "border-red-500" : "border-gray-400"
            }`}
          />
          <datalist id="subjectSuggestions">
            {subjects.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
          {fieldErrors.subject && (
            <div className="text-red-500 text-xs mt-1">
              {fieldErrors.subject}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1 text-sm">
            University:
          </label>
          <input
            type="text"
            placeholder="e.g., USTHB, University of Algiers..."
            value={ExamData.university}
            onChange={(e) =>
              setExamData({ ...ExamData, university: e.target.value })
            }
            className={`w-full bg-gray-100 border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-[#5ae4a8] text-sm ${
              fieldErrors.university ? "border-red-500" : "border-gray-400"
            }`}
          />
          {fieldErrors.university && (
            <div className="text-red-500 text-xs mt-1">
              {fieldErrors.university}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1 text-sm">
            Year:
          </label>
          <input
            type="number"
            placeholder="e.g., 2024"
            value={ExamData.year}
            min={2000}
            onChange={(e) => setExamData({ ...ExamData, year: e.target.value })}
            className={`w-full bg-gray-100 border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-[#5ae4a8] text-sm ${
              fieldErrors.year ? "border-red-500" : "border-gray-400"
            }`}
          />
          {fieldErrors.year && (
            <div className="text-red-500 text-xs mt-1">{fieldErrors.year}</div>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1 text-sm">
            Exam File (PDF):
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className={`w-full bg-gray-100 border rounded-lg px-3 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#5ae4a8] file:text-black file:font-semibold hover:file:bg-[#4bcc94] ${
              fieldErrors.file ? "border-red-500" : "border-gray-300"
            }`}
          />
          {fieldErrors.file && (
            <div className="text-red-500 text-xs mt-1">{fieldErrors.file}</div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#5ae4a8] text-black font-semibold py-3 rounded-lg hover:bg-[#4bcc94] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Uploading The Exam..." : "Upload Exam"}
        </button>
      </form>
    </div>
  );
}
