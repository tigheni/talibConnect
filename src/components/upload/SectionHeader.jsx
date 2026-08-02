export const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center gap-2.5 mb-3.5">
    <div className="w-7 h-7 rounded-full bg-[#5ae4a8]/15 flex items-center justify-center shrink-0">
      <Icon className="w-3.5 h-3.5 text-[#2f9e6d]" strokeWidth={2.5} />
    </div>
    <div>
      <h2 className="text-sm font-semibold text-gray-900 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-xs text-gray-500 leading-tight">{subtitle}</p>
      )}
    </div>
  </div>
);
