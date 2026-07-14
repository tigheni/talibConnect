import { useState } from "react";
import { useUploadExam } from "../hooks/useUploadExam";
import { useSubjects } from "../hooks/useSubjects";
import { useLocations } from "../hooks/useLocations";
import toast from "react-hot-toast";

export default function UploadPage() {
  const subjects = useSubjects();
  const { uploadExam, loading, error, success } = useUploadExam();
  const {
    wilayas,
    institutions,
    faculties,
    departments,

    selectedWilaya,
    selectedInstitution,
    selectedFaculty,

    setSelectedWilaya,
    setSelectedInstitution,
    setSelectedFaculty,
  } = useLocations();

  const [examData, setExamData] = useState({
    title: "",
    year: "",
    subject: "",
    wilaya: "",
    institution: "",
    faculty: "",
    department: "",
  });
  const [file, setFile] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({
    title: "",
    year: "",
    subject: "",
    wilaya: "",
    institution: "",
    faculty: "",
    department: "",
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
      year: "",
      subject: "",
      wilaya: "",
      institution: "",
      faculty: "",
      department: "",
      file: "",
    });

    const result = await uploadExam(examData, file);

    if (result.success) {
      toast.success("Exam uploaded successfully!");
      setExamData({
        title: "",
        year: "",
        subject: "",
        wilaya: "",
        institution: "",
        faculty: "",
        department: "",
      });
      setFile(null);
      document.querySelector('input[type="file"]').value = "";
      setFieldErrors({
        title: "",
        subject: "",
        year: "",
        wilaya: "",
        institution: "",
        faculty: "",
        department: "",
        file: "",
      });
    }

    if (result.errors) {
      toast.error("Something went wrong");
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
            Wilaya
          </label>

          <select
            value={selectedWilaya}
            onChange={(e) => {
              const selected = wilayas.find(
                (w) => w.id === Number(e.target.value),
              );

              setSelectedWilaya(e.target.value);
              setExamData((prev) => ({
                ...prev,
                wilaya: selected?.name_en || "",
                institution: "",
                faculty: "",
                department: "",
              }));
            }}
            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">Select Wilaya</option>

            {wilayas.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name_en}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label>Institution</label>

          <select
            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2"
            value={selectedInstitution}
            disabled={!selectedWilaya}
            onChange={(e) => {
              const selected = institutions.find(
                (i) => i.id === Number(e.target.value),
              );

              setSelectedInstitution(e.target.value);

              setExamData({
                ...examData,
                institution: selected?.name_en || "",
                faculty: "",
                department: "",
              });
            }}
          >
            <option value="">Select Institution</option>

            {institutions.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name_en}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label>Faculty</label>

          <select
            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2"
            value={selectedFaculty}
            disabled={!selectedInstitution}
            onChange={(e) => {
              const selected = faculties.find(
                (f) => f.id === Number(e.target.value),
              );

              setSelectedFaculty(e.target.value);

              setExamData({
                ...examData,
                faculty: selected?.name_en || "",
                department: "",
              });
            }}
          >
            <option value="">Select Faculty</option>

            {faculties.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name_en}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label>Department</label>

          <select
            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2"
            disabled={!selectedFaculty}
            onChange={(e) => {
              const selected = departments.find(
                (d) => d.id === Number(e.target.value),
              );

              setExamData({
                ...examData,
                department: selected?.name_en || "",
              });
            }}
          >
            <option value="">Select Department</option>

            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name_en}
              </option>
            ))}
          </select>
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
