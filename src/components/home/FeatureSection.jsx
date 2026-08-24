import { Brain, BookOpenCheck, Compass } from "lucide-react";

function FeatureBlock({ title, description, icon: Icon, className = "" }) {
  return (
    <div
      className={`p-7 transition-colors duration-300 hover:bg-slate-50 ${className}`}
    >
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-950">
        <Icon size={22} strokeWidth={2} />
      </div>

      <h3 className="text-lg font-bold tracking-tight text-slate-950">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}
export function FeatureSection() {
  const FEATURES = [
    {
      title: "Learn from the past",
      description:
        "Use previous exams to understand what your university expects.",
      icon: BookOpenCheck,
    },
    {
      title: "Find what matters",
      description:
        "Discover relevant papers without digging through scattered files and groups.",
      icon: Compass,
    },
    {
      title: "Study smarter",
      description:
        "Keep your exam preparation organized and spend more time actually studying.",
      icon: Brain,
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mb-10 text-center">
        <h2 className="font-bold tracking-tight text-slate-900 md:text-6xl sm:text-4xl">
          Made for students
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
          Everything you need to find, organize, and study past exams.
        </p>
      </div>
      <div className="grid overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white md:grid-cols-3">
        {FEATURES.map((feature, index) => (
          <FeatureBlock
            key={feature.title}
            {...feature}
            className={
              index !== 0
                ? "border-t border-slate-200 md:border-l md:border-t-0"
                : ""
            }
          />
        ))}
      </div>
    </section>
  );
}
