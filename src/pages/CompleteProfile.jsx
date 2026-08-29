import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocations } from "../hooks/useLocations";
import { supabase } from "../lib/supabase";
import useWelcomeValidation from "../validators/WelcomValidator";
import getAuthErrorMessage from "../validators/getAuthErrorMessage";
import toast from "react-hot-toast";
import { useAuth } from "../context/useAuth";
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
    console.log(facultyId);
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

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          role: formData.role,
          study_system: formData.study_system,
          year_of_study: formData.year_of_study,
          wilaya: formData.wilaya,
          institution: formData.institution,
          faculty: formData.faculty,
          department: formData.department,
        },
      });
      if (updateError) throw updateError;

      const { error } = await supabase
        .from("profiles")
        .update({
          role: formData.role,
          study_system: formData.study_system,
          year_of_study: formData.year_of_study,
          wilaya: formData.wilaya,
          institution: formData.institution,
          faculty: formData.faculty,
          department: formData.department,
          profile_completed: true,
        })
        .eq("id", user.id);

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
    <div className="max-h-full h-screen flex items-center justify-center ">
      <div className="w-full max-w-sm md:max-w-md flex justify-center  flex-col items-center border border-gray-400 bg-white py-5 rounded-2xl shadow-md px-6">
        <h1 className=" text-2xl mb-2"> 🎓 Welcome to TalibConnect!</h1>
        <p>
          Thanks for joining! Complete your academic profile to receive
          personalized exam recommendations and make it easier to find content
          from your university.
        </p>
        <form onSubmit={handlSubmit} className="w-full">
          <label htmlFor="">
            <div className="mb-2">
              <label className="block text-gray-700 font-medium mb-1 mt-3">
                Are you a student or teacher?
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                aria-invalid={!!errors.role}
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2"
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
              <div className="flex gap-3">
                <div className="flex-1">
                  <div className="mb-2">
                    <label className="block text-gray-700 font-medium mb-1 text-sm">
                      Study System:
                    </label>
                    <select
                      name="study_system"
                      value={formData.study_system}
                      onChange={handleChange}
                      aria-invalid={!!errors.study_system}
                      className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5ae4a8]"
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
                      <label className="block text-gray-700 font-medium mb-1 text-sm">
                        Year of Study:
                      </label>
                      <select
                        name="year_of_study"
                        value={formData.year_of_study}
                        onChange={handleChange}
                        aria-invalid={!!errors.year_of_study}
                        className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5ae4a8]"
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
            )}

            <div className="mb-2">
              <label className="block text-gray-700 font-medium mb-1 text-sm">
                State (Wilaya):
              </label>
              <select
                name="wilaya_id"
                value={selectedWilaya}
                onChange={handleLocationChange(setSelectedWilaya, "wilaya")}
                aria-invalid={!!errors.wilaya}
                disabled={!wilayas?.length}
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5ae4a8] disabled:opacity-50"
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
              <label className="block text-gray-700 font-medium mb-1 text-sm">
                University:
              </label>
              <select
                name="university_id"
                value={selectedInstitution}
                onChange={handleLocationChange(
                  setSelectedInstitution,
                  "institution",
                )}
                aria-invalid={!!errors.institution}
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5ae4a8] disabled:opacity-50"
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
              <label className="block text-gray-700 font-medium mb-1 text-sm">
                Faculty:
              </label>
              <select
                name="faculty_id"
                value={selectedFaculty}
                onChange={handleFacultyChange}
                aria-invalid={!!errors.faculty}
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5ae4a8] disabled:opacity-50"
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
                  <label className="block text-gray-700 font-medium mb-1 text-sm">
                    Department:
                  </label>
                  <select
                    name="department_id"
                    value={selectedDepartment}
                    onChange={handleLocationChange(
                      setSelectedDepartment,
                      "department",
                    )}
                    aria-invalid={!!errors.department}
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5ae4a8] disabled:opacity-50"
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
          </label>
          <div className="flex justify-center items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5ae4a8] text-black font-semibold py-2.5 rounded-lg hover:bg-[#4bcc94]/90 transition-all duration-300 disabled:opacity-50 text-sm"
            >
              {loading ? "Updating..." : "Save"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/exams")}
              disabled={loading}
              className="w-full bg-transparent border border-gray-300 text-black font-semibold py-2.5 rounded-lg hover:bg-gray-300/80 transition-all duration-300 disabled:opacity-50 text-sm"
            >
              {loading ? "Skipping..." : "Skip"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
