export const INITIAL_EXAM_DATA = {
  title: "",
  year: "",
  subject: "",
  teacher_name: "",
  teacher_consent: false,
  submission_consent: false,
  wilaya: "",
  institution: "",
  faculty: "",
  department: "",
  systems: [],
  education_system: "",
};

export const YEAR_OPTIONS = {
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
