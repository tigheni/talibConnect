import { LayoutGrid, List, X } from "lucide-react";

export default function ExamToolbar({
  examCount,
  viewMode,
  onViewModeChange,
  isMobile,
  activeFilters,
}) {
  return (
    <div className="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-12 pt-5 pb-2 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-gray-500">
          <span className="font-semibold text-gray-800">{examCount}</span> exam
          {examCount !== 1 ? "s" : ""}
        </span>

        {activeFilters.map((filter) => (
          <button
            key={filter.key}
            onClick={filter.clear}
            className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full bg-[#5ae4a8]/10 border border-[#5ae4a8]/30 text-[#2f9e6d] text-xs font-medium hover:bg-[#5ae4a8]/20 transition-colors"
          >
            {filter.label}

            <X className="w-3 h-3" />
          </button>
        ))}
      </div>

      {!isMobile && (
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 shrink-0">
          <button
            onClick={() => onViewModeChange("grid")}
            aria-label="Grid view"
            className={`p-2 rounded-lg transition-all duration-200 ${
              viewMode === "grid"
                ? "bg-white shadow-sm text-[#2f9e6d]"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>

          <button
            onClick={() => onViewModeChange("list")}
            aria-label="List view"
            className={`p-2 rounded-lg transition-all duration-200 ${
              viewMode === "list"
                ? "bg-white shadow-sm text-[#2f9e6d]"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
