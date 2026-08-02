import { useState, useRef } from "react";
import { useUploadExam } from "../hooks/useUploadExam";
import { useSubjects } from "../hooks/useSubjects";
import { useLocations } from "../hooks/useLocations";
import { useFormErrors } from "../hooks/useFormError";
import { validateExamForm } from "../validators/validateExamForm";
import toast from "react-hot-toast";
import {
  BookOpen,
  GraduationCap,
  MapPin,
  CalendarDays,
  UserCircle,
  FileUp,
  FileText,
  X,
  UploadCloud,
} from "lucide-react";
const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center gap-2.5 mb-3.5">
    <div className="w-7 h-7 rounded-full bg-[#5ae4a8]/15 flex items-center justify-center shrink-0">
      <Icon className="w-3.5 h-3.5 text-[#2f9e6d]" strokeWidth={2.5} />
    </div>
    <div>
      <h2 className="text-sm font-semibold text-gray-900 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-xs text-gray-500 leading-tight">{subtitle}</p>
      )}
    </div>
  </div>
);

export default function UploadPage() {
  const subjects = useSubjects();
  const fileInputRef = useRef(null);

  const INITIAL_EXAM_DATA = {
    title: "",
    year: "",
    subject: "",
    teacher_name: "",
    teacher_consent: false,
    wilaya: "",
    institution: "",
    faculty: "",
    department: "",
    systems: [],
    education_system: "",
  };
  const YEAR_OPTIONS = {
    lmd: [
      { value: "L1", label: "Licence 1" },
      { value: "L2", label: "Licence 2" },
      { value: "L3", label: "Licence 3" },
      { value: "M1", label: "Master 1" },
      { value: "M2", label: "Master 2" },
    ],
    engineering: [
      { value: "1", label: "1st year" },
      { value: "2", label: "2nd year" },
      { value: "3", label: "3rd year" },
      { value: "4", label: "4th year" },
      { value: "5", label: "5th year" },
    ],
    medical_education: [
      { value: "1", label: "1st year" },
      { value: "2", label: "2nd year" },
      { value: "3", label: "3rd year" },
      { value: "4", label: "4th year" },
      { value: "5", label: "5th year" },
      { value: "6", label: "6th year" },
      { value: "7", label: "7th year" },
    ],
  };
  const { uploadExam, loading } = useUploadExam();
  const {
    wilayas,
    institutions,
    faculties,
    departments,

    selectedWilaya,
    selectedInstitution,
    selectedFaculty,
    selectedDepartment,

    setSelectedWilaya,
    setSelectedInstitution,
    setSelectedFaculty,
    setSelectedDepartment,

    resetSelections,
  } = useLocations();
  const {
    clearFieldError,
    clearAllErrors,
    setErrorsFromResponse,
    getErrorClass,
    getErrorMessage,
  } = useFormErrors();

  const [examData, setExamData] = useState(INITIAL_EXAM_DATA);
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
      setExamData(INITIAL_EXAM_DATA);
      resetSelections();

      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      clearAllErrors();
    }

    if (result.errors) {
      toast.error("Failed to upload exam");
      setErrorsFromResponse(result.errors);
    }
  };

  const inputBase =
    "w-full bg-gray-50 border rounded-xl px-4 py-2.5 text-gray-900 text-sm outline-none transition-all duration-200 focus:border-[#5ae4a8] focus:ring-2 focus:ring-[#5ae4a8]/25 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 sm:py-14">
      <div className="text-center mb-8">
        <span className="text-xs font-semibold tracking-widest uppercase text-[#2f9e6d] font-roboto-mono">
          Contribute
        </span>
        <h1 className="text-3xl  font-bold mt-2">Upload an Exam</h1>
        <p className="text-gray-500 text-sm mt-2 max-w-sm mx-auto">
          Help other students by sharing a past exam. Takes about a minute.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-black/15 shadow-[0_8px_30px_rgba(0,0,0,0.06)] divide-y divide-gray-100"
      >
        <div className="p-6 sm:p-8">
          <SectionHeader
            icon={BookOpen}
            title="Basics"
            subtitle="What is this exam about?"
          />

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1.5 text-sm">
              Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="EX: Waves and vibrations"
              value={examData.title}
              onChange={handleChange}
              className={`${inputBase} ${getErrorClass("title")}`}
            />
            {getErrorMessage("title") && (
              <div className="text-red-500 text-xs mt-1.5">
                {getErrorMessage("title")}
              </div>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1.5 text-sm">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              placeholder="e.g., Computer Science, Law, Biochemistry..."
              value={examData.subject}
              onChange={handleChange}
              list="subjectSuggestions"
              className={`${inputBase} ${getErrorClass("subject")}`}
            />
            <datalist id="subjectSuggestions">
              {subjects.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
            {getErrorMessage("subject") && (
              <div className="text-red-500 text-xs mt-1.5">
                {getErrorMessage("subject")}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <SectionHeader
            icon={GraduationCap}
            title="Education path"
            subtitle="Select every system and year this exam applies to"
          />

          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2 text-sm">
              Education systems
            </label>
            <div className="flex flex-wrap gap-2">
              {["lmd", "engineering", "medical_education"].map((system) => {
                const isChecked = examData.systems.some(
                  (s) => s.system === system,
                );
                const label =
                  system === "lmd"
                    ? "LMD"
                    : system === "engineering"
                      ? "Engineering"
                      : "Medical";
                return (
                  <label key={system} className="cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isChecked}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setExamData((prev) => {
                          const currentSystems = prev.systems || [];
                          if (checked) {
                            return {
                              ...prev,
                              systems: [
                                ...currentSystems,
                                { system, years: [] },
                              ],
                            };
                          } else {
                            return {
                              ...prev,
                              systems: currentSystems.filter(
                                (s) => s.system !== system,
                              ),
                            };
                          }
                        });
                      }}
                    />
                    <span
                      className={`inline-block px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                        isChecked
                          ? "bg-[#5ae4a8] border-[#5ae4a8] text-black"
                          : "bg-gray-50 border-gray-300 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm">
              Years of study
            </label>
            {examData.systems.length === 0 ? (
              <p className="text-sm text-gray-400 italic bg-gray-50 border border-dashed border-gray-300 rounded-xl px-4 py-3">
                Select an education system first
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {examData.systems.map((systemObj) => (
                  <div
                    key={systemObj.system}
                    className="p-3.5 bg-gray-50 rounded-xl border border-gray-100"
                  >
                    <p className="font-medium text-xs uppercase tracking-wide text-gray-500 mb-2.5">
                      {systemObj.system === "lmd"
                        ? "LMD"
                        : systemObj.system === "engineering"
                          ? "Engineering"
                          : "Medical"}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {YEAR_OPTIONS[systemObj.system].map((year) => {
                        const isChecked = systemObj.years.includes(year.value);
                        return (
                          <label key={year.value} className="cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={isChecked}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setExamData((prev) => {
                                  const updatedSystems = prev.systems.map(
                                    (s) => {
                                      if (s.system === systemObj.system) {
                                        const newYears = checked
                                          ? [...s.years, year.value]
                                          : s.years.filter(
                                              (y) => y !== year.value,
                                            );
                                        return { ...s, years: newYears };
                                      }
                                      return s;
                                    },
                                  );
                                  return { ...prev, systems: updatedSystems };
                                });
                              }}
                            />
                            <span
                              className={`inline-block px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                                isChecked
                                  ? "bg-[#5ae4a8] border-[#5ae4a8] text-black"
                                  : "bg-white border-gray-300 text-gray-600 hover:border-gray-300"
                              }`}
                            >
                              {year.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {getErrorMessage("systems") && (
              <div className="text-red-500 text-xs mt-1.5">
                {getErrorMessage("systems")}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <SectionHeader
            icon={MapPin}
            title="Institution"
            subtitle="Where is this exam from?"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1.5 text-sm">
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
                className={`${inputBase} ${getErrorClass("wilaya")}`}
              >
                <option value="">Select Wilaya</option>
                {wilayas.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name_en}
                  </option>
                ))}
              </select>
              {getErrorMessage("wilaya") && (
                <div className="text-red-500 text-xs mt-1.5">
                  {getErrorMessage("wilaya")}
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1.5 text-sm">
                Institution
              </label>
              <select
                className={`${inputBase} ${getErrorClass("institution")}`}
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
                <div className="text-red-500 text-xs mt-1.5">
                  {getErrorMessage("institution")}
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1.5 text-sm">
                Faculty
              </label>
              <select
                className={`${inputBase} ${getErrorClass("faculty")}`}
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
                <div className="text-red-500 text-xs mt-1.5">
                  {getErrorMessage("faculty")}
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1.5 text-sm">
                Department
              </label>
              <select
                value={selectedDepartment}
                className={`${inputBase} ${getErrorClass("department")}`}
                disabled={!selectedFaculty}
                onChange={(e) => {
                  setSelectedDepartment(e.target.value);

                  const selected = departments.find(
                    (d) => d.id === Number(e.target.value),
                  );
                  setExamData((prev) => ({
                    ...prev,
                    department: selected?.name_en || "",
                  }));

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
                <div className="text-red-500 text-xs mt-1.5">
                  {getErrorMessage("department")}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <SectionHeader
            icon={CalendarDays}
            title="Exam details"
            subtitle="When was it given, and by whom?"
          />

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1.5 text-sm">
              Exam year
            </label>
            <input
              type="number"
              name="year"
              placeholder="e.g., 2024"
              value={examData.year}
              onChange={handleChange}
              min={2000}
              className={`${inputBase} ${getErrorClass("year")}`}
            />
            {getErrorMessage("year") && (
              <div className="text-red-500 text-xs mt-1.5">
                {getErrorMessage("year")}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="flex items-center gap-1.5 text-gray-700 font-medium mb-1.5 text-sm">
              <UserCircle className="w-4 h-4 text-gray-400" />
              Teacher{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Credit the teacher who created the exam — only share with their
              permission.
            </p>
            <input
              type="text"
              name="teacher_name"
              placeholder="e.g., Dr. Mohamed Kader"
              value={examData.teacher_name}
              onChange={handleChange}
              className={`${inputBase} ${getErrorClass("teacher_name")}`}
            />
            {getErrorMessage("teacher_name") && (
              <div className="text-red-500 text-xs mt-1.5">
                {getErrorMessage("teacher_name")}
              </div>
            )}
          </div>

          <label className="flex items-center gap-2.5 text-sm text-gray-600 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 cursor-pointer">
            <input
              type="checkbox"
              name="teacher_consent"
              checked={examData.teacher_consent}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300 text-[#5ae4a8] focus:ring-[#5ae4a8]"
            />
            I have permission from the teacher to share their name
          </label>
        </div>

        <div className="p-6 sm:p-8">
          <SectionHeader icon={FileUp} title="Exam file" subtitle="PDF only" />

          <label
            htmlFor="examFile"
            className={`relative flex flex-col items-center justify-center gap-2 w-full rounded-xl border-2 border-dashed px-4 py-8 text-center cursor-pointer transition-all duration-200 ${
              file
                ? "border-[#5ae4a8] bg-[#5ae4a8]/5"
                : "border-gray-300 bg-gray-50 hover:border-gray-300 hover:bg-gray-100/60"
            } ${getErrorClass("file")}`}
          >
            <input
              id="examFile"
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="sr-only"
            />
            {file ? (
              <>
                <div className="w-10 h-10 rounded-full bg-[#5ae4a8]/15 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#2f9e6d]" />
                </div>
                <p className="text-sm font-medium text-gray-800 max-w-xs truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB — click to replace
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
                  aria-label="Remove file"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-gray-200/70 flex items-center justify-center">
                  <UploadCloud className="w-5 h-5 text-gray-500" />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  Click to choose a PDF
                </p>
                <p className="text-xs text-gray-400">
                  or drag and drop it here
                </p>
              </>
            )}
          </label>
          {getErrorMessage("file") && (
            <div className="text-red-500 text-xs mt-1.5">
              {getErrorMessage("file")}
            </div>
          )}
        </div>

        <div className="p-6 sm:p-8">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#5ae4a8] text-black font-semibold py-3.5 rounded-xl shadow-[0px_4px_24px_0_rgba(99,232,126,.35)] transition-all duration-300 hover:bg-[#4bcc94] hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Uploading the exam...
              </>
            ) : (
              "Upload exam"
            )}
          </button>
        </div>
      </form>
    </main>
  );
}
