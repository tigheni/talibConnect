import ExamCard from "../components/ExamCard";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { HomeHeader } from "../components/home/HomeHeader";

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

function formatNumber(value) {
  const num = Number(value) || 0;
  return new Intl.NumberFormat("en-US").format(num);
}

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

export default function Home() {
  const [stats, setStats] = useState([
    { id: 1, number: "0+", label: "Exams Available" },
    { id: 2, number: "0+", label: "Institutions" },
    { id: 3, number: "0+", label: "Active Students" },
  ]);
  const [recentExams, setRecentExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);

      const { data: examsData, error: examsError } = await supabase
        .from("exams")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (examsError) {
        console.error("Error fetching exams:", examsError);
        setLoading(false);
        return;
      }

      const { data: userData, error: userError } =
        await supabase.rpc("get_user_count");
      const userCount = userError ? 0 : userData || 0;

      const { data: uniData, error: uniError } = await supabase
        .from("exams")
        .select("institution")
        .eq("status", "approved");

      let universityCount = 0;
      if (!uniError && uniData) {
        const uniqueUniversities = [
          ...new Set(uniData.map((item) => item.institution).filter(Boolean)),
        ];
        universityCount = uniqueUniversities.length;
      }

      setRecentExams((examsData || []).slice(0, 6));
      setStats([
        {
          id: 1,
          number: `${formatNumber(examsData?.length || 0)}+`,
          label: "Exams Available",
        },
        {
          id: 2,
          number: `${formatNumber(universityCount)}+`,
          label: "Institutions",
        },
        {
          id: 3,
          number: `${formatNumber(userCount)}+`,
          label: "Active Students",
        },
      ]);
      setLoading(false);
    };

    fetchAllData();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <HomeHeader stats={stats} />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-5 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <FeatureBlock key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <div className="mb-1 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">
              Latest exam papers
            </h2>
            <p className="mt-1 text-gray-600">
              Recently approved papers uploaded by students.
            </p>
          </div>
          <Link
            to="/exams"
            className="whitespace-nowrap text-sm font-medium text-[#2f9e6d] transition-colors duration-150 hover:text-[#237a54]"
          >
            View all exams →
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-52 animate-pulse rounded-2xl bg-slate-100"
                />
              ))
            : recentExams.map((exams) => (
                <ExamCard key={exams.uuid} exam={exams} viewMode={"grid"} />
              ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-[1.8rem] border border-slate-300 bg-slate-950 p-8 shadow-[0_18px_60px_rgba(15,23,42,0.2)] lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
              Registration
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight text-white md:text-5xl">
              Create an account and start browsing papers.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 md:text-base">
              Register for free, search the archive, and find the papers you
              need for revision.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link
              to="/register"
              className="rounded-full bg-white px-8 py-3.5 text-center text-sm font-bold uppercase tracking-[0.22em] text-slate-950 transition-transform duration-200 hover:-translate-y-0.5"
            >
              Register now
            </Link>
            <Link
              to="/exams"
              className="rounded-full border border-white/15 bg-white/5 px-8 py-3.5 text-center text-sm font-bold uppercase tracking-[0.22em] text-white transition-colors duration-200 hover:bg-white/10"
            >
              Browse exams
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
