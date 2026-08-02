import { YEAR_OPTIONS } from "../../constants/uploadForm";
import { GraduationCap } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
export function EducationSection({ examData, setExamData, getErrorMessage }) {
  return (
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
            const isChecked = examData.systems.some((s) => s.system === system);
            const label =
              system === "lmd"
                ? "LMD"
                : system === "engineering"
                  ? "Engineering"
                  : "Medical";
            return (
              <label key={system} className="cursor-pointer ">
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
                          systems: [...currentSystems, { system, years: [] }],
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
          <p className="text-sm text-gray-400 italic bg-gray-50 border border-dashed border-gray-400 rounded-xl px-4 py-3">
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
                              const updatedSystems = prev.systems.map((s) => {
                                if (s.system === systemObj.system) {
                                  const newYears = checked
                                    ? [...s.years, year.value]
                                    : s.years.filter((y) => y !== year.value);
                                  return { ...s, years: newYears };
                                }
                                return s;
                              });
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
  );
}
