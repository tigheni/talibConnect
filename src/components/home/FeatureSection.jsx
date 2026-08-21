import { Brain, BookOpenCheck, Compass } from "lucide-react";

function FeatureBlock({ title, description, icon: Icon }) {
  return (
    <div className="group relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#f1f5f9] text-slate-950">
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
        <h2 className="text-3xl font-bold  tracking-tight text-slate-950 sm:text-4xl">
          Made for students
        </h2>
        <h3 className="mt-3  text-base  leading-7 text-slate-600">
          Everything you need to find past exams, stay organized, and prepare
          with confidence.
        </h3>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {FEATURES.map((feature) => (
          <FeatureBlock key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  );
}
