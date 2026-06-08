export default function ExamCard({ exam, index }) {
  return (
    <div
      key={exam.id}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="p-4 ">
        <div className=" w-12  px- py-1 bg-[#4FE56D]/10 mb-4 text-[#4FE56D] text-xs text-center font-semibold rounded-full">
          {exam.fileType}
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#4FE56D] transition-colors">
          {exam.title}
        </h3>

        <div className="space-y-2 mb-4">
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

        <button className="w-full mt-4 px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-[#4FE56D] hover:text-black transition-all duration-300 font-medium flex items-center justify-center gap-2 group/btn">
          Download Exam
          <svg
            className="w-4 h-4 group-hover/btn:translate-y-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 13l-7 7-7-7m14-8l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
