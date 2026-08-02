import { UserCircle, CalendarDays } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
export function ExamDetailsSection({
  examData,
  handleChange,
  inputBase,
  getErrorClass,
  getErrorMessage,
}) {
  return (
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
          Teacher <span className="text-gray-400 font-normal">(optional)</span>
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
  );
}
