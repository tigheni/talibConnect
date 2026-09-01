import { MapPin } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
export function InstitutionSection({
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
  setExamData,
  clearFieldError,
  inputBase,
  getErrorClass,
  getErrorMessage,
  hasNoDepartments,
  examData,
}) {
  return (
    <div className="p-6 sm:p-8">
      <SectionHeader
        icon={MapPin}
        title="Institution"
        subtitle="Where is this exam from?"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="wilaya"
            className="block text-gray-700 font-medium mb-1.5 text-sm"
          >
            Wilaya
          </label>
          <select
            id="wilaya"
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
          <label
            htmlFor="institution"
            className="block text-gray-700 font-medium mb-1.5 text-sm"
          >
            Institution
          </label>
          <select
            className={`${inputBase} ${getErrorClass("institution")}`}
            value={selectedInstitution}
            id="institution"
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
          <label
            htmlFor="faculty"
            className="block text-gray-700 font-medium mb-1.5 text-sm"
          >
            Faculty
          </label>
          <select
            className={`${inputBase} ${getErrorClass("faculty")}`}
            value={selectedFaculty}
            disabled={!selectedInstitution}
            id="faculty"
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
        {!hasNoDepartments && (
          <div>
            <label
              htmlFor="department"
              className="block text-gray-700 font-medium mb-1.5 text-sm"
            >
              Department
            </label>
            <select
              id="department"
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
        )}
      </div>
    </div>
  );
}
