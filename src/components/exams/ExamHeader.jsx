export default function ExamHeader({ examCount }) {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-12 pt-14 pb-8 text-center">
        <span className="text-xs font-semibold tracking-widest uppercase text-[#2f9e6d] font-roboto-mono">
          {examCount}+ exams shared
        </span>

        <h1 className="text-3xl md:text-4xl text-slate-900 font-bold mt-2 mb-6 tracking-tight">
          Find your exam
        </h1>
      </div>
    </div>
  );
}
