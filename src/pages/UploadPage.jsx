import { useState } from "react";
import { useUploadExam } from "../hooks/useUploadExam";
import { useSubjects } from "../hooks/useSubjects";

export default function UploadPage() {
  const subjects = useSubjects();
  const { uploadExam, loading, error, success } = useUploadExam();

  const [examData, setExamData] = useState({
    title: "",
    university: "",
    year: "",
    subject: "",
  });
  const [file, setFile] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({
    title: "",
    subject: "",
    year: "",
    university: "",
    file: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExamData({ ...examData, [name]: value });
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: "" });
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    if (fieldErrors.file) {
      setFieldErrors({ ...fieldErrors, file: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({
      title: "",
      subject: "",
      year: "",
      university: "",
      file: "",
    });

    const result = await uploadExam(examData, file);

    if (result.success) {
      setExamData({ title: "", university: "", year: "", subject: "" });
      setFile(null);
      document.querySelector('input[type="file"]').value = "";
      setFieldErrors({
        title: "",
        subject: "",
        year: "",
        university: "",
        file: "",
      });
    }

    if (result.errors) {
      setFieldErrors(result.errors);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-6">Upload Exam</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-6 shadow-lg"
      >
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-3 mb-4 text-sm text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500 text-emerald-500 rounded-lg p-3 mb-4 text-sm text-center">
            {success}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1 text-sm">
            Title:
          </label>
          <input
            type="text"
            name="title"
            placeholder="EX: Waves and vibrations"
            value={examData.title}
            onChange={handleChange}
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
            name="subject"
            placeholder="e.g., Computer Science, Law, Biochemistry..."
            value={examData.subject}
            onChange={handleChange}
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
            name="university"
            placeholder="e.g., USTHB, University of Algiers..."
            value={examData.university}
            onChange={handleChange}
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
            name="year"
            placeholder="e.g., 2024"
            value={examData.year}
            onChange={handleChange}
            min={2000}
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
            onChange={handleFileChange}
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
          className="w-full bg-[#5ae4a8] text-black font-semibold py-3 rounded-xl hover:bg-[#4bcc94] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Uploading The Exam..." : "Upload Exam"}
        </button>
      </form>
    </div>
  );
}
