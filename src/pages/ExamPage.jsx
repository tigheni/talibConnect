import ExamCard from "../components/ExamCard";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useSearchParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/Pagination";
import useMobile from "../hooks/useMobile";
export default function ExamPage() {
  const [subjectFilter, setSubjectFilter] = useState("");
  const [universityFilter, setUniversityFilter] = useState("");
  const isMobile = useMobile();
  const [viewMode, setViewMode] = useState(() => (isMobile ? "grid" : "list"));

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    () => searchParams.get("search") || "",
  );

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("exams")
        .select("*")
        .order("created_at", { ascending: false })
        .eq("status", "approved");

      if (error) {
        console.error("Error fetching exams:", error);
      } else {
        setExams(data || []);
      }

      setLoading(false);
    };

    fetchExams();
  }, []);

  const institutions = [
    ...new Set(exams.map((exam) => exam.institution).filter(Boolean)),
  ];
  const subjects = [
    ...new Set(exams.map((exam) => exam.subject).filter(Boolean)),
  ];

  const filteredExams = exams.filter((exam) => {
    const matchSearch =
      (exam.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (exam.subject || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (exam.institution || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchSubject = !subjectFilter || exam.subject === subjectFilter;
    const matchInstitution =
      !universityFilter || exam.institution === universityFilter;

    return matchSearch && matchSubject && matchInstitution;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const examsPerPage = 9;
  const totalPages = Math.ceil(filteredExams.length / examsPerPage);
  const startIndex = (currentPage - 1) * examsPerPage;
  const endIndex = startIndex + examsPerPage;
  const currentExams = filteredExams.slice(startIndex, endIndex);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="min-h-screen ">
      <div className=" mx-auto px-6 pt-12 pb-6 bg-white">
        <h1 className="text-5xl md:text-5xl font-bold mb-4 tracking-tight">
          All Exams
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Browse thousands of past exams shared by students across Algeria
        </p>
      </div>
      <div className=" w-full mx-auto px-6 pb-8 bg-white">
        <div className="relative max-w-2xl mx-auto">
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
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search exams by title, subject, or university..."
            className="w-full pl-12 pr-4 py-4 border-0 bg-gray-300/75 rounded-2xl focus:ring-2 focus:ring-[#5ae4a8] focus:outline-none transition-all text-lg"
          />
        </div>
      </div>

      <div className="sticky top-0 z-50 bg-white backdrop-blur-lg border-b border-gray-200 shadow-md ">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className=" flex flex-col gap-5 md:flex-row">
              <select
                value={subjectFilter}
                onChange={(e) => {
                  setSubjectFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-5 py-2.5 bg-gray-100 border-0 rounded-xl text-gray-700 focus:ring-2 focus:ring-[#5ae4a8] focus:outline-none cursor-pointer  transition-all"
              >
                <option value="">📚 All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {`📚${subject}`}
                  </option>
                ))}
              </select>

              <select
                value={universityFilter}
                onChange={(e) => {
                  setUniversityFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-5 py-2.5 bg-gray-100 border-0 rounded-xl text-gray-700 focus:ring-2 focus:ring-[#5ae4a8] focus:outline-none cursor-pointer transition-all"
              >
                <option value="">🎓 All institutions</option>
                {institutions.map((uni) => (
                  <option key={uni} value={uni}>
                    {`🎓${uni}`}
                  </option>
                ))}
              </select>
            </div>
            {!isMobile && (
              <div className="flex gap-2 bg-gray-300 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-xl transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-[#5ae4a8]" : "text-gray-500"}`}
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
                  className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow-sm text-[#5ae4a8]" : "text-gray-500"}`}
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
            )}
          </div>

          <div className="mt-3 text-sm text-gray-500">
            Found {filteredExams.length} exam
            {filteredExams.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredExams.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {currentExams.map((exam, index) => (
              <ExamCard
                key={exam.id}
                exam={exam}
                viewMode={viewMode}
                index={index}
              />
            ))}
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
                setCurrentPage(1);
              }}
              className="mt-6 px-6 py-2 bg-[#5ae4a8] text-black rounded-lg hover:bg-[#3bc85a] transition-all"
            >
              Clear all filters
            </button>
          </div>
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </main>
  );
}
