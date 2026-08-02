export const validateExamForm = (examData, file) => {
  const errors = {
    title: "",
    subject: "",
    year: "",
    wilaya: "",
    institution: "",
    faculty: "",
    department: "",
    file: "",
  };
  let isValid = true;

  if (!examData.title?.trim()) {
    errors.title = "Title is required";
    isValid = false;
  } else if (examData.title.trim().length < 3) {
    errors.title = "Title must be at least 3 characters";
    isValid = false;
  }

  if (!examData.subject?.trim()) {
    errors.subject = "Subject is required";
    isValid = false;
  }

  if (!examData.wilaya) {
    errors.wilaya = "Wilaya is required";
    isValid = false;
  }

  if (!examData.institution) {
    errors.institution = "Institution is required";
    isValid = false;
  }

  if (!examData.faculty) {
    errors.faculty = "Faculty is required";
    isValid = false;
  }

  if (!examData.department) {
    errors.department = "Department is required";
    isValid = false;
  }

  const currentYear = new Date().getFullYear();
  if (!examData.year) {
    errors.year = "Year is required";
    isValid = false;
  } else if (isNaN(examData.year)) {
    errors.year = "Year must be a number";
    isValid = false;
  } else if (examData.year < 2000) {
    errors.year = "Year must be 2000 or later";
    isValid = false;
  } else if (examData.year > currentYear + 1) {
    errors.year = `Year cannot be later than ${currentYear + 1}`;
    isValid = false;
  }

  if (!examData.systems || examData.systems.length === 0) {
    errors.systems = "Please select at least one education system and year";
    isValid = false;
  } else {
    for (const systemObj of examData.systems) {
      if (!systemObj.years || systemObj.years.length === 0) {
        errors.systems = `Please select at least one year for ${systemObj.system}`;
        isValid = false;
        break;
      }
    }
  }
  if (!file) {
    errors.file = "Please select a PDF file";
    isValid = false;
  } else if (file.type !== "application/pdf") {
    errors.file = "Please select a PDF file (PDF format required)";
    isValid = false;
  } else if (file.size > 10 * 1024 * 1024) {
    errors.file = "File size must be less than 10MB";
    isValid = false;
  }
  if (examData.teacher_name?.trim() && !examData.teacher_consent) {
    errors.teacher_name =
      "You must have permission from the teacher to share their name";
    isValid = false;
  }
  return { isValid, errors };
};
