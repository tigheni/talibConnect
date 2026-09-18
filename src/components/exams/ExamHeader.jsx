export default function ExamHeader({ examCount }) {
  return (
    <div className="text-center lg:text-left">
      <span className="text-xs font-semibold tracking-widest uppercase text-[#2f9e6d] font-roboto-mono">
        {examCount}+ exams shared
      </span>

      <h1 className="text-3xl md:text-4xl text-slate-900 font-bold mt-2 tracking-tight">
        Find your exam
      </h1>
    </div>
  );
}
