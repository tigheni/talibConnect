import { SearchX } from "lucide-react";
import ExamCard from "./ExamCard";

export default function ExamResults({ exams, viewMode, onClearFilters }) {
  if (exams.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <SearchX className="w-6 h-6 text-gray-400" />
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-1.5">
          No exams found
        </h3>

        <p className="text-gray-500 text-sm">
          Try adjusting your search or filters
        </p>

        <button
          onClick={onClearFilters}
          className="mt-6 px-6 py-2.5 bg-[#5ae4a8] text-black font-medium rounded-xl shadow-[0px_4px_20px_0_rgba(99,232,126,.30)] hover:bg-[#4bcc94] hover:scale-105 active:scale-95 transition-all duration-200"
        >
          Clear all filters
        </button>
      </div>
    );
  }

  return (
    <div
      className={
        viewMode === "grid"
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
      }
    >
      {exams.map((exam, index) => (
        <ExamCard
          key={exam.uuid}
          exam={exam}
          viewMode={viewMode}
          index={index}
        />
      ))}
    </div>
  );
}
