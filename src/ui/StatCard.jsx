export function StatCard({ label, value }) {
  return (
    <div className="group relative rounded-xl border border-[#1E2A4A]/12 bg-[#FBF9F4] px-6 py-5 text-left shadow-[0_1px_2px_rgba(30,42,74,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(30,42,74,0.12)]">
      <div className="absolute inset-y-3 left-0 border-l-2 border-dashed border-[#1E2A4A]/15" />

      <div className="absolute -right-2 -top-2 flex h-9 w-9 rotate-12 items-center justify-center rounded-full border-2 border-[#C1392B]/70 text-[#C1392B]/70 opacity-0 transition-all duration-300 group-hover:-rotate-6 group-hover:opacity-100">
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div className="pl-3">
        <div className="font-serif text-3xl font-bold leading-none tracking-tight text-[#1E2A4A] lg:text-4xl">
          {value}
        </div>
        <div className="mt-2 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-[#1E2A4A]/50">
          {label}
        </div>
      </div>
    </div>
  );
}
