import { useState } from "react";
import { useUploadExam } from "../hooks/useUploadExam";
import { useSubjects } from "../hooks/useSubjects";
import { useLocations } from "../hooks/useLocations";
import { useFormErrors } from "../hooks/useFormError";
import { validateExamForm } from "../validators/validateExamForm";
import toast from "react-hot-toast";

export default function UploadPage() {
  const subjects = useSubjects();
  const { uploadExam, loading } = useUploadExam();
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
    setSelectedDepartment,
  } = useLocations();
  const {
    clearFieldError,
    clearAllErrors,
    setErrorsFromResponse,
    getErrorClass,
    getErrorMessage,
  } = useFormErrors();

  const [examData, setExamData] = useState({
    title: "",
    year: "",
    subject: "",
    teacher_name: "",
    teacher_consent: false,
    wilaya: "",
    institution: "",
    faculty: "",
    department: "",
  });
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setExamData({ ...examData, [name]: val });
    clearFieldError(name);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    clearFieldError("file");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    clearAllErrors();

    const { isValid, errors: validationErrors } = validateExamForm(
      examData,
      file,
    );

    if (!isValid) {
      setErrorsFromResponse(validationErrors);
      toast.error("Please fix the errors in the form");
      return;
    }

    const result = await uploadExam(examData, file);

    if (result.success) {
      toast.success("Exam uploaded successfully!");
      setExamData({
        title: "",
        year: "",
        subject: "",
        teacher_name: "",
        teacher_consent: false,
        wilaya: "",
        institution: "",
        faculty: "",
        department: "",
      });
      setSelectedWilaya("");
      setSelectedInstitution("");
      setSelectedFaculty("");
      setSelectedDepartment("");

      setFile(null);
      document.querySelector('input[type="file"]').value = "";
      clearAllErrors();
    }

    if (result.errors) {
      toast.error("Failed to upload exam");
      setErrorsFromResponse(result.errors);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-6">Upload Exam</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-6 shadow-lg"
      >
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
            className={`w-full bg-gray-100 border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-[#5ae4a8] text-sm ${getErrorClass("title")}`}
          />
          {getErrorMessage("title") && (
            <div className="text-red-500 text-xs mt-1">
              {getErrorMessage("title")}
            </div>
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
            className={`w-full bg-gray-100 border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-[#5ae4a8] text-sm ${getErrorClass("subject")}`}
          />
          <datalist id="subjectSuggestions">
            {subjects.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
          {getErrorMessage("subject") && (
            <div className="text-red-500 text-xs mt-1">
              {getErrorMessage("subject")}
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
              clearFieldError("wilaya");
            }}
            className={`w-full bg-gray-100 border rounded-lg px-3 py-2 ${getErrorClass("wilaya")}`}
          >
            <option value="">Select Wilaya</option>
            {wilayas.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name_en}
              </option>
            ))}
          </select>
          {getErrorMessage("wilaya") && (
            <div className="text-red-500 text-xs mt-1">
              {getErrorMessage("wilaya")}
            </div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1 text-sm">
            Institution
          </label>
          <select
            className={`w-full bg-gray-100 border rounded-lg px-3 py-2 ${getErrorClass("institution")}`}
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
              clearFieldError("institution");
            }}
          >
            <option value="">Select Institution</option>
            {institutions.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name_en}
              </option>
            ))}
          </select>
          {getErrorMessage("institution") && (
            <div className="text-red-500 text-xs mt-1">
              {getErrorMessage("institution")}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1 text-sm">
            Faculty
          </label>
          <select
            className={`w-full bg-gray-100 border rounded-lg px-3 py-2 ${getErrorClass("faculty")}`}
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
              clearFieldError("faculty");
            }}
          >
            <option value="">Select Faculty</option>
            {faculties.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name_en}
              </option>
            ))}
          </select>
          {getErrorMessage("faculty") && (
            <div className="text-red-500 text-xs mt-1">
              {getErrorMessage("faculty")}
            </div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1 text-sm">
            Department
          </label>
          <select
            className={`w-full bg-gray-100 border rounded-lg px-3 py-2 ${getErrorClass("department")}`}
            disabled={!selectedFaculty}
            onChange={(e) => {
              const selected = departments.find(
                (d) => d.id === Number(e.target.value),
              );
              setExamData({
                ...examData,
                department: selected?.name_en || "",
              });
              clearFieldError("department");
            }}
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name_en}
              </option>
            ))}
          </select>
          {getErrorMessage("department") && (
            <div className="text-red-500 text-xs mt-1">
              {getErrorMessage("department")}
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
            className={`w-full bg-gray-100 border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-[#5ae4a8] text-sm ${getErrorClass("year")}`}
          />
          {getErrorMessage("year") && (
            <div className="text-red-500 text-xs mt-1">
              {getErrorMessage("year")}
            </div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1 text-sm">
            Teacher (Optional):
          </label>
          <p className="text-xs text-gray-400 mb-2">
            👨‍🏫 Credit the teacher who created the exam (only share with their
            permission)
          </p>
          <input
            type="text"
            name="teacher_name"
            placeholder="e.g., Dr. Ahmed Benali"
            value={examData.teacher_name}
            onChange={handleChange}
            className={`w-full bg-gray-100 border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-[#5ae4a8] text-sm ${getErrorClass("teacher_name")}`}
          />
          {getErrorMessage("teacher_name") && (
            <div className="text-red-500 text-xs mt-1">
              {getErrorMessage("teacher_name")}
            </div>
          )}
        </div>
        <div className="mb-4">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              name="teacher_consent"
              checked={examData.teacher_consent}
              onChange={handleChange}
            />
            I have permission from the teacher to share their name
          </label>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1 text-sm">
            Exam File (PDF):
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className={`w-full bg-gray-100 border rounded-lg px-3 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#5ae4a8] file:text-black file:font-semibold hover:file:bg-[#4bcc94] ${getErrorClass("file")}`}
          />
          {getErrorMessage("file") && (
            <div className="text-red-500 text-xs mt-1">
              {getErrorMessage("file")}
            </div>
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
    </main>
  );
}
