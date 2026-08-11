import { Search, SlidersHorizontal } from "lucide-react";

export default function ExamHeader({
  examCount,
  searchTerm,
  onSearchChange,
  filtersOpen,
  onToggleFilters,
  activeFilterCount,
}) {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-6 pt-14 pb-8 text-center">
        <span className="text-xs font-semibold tracking-widest uppercase text-[#2f9e6d] font-roboto-mono">
          {examCount}+ exams shared
        </span>

        <h1 className="text-3xl md:text-4xl text-slate-900 font-bold mt-2 mb-6 tracking-tight">
          Find your exam
        </h1>

        <div className="flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />

            <input
              type="text"
              value={searchTerm}
              onChange={onSearchChange}
              placeholder="Search by title, subject, or university..."
              className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:border-[#5ae4a8] focus:ring-2 focus:ring-[#5ae4a8]/25 focus:bg-white focus:outline-none transition-all text-sm"
            />
          </div>

          <button
            onClick={onToggleFilters}
            className={`flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-medium border transition-all duration-200 shrink-0 ${
              filtersOpen || activeFilterCount > 0
                ? "bg-[#5ae4a8]/10 border-[#5ae4a8] text-[#2f9e6d]"
                : "bg-[#16203a] border-gray-300 text-white hover:border-gray-300"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#5ae4a8] text-black text-xs font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
