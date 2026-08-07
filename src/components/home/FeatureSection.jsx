function FeatureBlock({ title, description, icon }) {
  return (
    <div className="group relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      <div className="mb-4">
        <span className="text-3xl font-black tracking-tight text-slate-950">
          {icon}
        </span>
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
      title: "Fast search",
      description: "Search by subject, university, teacher, or year.",
      icon: "01",
    },
    {
      title: "Approved papers",
      description: "Only approved exam papers appear on the homepage.",
      icon: "02",
    },
    {
      title: "Clear organization",
      description: "A simple layout that helps students find papers quickly.",
      icon: "03",
    },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="grid gap-5 md:grid-cols-3">
        {FEATURES.map((feature) => (
          <FeatureBlock key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  );
}
