import { useNavigate } from "react-router-dom";
import { Download, User } from "lucide-react";
export default function ExamCard({ exam, index, viewMode }) {
  const navigate = useNavigate();

  if (viewMode === "grid") {
    return (
      <div
        key={exam.uuid}
        className="group bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all  duration-300 hover:-translate-y-1"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="p-5">
          <div className="mb-3">
            <span className="inline-block px-3 border py-1 bg-[#5ae4a8] text-white text-xs rounded-xl font-medium">
              {exam.file_type}
            </span>
          </div>
          <h1 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#5ae4a8] transition-colors">
            {exam.title}
          </h1>
          <div className="space-y-1 mb-4 w-full">
            <p className="text-sm text-gray-600">
              {exam.institution} • {exam.subject}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>📅 {exam.year}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Download size={16} />
                {exam.downloads} downloads
              </span>
            </div>
            <p className="inline-flex items-center gap-1 text-gray-500">
              {exam.uploader_name ? (
                <>
                  <User size={16} />
                  <span>Uploader: {exam.uploader_name}</span>
                </>
              ) : null}
            </p>
            <p className="inline-flex items-center gap-1 text-gray-500">
              {exam.teacher_name ? `👨‍🏫 Teacher ${exam.teacher_name}` : ""}
            </p>
          </div>

          <button className="w-full mt-2 px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-[#5ae4a8] hover:text-black transition-all duration-300 font-medium">
            <a href={`${exam.file_url}?download=${exam.title}`} download>
              Download
            </a>
          </button>
          <button
            onClick={() => navigate(`/exam/${exam.uuid}`)}
            className="w-full mt-2 px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-[#5ae4a8] hover:text-black transition-all duration-300 font-medium"
          >
            Open PDF
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      key={exam.id}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="p-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold text-gray-900 group-hover:text-[#5ae4a8] transition-colors">
            {exam.title}
          </h1>
          <p className="text-sm text-gray-500">
            {exam.institution} • {exam.subject} • {exam.year}
          </p>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">
              <Download size={16} />
              {exam.downloads} downloads
            </span>
            <p className="inline-flex items-center gap-1 text-gray-500">
              {exam.uploader_name ? (
                <>
                  <User size={16} />
                  <span>Uploader: {exam.uploader_name}</span>
                </>
              ) : null}
            </p>
            <p className="inline-flex items-center gap-1 text-gray-500">
              {exam.teacher_name ? `👨‍🏫 Teacher ${exam.teacher_name}` : ""}
            </p>
          </div>
        </div>

        <a
          href={`${exam.file_url}?download=${exam.title}`}
          download
          className="px-6 py-3 bg-[#5ae4a8] text-black rounded-xl hover:bg-[#3bc85a] transition-all font-medium whitespace-nowrap inline-block text-center"
        >
          Download
        </a>

        <button
          onClick={() => navigate(`/exam/${exam.uuid}`, { state: { exam } })}
          className="px-6 py-3 bg-[#5ae4a8] text-black rounded-xl hover:bg-[#3bc85a] transition-all font-medium whitespace-nowrap"
        >
          Open PDF
        </button>
      </div>
    </div>
  );
}
