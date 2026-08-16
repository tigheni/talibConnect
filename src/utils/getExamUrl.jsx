import slugify from "slugify";

export function getExamUrl(exam) {
  return `/exam/${slugify(exam.title, {
    lower: true,
    strict: true,
    trim: true,
  })}-${exam.uuid}`;
}
