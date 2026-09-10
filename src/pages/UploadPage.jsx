import { useState, useRef } from "react";
import { useUploadExam } from "../hooks/useUploadExam";
import { useLocations } from "../hooks/useLocations";
import { useFormErrors } from "../hooks/useFormError";
import toast from "react-hot-toast";
import { INITIAL_EXAM_DATA } from "../constants/uploadFormOptions";
import { BasicInfoSection } from "../components/upload/BasicInfoSection";
import { EducationSection } from "../components/upload/EducationSection";
import { InstitutionSection } from "../components/upload/InstitutionSection";
import { ExamDetailsSection } from "../components/upload/ExamDetailsSection";
import { FileUploadSection } from "../components/upload/FileUploadSection";
import { Link } from "react-router-dom";

export default function UploadPage() {
  const fileInputRef = useRef(null);
  const { uploadExam, loading } = useUploadExam();
  const locations = useLocations();

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

    const result = await uploadExam(examData, file, locations.hasNoDepartments);

    if (result.success) {
      toast.success("Submission received and queued for review.");
      setExamData(INITIAL_EXAM_DATA);
      locations.resetSelections();
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      clearAllErrors();
    }

    if (result.errors) {
      toast.error(
        result.validation ? "Please fix the errors in the form" : "Failed to upload exam",
      );
      setErrorsFromResponse(result.errors);
    }
  };

  const inputBase =
    "w-full bg-gray-50 border rounded-xl px-4 py-2.5 text-gray-900 text-sm outline-none transition-all duration-200 focus:border-[#5ae4a8] focus:ring-2 focus:ring-[#5ae4a8]/25 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <main className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-10 sm:py-14">
      <div className="text-center mb-8">
        <span className="text-xs font-semibold tracking-widest uppercase text-[#2f9e6d] font-roboto-mono">
          Contribute
        </span>
        <h1 className="text-4xl  font-bold mt-2 text-slate-900">
          Upload an Exam
        </h1>
        <p className="text-gray-500 text-sm mt-2 max-w-sm mx-auto">
          Help other students by sharing a past exam. Every submission is
          reviewed by an administrator before it becomes public.
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
          {...locations}
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
          <label className="flex items-start gap-3 text-sm leading-6 text-gray-600">
            <input type="checkbox" name="submission_consent" checked={examData.submission_consent} onChange={handleChange} className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-[#2f9e6d] focus:ring-[#5ae4a8]" />
            <span>
              I confirm this PDF contains no student records, identification numbers, grades, signatures, or other private information, and I agree to the <Link className="underline" to="/privacy">Privacy Policy</Link> and <Link className="underline" to="/terms">Terms</Link>.
            </span>
          </label>
          {getErrorMessage("submission_consent") && <div className="mt-2 text-xs text-red-500">{getErrorMessage("submission_consent")}</div>}
        </div>
        <div className="p-6 sm:p-8">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#5ae4a8] text-black font-semibold py-3.5 rounded-xl shadow-[0px_4px_24px_0_rgba(90,228,168,.35)] transition-all duration-300 hover:bg-[#2f9e6d] hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
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
