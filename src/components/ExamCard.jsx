export default function ExamCard({ exam, index, viewMode }) {
  if (viewMode === "grid") {
    return (
      <div
        key={exam.id}
        className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="p-5">
          <div className="mb-3">
            <span className="inline-block px-3 py-1 bg-[#4FE56D]/10 text-[#4FE56D] text-xs font-semibold rounded-full">
              {exam.fileType}
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#4FE56D] transition-colors">
            {exam.title}
          </h3>
          <div className="space-y-1 mb-4">
            <p className="text-sm text-gray-600">
              {exam.university} • {exam.subject}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>📅 {exam.year}</span>
              <span>•</span>
              <span>⬇️ {exam.downloads} downloads</span>
            </div>
            <p className="text-xs text-gray-400">👤 {exam.uploader}</p>
          </div>
          <button className="w-full mt-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-[#4FE56D] hover:text-black transition-all duration-300 font-medium">
            Download Exam
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
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#4FE56D] transition-colors">
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
    </div>
  );
}
