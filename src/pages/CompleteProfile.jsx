import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocations } from "../hooks/useLocations";
import { supabase } from "../lib/supabase";
import useWelcomeValidation from "../validators/WelcomValidator";
import getAuthErrorMessage from "../validators/getAuthErrorMessage";
import toast from "react-hot-toast";
import { useAuth } from "../context/authContext/useAuth";

import { YEAR_OPTIONS } from "../constants/uploadForm";

export default function CompleteProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: "",
    study_system: "",
    year_of_study: "",
    wilaya: "",
    institution: "",
    faculty: "",
    department: "",
  });
  const [hasNoDepartments, setHasNoDepartments] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    wilayas,
    institutions,
    faculties,
    departments,
    selectedWilaya,
    selectedInstitution,
    selectedDepartment,
    selectedFaculty,
    setSelectedWilaya,
    setSelectedInstitution,
    setSelectedFaculty,
    setSelectedDepartment,
  } = useLocations();

  const { errors, validate, clearErrors } = useWelcomeValidation();
  const { user } = useAuth();

  const handleLocationChange = (setter, nameField) => (e) => {
    const { value } = e.target;
    const selectedOption = e.target.options[e.target.selectedIndex];
    const selectedName = selectedOption?.text || "";

    setter(value);
    setFormData((prev) => ({
      ...prev,
      [nameField]: selectedName,
    }));

    clearErrors(nameField);
  };
  const handleFacultyChange = async (e) => {
    const facultyId = e.target.value;
    const facultyName = e.target.options[e.target.selectedIndex]?.text || "";
    setSelectedFaculty(facultyId);
    setSelectedDepartment("");
    setFormData((prev) => ({ ...prev, faculty: facultyName, department: "" }));
    clearErrors("faculty");

    if (!facultyId) {
      setHasNoDepartments(false);
      return;
    }

    const { count } = await supabase
      .from("departments")
      .select("id", { count: "exact", head: true })
      .eq("faculty_id", facultyId);

    setHasNoDepartments(count === 0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,

      ...(name === "study_system" ? { year_of_study: "" } : {}),
    }));

    clearErrors(name);
  };

  const handlSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const result = validate(formData, hasNoDepartments);
    if (!result.isValid) return;

    const normalizedRole = formData.role === "teacher" ? "teacher" : "student";

    setLoading(true);
    try {
      const { error } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          role: normalizedRole,
          study_system: formData.study_system,
          year_of_study: formData.year_of_study,
          wilaya: formData.wilaya,
          wilaya_id: selectedWilaya ? Number(selectedWilaya) : null,
          institution: formData.institution,
          institution_id: selectedInstitution
            ? Number(selectedInstitution)
            : null,
          faculty: formData.faculty,
          faculty_id: selectedFaculty ? Number(selectedFaculty) : null,
          department: formData.department,
          department_id: selectedDepartment ? Number(selectedDepartment) : null,
          profile_completed: true,
        },
        { onConflict: "id" },
      );

      if (error) throw error;

      toast.success("Profile completed!");
      navigate("/exams");
    } catch (err) {
      const friendlyMessage = getAuthErrorMessage(err);
      toast.error(`talibConnect: ${friendlyMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_#d9f8e6_0%,_#f7fbf8_38%,_#eaf5ee_100%)] px-4 py-10 sm:py-16">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(47,158,109,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(47,158,109,0.05)_1px,transparent_1px)] [background-size:42px_42px]" />
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#5ae4a8]/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-[#8ed8b1]/30 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-white/40 blur-3xl" />

      <div className="relative mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <span className="inline-flex rounded-full border border-[#2f9e6d]/20 bg-white/70 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[#2f9e6d] shadow-sm">
            Welcome to talibConnect
          </span>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] text-slate-950 sm:text-5xl">
            Complete your profile
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
            Tell us a little about yourself so we can personalize your exam
            archive.
          </p>
        </div>

        <form
          onSubmit={handlSubmit}
          className="w-full rounded-[2rem] border border-white/80 bg-white/95 p-6 shadow-[0_24px_70px_rgba(24,53,42,0.12)] sm:p-9"
        >
          <div className="mb-8 flex items-center gap-3 border-b border-slate-100 pb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#18352a] text-lg text-[#5ae4a8]">
              ✦
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                Your academic profile
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                All fields help improve your results.
              </p>
            </div>
          </div>

          <div className="mb-7">
            <label
              htmlFor="role"
              className="mb-2 block text-sm font-bold text-slate-800"
            >
              Are you a student or teacher?
            </label>
            <select
              name="role"
              id="role"
              value={formData.role}
              onChange={handleChange}
              aria-invalid={!!errors.role}
              className="w-full rounded-xl border border-[#c9d8cc] bg-[#f7f8f2] px-4 py-3.5 text-sm text-[#18352a] outline-none transition hover:border-[#91b8a1] focus:border-[#2f9e6d] focus:ring-4 focus:ring-[#5ae4a8]/20"
            >
              <option value="">Select your role</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
          <div
            className={`text-red-500 text-xs mt-1 ${errors.role ? "visible" : "invisible"}`}
          >
            {errors.role || "placeholder"}
          </div>

          {formData.role === "student" && (
            <div className="mb-7 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#2f9e6d]">
                Study details
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex-1">
                  <div className="mb-2">
                    <label
                      htmlFor="study_system"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Study System:
                    </label>
                    <select
                      name="study_system"
                      id="study_system"
                      value={formData.study_system}
                      onChange={handleChange}
                      aria-invalid={!!errors.study_system}
                      className="w-full rounded-xl border border-[#c9d8cc] bg-white px-4 py-3.5 text-sm text-[#18352a] outline-none transition hover:border-[#91b8a1] focus:border-[#2f9e6d] focus:ring-4 focus:ring-[#5ae4a8]/20"
                    >
                      <option value="">Select your system</option>
                      <option value="lmd">LMD (Licence / Master)</option>
                      <option value="engineering">Engineering</option>
                    </select>
                  </div>
                  <div
                    className={`text-red-500 text-xs mt-1 ${errors.study_system ? "visible" : "invisible"}`}
                  >
                    {errors.study_system || "placeholder"}
                  </div>
                </div>

                {formData.study_system && (
                  <div className="flex-1">
                    <div className="mb-2">
                      <label
                        htmlFor="study_year"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Year of Study:
                      </label>
                      <select
                        name="year_of_study"
                        id="study_year"
                        value={formData.year_of_study}
                        onChange={handleChange}
                        aria-invalid={!!errors.year_of_study}
                        className="w-full rounded-xl border border-[#c9d8cc] bg-white px-4 py-3.5 text-sm text-[#18352a] outline-none transition hover:border-[#91b8a1] focus:border-[#2f9e6d] focus:ring-4 focus:ring-[#5ae4a8]/20"
                      >
                        <option value="">Select your year</option>
                        {YEAR_OPTIONS[formData.study_system].map((y) => (
                          <option key={y.value} value={y.value}>
                            {y.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div
                      className={`text-red-500 text-xs mt-1 ${errors.year_of_study ? "visible" : "invisible"}`}
                    >
                      {errors.year_of_study || "placeholder"}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mb-4 mt-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#5ae4a8]" />
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2f9e6d]">
              Location
            </p>
          </div>

          <div className="mb-4">
            <label
              htmlFor="wilaya"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              State (Wilaya):
            </label>
            <select
              name="wilaya_id"
              id="wilaya"
              value={selectedWilaya}
              onChange={handleLocationChange(setSelectedWilaya, "wilaya")}
              aria-invalid={!!errors.wilaya}
              disabled={!wilayas?.length}
              className="w-full rounded-xl border border-[#c9d8cc] bg-[#f7f8f2] px-4 py-3.5 text-sm text-[#18352a] outline-none transition hover:border-[#91b8a1] focus:border-[#2f9e6d] focus:ring-4 focus:ring-[#5ae4a8]/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">
                {wilayas?.length ? "Select your state" : "Loading states..."}
              </option>
              {wilayas?.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name_en}
                </option>
              ))}
            </select>
          </div>
          <div
            className={`text-red-500 text-xs mt-1 ${errors.wilaya ? "visible" : "invisible"}`}
          >
            {errors.wilaya || "placeholder"}
          </div>

          <div className="mb-2">
            <label
              htmlFor="university"
              className="block text-gray-700 font-medium mb-1 text-sm"
            >
              University:
            </label>
            <select
              id="university"
              name="university_id"
              value={selectedInstitution}
              onChange={handleLocationChange(
                setSelectedInstitution,
                "institution",
              )}
              aria-invalid={!!errors.institution}
              className="w-full rounded-xl  border border-[#c9d8cc] bg-[#f7f8f2] px-3 py-3 text-sm text-[#18352a] outline-none transition focus:border-[#2f9e6d] focus:ring-2 focus:ring-[#5ae4a8]/25 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!selectedWilaya}
            >
              <option value="">Select your university</option>
              {institutions?.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name_en}
                </option>
              ))}
            </select>
            {selectedWilaya && institutions?.length === 0 && (
              <p className="text-xs text-gray-500 mt-1">
                No institutions found for this state
              </p>
            )}
          </div>
          <div
            className={`text-red-500 text-xs mt-1 ${errors.institution ? "visible" : "invisible"}`}
          >
            {errors.institution || "placeholder"}
          </div>

          <div className="mb-2">
            <label
              htmlFor="faculty"
              className="block text-gray-700 font-medium mb-1 text-sm"
            >
              Faculty:
            </label>
            <select
              id="faculty"
              name="faculty_id"
              value={selectedFaculty}
              onChange={handleFacultyChange}
              aria-invalid={!!errors.faculty}
              className="w-full rounded-xl border border-[#c9d8cc] bg-[#f7f8f2] px-3 py-3 text-sm text-[#18352a] outline-none transition focus:border-[#2f9e6d] focus:ring-2 focus:ring-[#5ae4a8]/25 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!selectedInstitution}
            >
              <option value="">Select your faculty</option>
              {faculties?.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name_en}
                </option>
              ))}
            </select>
          </div>
          <div
            className={`text-red-500 text-xs mt-1 ${errors.faculty ? "visible" : "invisible"}`}
          >
            {errors.faculty || "placeholder"}
          </div>
          {!hasNoDepartments && (
            <>
              <div className="mb-5">
                <label
                  htmlFor="department"
                  className="block rounded-xl text-gray-700 font-medium mb-1 text-sm"
                >
                  Department:
                </label>
                <select
                  id="department"
                  name="department_id"
                  value={selectedDepartment}
                  onChange={handleLocationChange(
                    setSelectedDepartment,
                    "department",
                  )}
                  aria-invalid={!!errors.department}
                  className="w-full rounded-xl border border-[#c9d8cc] bg-[#f7f8f2] px-3 py-3 text-sm text-[#18352a] outline-none transition focus:border-[#2f9e6d] focus:ring-2 focus:ring-[#5ae4a8]/25 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!selectedFaculty}
                >
                  <option value="">Select your department</option>
                  {departments?.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name_en}
                    </option>
                  ))}
                </select>
              </div>
              <div
                className={`text-red-500 text-xs mt-1 ${errors.department ? "visible" : "invisible"}`}
              >
                {errors.department || "placeholder"}
              </div>
            </>
          )}

          <div className="mt-8 flex flex-col-reverse items-center justify-center gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5ae4a8] px-4 py-3 text-sm font-bold text-[#10251b] shadow-[4px_4px_0_#18352a] transition hover:-translate-y-0.5 hover:bg-[#75eab4] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-44"
            >
              {loading ? "Updating..." : "Save"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/exams")}
              disabled={loading}
              className="w-full border border-[#c9d8cc] bg-transparent px-4 py-3 text-sm font-semibold text-[#50675a] transition hover:border-[#18352a] hover:bg-[#eef4ed] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-32"
            >
              {loading ? "Skipping..." : "Skip"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
