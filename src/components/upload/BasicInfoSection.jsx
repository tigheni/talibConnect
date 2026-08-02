import { useSubjects } from "../../hooks/useSubjects";
import { BookOpen } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
export function BasicInfoSection({
  examData,
  handleChange,
  inputBase,
  getErrorClass,
  getErrorMessage,
}) {
  const subjects = useSubjects();
  return (
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
  );
}
