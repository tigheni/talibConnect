import { useState } from "react";
import ExamCard from "../components/ExamCard";
export default function ExamPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [universityFilter, setUniversityFilter] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const universities = ["USTHB", "University of Algiers", "ESI"];

  const exams = [
    {
      id: 1,
      title: "Physics Final 2024",
      subject: "Physics",
      university: "USTHB",
      year: 2024,
      downloads: 245,
      uploader: "Ahmed K.",
      fileType: "PDF",
    },
    {
      id: 2,
      title: "Mathematics Midterm",
      subject: "Math",
      university: "University of Algiers",
      year: 2024,
      downloads: 189,
      uploader: "Sarah M.",
      fileType: "PDF",
    },
    {
      id: 3,
      title: "Computer Science Exam",
      subject: "CS",
      university: "ESI",
      year: 2023,
      downloads: 432,
      uploader: "Karim B.",
      fileType: "DOCX",
    },
    {
      id: 4,
      title: "Chemistry Final",
      subject: "Chemistry",
      university: "USTHB",
      year: 2024,
      downloads: 167,
      uploader: "Lydia R.",
      fileType: "PDF",
    },
    {
      id: 5,
      title: "Biology Exam",
      subject: "Biology",
      university: "University of Algiers",
      year: 2024,
      downloads: 98,
      uploader: "Oussama A.",
      fileType: "PDF",
    },
    {
      id: 6,
      title: "Law Exam 2024",
      subject: "Law",
      university: "University of Algiers",
      year: 2024,
      downloads: 312,
      uploader: "Meriem T.",
      fileType: "PDF",
    },
  ];

  const filteredExams = exams.filter((exam) => {
    const matchSearch = exam.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchSubject = !subjectFilter || exam.subject === subjectFilter;
    const matchUniversity =
      !universityFilter || exam.university === universityFilter;
    return matchSearch && matchSubject && matchUniversity;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 py-20 ">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
          All Exams
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl">
          Browse thousands of past exams shared by students across Algeria
        </p>
      </div>

      <div className="sticky top-20 bg-white/80 backdrop-blur-lg border-b border-gray-200 z-10">
        <div className="max-w-7xl mx-auto px-2 py-2">
          <div className="relative max-w-2xl mx-auto mb-2">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search exams by title, subject, or keyword..."
              className="w-full pl-12 pr-4 py-4 border-0 bg-gray-100 rounded-2xl focus:ring-2 focus:ring-[#4FE56D] focus:outline-none transition-all text-lg"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex gap-3">
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="px-5 py-2.5 bg-gray-100 border-0 rounded-xl text-gray-700 focus:ring-2 focus:ring-[#4FE56D] focus:outline-none cursor-pointer hover:bg-gray-200 transition-all"
              >
                <option value="">📚 All Subjects</option>
                <option value="Physics">⚡ Physics</option>
                <option value="Math">📐 Mathematics</option>
                <option value="Chemistry">🧪 Chemistry</option>
                <option value="CS">💻 Computer Science</option>
                <option value="Biology">🧬 Biology</option>
                <option value="Law">⚖️ Law</option>
              </select>

              <select
                value={universityFilter}
                onChange={(e) => setUniversityFilter(e.target.value)}
                className="px-5 py-2.5 bg-gray-100 border-0 rounded-xl text-gray-700 focus:ring-2 focus:ring-[#4FE56D] focus:outline-none cursor-pointer hover:bg-gray-200 transition-all"
              >
                <option value="">🎓 All Universities</option>
                {universities.map((uni) => (
                  <option key={uni} value={uni}>
                    {uni}
                  </option>
                ))}
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-[#4FE56D]" : "text-gray-500"}`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow-sm text-[#4FE56D]" : "text-gray-500"}`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            Found {filteredExams.length} exam
            {filteredExams.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {filteredExams.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {filteredExams.map((exam, index) =>
              viewMode === "grid" ? (
                <ExamCard key={exam.id} exam={exam} index={index} />
              ) : (
                // List Card
                <div className="p-4 flex items-center justify-between flex-wrap gap-4 hover:bg-gray-50 transition-colors rounded-xl">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {exam.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {exam.university} • {exam.subject} • {exam.year}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      <span>📄 {exam.fileType}</span>
                      <span>⬇️ {exam.downloads}</span>
                      <span>👤 {exam.uploader}</span>
                    </div>
                  </div>
                  <button className="px-6 py-2 bg-[#4FE56D] text-black rounded-lg hover:bg-[#3bc85a] transition-all font-medium whitespace-nowrap">
                    Download
                  </button>
                </div>
              ),
            )}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No exams found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSubjectFilter("");
                setUniversityFilter("");
              }}
              className="mt-6 px-6 py-2 bg-[#4FE56D] text-black rounded-lg hover:bg-[#3bc85a] transition-all"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
