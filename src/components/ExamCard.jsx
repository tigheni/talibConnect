import { useNavigate } from "react-router-dom";
import { Download, User } from "lucide-react";
import { useDownloadExam } from "../hooks/useDownloadExam.jsx";

export default function ExamCard({ exam, index, viewMode }) {
  const navigate = useNavigate();
  const { downloadExam, loading } = useDownloadExam();
  if (viewMode === "grid") {
    return (
      <div
        className="group bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 w-full max-w-full h-full flex flex-col"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="p-4 sm:p-5 flex flex-col flex-1">
          <div className="mb-3">
            <span className="inline-block px-3 py-1 bg-[#5ae4a8] text-white text-xs rounded-xl font-medium">
              {exam.file_type}
            </span>
          </div>
          <h1 className="text-base sm:text-lg text-center font-bold text-gray-900 mb-2 group-hover:text-[#5ae4a8] transition-colors line-clamp-2 min-h-[3.5rem]">
            {exam.title}
          </h1>
          <div className="space-y-1 mb-4 flex-1">
            <p className="text-xs sm:text-sm text-gray-600 ">
              {exam.institution} • {exam.subject}
            </p>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-gray-500">
              <span>📅 {exam.year}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Download size={14} />
                {exam.downloads} downloads
              </span>
            </div>
            {exam.uploader_name && (
              <p className="inline-flex items-center gap-1 text-xs sm:text-sm text-gray-500 truncate w-full">
                <User size={14} />
                <span>Uploader: {exam.uploader_name}</span>
              </p>
            )}
            {exam.teacher_name && (
              <p className="inline-flex items-center gap-1 text-xs sm:text-sm text-gray-500 truncate w-full">
                👨‍🏫 Teacher: {exam.teacher_name}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mt-auto pt-2">
            <button
              onClick={() => downloadExam(exam)}
              disabled={loading}
              className="w-full px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-[#5ae4a8] hover:text-black transition-all duration-300 font-medium text-center text-sm"
            >
              Download
            </button>
            <button
              onClick={() => navigate(`/exam/${exam.uuid}`)}
              className="w-full px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-[#5ae4a8] hover:text-black transition-all duration-300 font-medium text-sm"
            >
              Open PDF
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 w-full"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0 w-full sm:w-auto">
          <h1 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-[#5ae4a8] transition-colors line-clamp-2">
            {exam.title}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 truncate">
            {exam.institution} • {exam.subject} • {exam.year}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">
              <Download size={14} />
              {exam.downloads} downloads
            </span>
            {exam.uploader_name && (
              <span className="inline-flex items-center gap-1 truncate">
                <User size={14} />
                <span>Uploader: {exam.uploader_name}</span>
              </span>
            )}

            <span className="inline-flex items-center gap-1 truncate">
              👨‍🏫 {exam.teacher_name ? exam.teacher_name : "anonymous"}
            </span>
          </div>
        </div>

        <div className="flex flex-row sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={() => downloadExam(exam)}
            disabled={loading}
            className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-[#5ae4a8] text-black rounded-xl hover:bg-[#3bc85a] transition-all font-medium text-center text-sm"
          >
            Download
          </button>
          <button
            onClick={() => navigate(`/exam/${exam.uuid}`)}
            className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-[#5ae4a8] text-black rounded-xl hover:bg-[#3bc85a] transition-all font-medium text-sm"
          >
            Open PDF
          </button>
        </div>
      </div>
    </div>
  );
}
