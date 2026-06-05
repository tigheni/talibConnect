export default function ExamCard({ exam }) {
  return (
    <div className="bg-[#1a1a1a] rounded-xl p-4 shadow-lg">
      <h3 className="text-white font-semibold">{exam.title}</h3>
      <p className="text-gray-400 text-sm">
        {exam.subject} • {exam.university}
      </p>
      <div className="flex justify-between mt-3">
        <span className="text-gray-500 text-sm">
          {exam.year} • {exam.downloads} downloads
        </span>
        <button className="text-[var(--cp)] text-sm group">
          Open{" "}
          <span className="inline-block transition-transform duration-300 group-hover:rotate-90">
            ↓
          </span>
        </button>
      </div>
    </div>
  );
}
