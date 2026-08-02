import { useState, useRef } from "react";
import { useUploadExam } from "../hooks/useUploadExam";
import { useLocations } from "../hooks/useLocations";
import { useFormErrors } from "../hooks/useFormError";
import { validateExamForm } from "../validators/validateExamForm";
import toast from "react-hot-toast";
import { INITIAL_EXAM_DATA } from "../constants/uploadForm";
import { BasicInfoSection } from "../components/upload/BasicInfoSection";
import { EducationSection } from "../components/upload/EducationSection";
import { InstitutionSection } from "../components/upload/InstitutionSection";
import { ExamDetailsSection } from "../components/upload/ExamDetailsSection";
import { FileUploadSection } from "../components/upload/FileUploadSection";

export default function UploadPage() {
  const fileInputRef = useRef(null);
  const { uploadExam, loading } = useUploadExam();
  const { resetSelections } = useLocations();

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
        <BasicInfoSection
          examData={examData}
          handleChange={handleChange}
          inputBase={inputBase}
          getErrorClass={getErrorClass}
          getErrorMessage={getErrorMessage}
        />
        <EducationSection
          examData={examData}
          getErrorMessage={getErrorMessage}
          setExamData={setExamData}
        />
        <InstitutionSection
          setExamData={setExamData}
          clearFieldError={clearFieldError}
          inputBase={inputBase}
          getErrorClass={getErrorClass}
          getErrorMessage={getErrorMessage}
          examData={examData}
        />
        <ExamDetailsSection
          examData={examData}
          handleChange={handleChange}
          inputBase={inputBase}
          getErrorClass={getErrorClass}
          getErrorMessage={getErrorMessage}
        />
        <FileUploadSection
          getErrorMessage={getErrorMessage}
          file={file}
          getErrorClass={getErrorClass}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
          setFile={setFile}
        />
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
