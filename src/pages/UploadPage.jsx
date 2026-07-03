import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
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
      // TODO:do  error checking
      const uniqueSubjects = [...new Set(data.map((item) => item.subject))];
      setSubjects(uniqueSubjects);
    };
    fetchSubjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({
      title: "",
      subject: "",
      year: "",
      university: "",
      file: null,
    });
    if (!ExamData.title) {
      setFieldErrors({ ...fieldErrors, title: " Exam should have a Title" });
      return;
    }
    if (!ExamData.subject) {
      setFieldErrors({
        ...fieldErrors,
        subject: " Exam should have a Subject",
      });
      return;
    }
    if (!ExamData.university) {
      setFieldErrors({
        ...fieldErrors,
        university: " Exam should have a university",
      });
      return;
    }
    if (!ExamData.year) {
      setFieldErrors({
        ...fieldErrors,
        year: " Exam should have a year",
      });
      return;
    }

    if (!file) {
      setFieldErrors({ ...fieldErrors, file: "Please select a PDF file" });
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
        uploader_id: uploaderId,
      });

      if (dbError) throw dbError;

      alert("Exam uploaded successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setExamData({ title: "", university: "", year: "", subject: "" });
      setFile(null);
      setLoading(false);
      const { data } = await supabase.storage.from("exams").list();

      console.log("Files in bucket:", data);
    }
  };

  return (
    <div className=" max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-6">Upload Exam</h1>
      <form
        className="bg-white rounded-xl p-6 shadow-lg border"
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
            required
            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-[#5ae4a8] text-sm"
          />
        </div>
        <div
          className={`text-red-500 text-xs mt-1 ${fieldErrors.title ? "visible" : "invisible"}`}
        >
          {fieldErrors.title || "placeholder"}
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
            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-[#5ae4a8] text-sm"
          />
          <datalist id="subjectSuggestions">
            {subjects.map((s) => (
              <option key={s} className="" value={s} />
            ))}
          </datalist>
        </div>
        <div
          className={`text-red-500 text-xs mt-1 ${fieldErrors.subject ? "visible" : "invisible"}`}
        >
          {fieldErrors.subject || "placeholder"}
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
            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-[#5ae4a8] text-sm"
          />
        </div>
        <div
          className={`text-red-500 text-xs mt-1 ${fieldErrors.university ? "visible" : "invisible"}`}
        >
          {fieldErrors.university || "placeholder"}
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
            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-[#5ae4a8] text-sm"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1 text-sm">
            Exam File (PDF):
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#5ae4a8] file:text-black file:font-semibold hover:file:bg-[#4bcc94]"
          />
        </div>
        <div
          className={`text-red-500 text-xs mt-1 ${fieldErrors.file ? "visible" : "invisible"}`}
        >
          {fieldErrors.file || "placeholder"}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#5ae4a8] text-black font-semibold py-3 rounded-lg hover:bg-[#4bcc94] transition-all duration-300"
        >
          {loading ? "Uploading The Exam" : "Upload Exam"}
        </button>
      </form>
    </div>
  );
}
