import ExamCard from "../components/exams/ExamCard";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { HomeHeader } from "../components/home/HomeHeader";
import { FeatureSection } from "../components/home/FeatureSection";
function formatNumber(value) {
  const num = Number(value) || 0;
  return new Intl.NumberFormat("en-US").format(num);
}

export default function Home() {
  const [stats, setStats] = useState([
    { id: 1, number: "0+", label: "Exams Available" },
    { id: 2, number: "0+", label: "Institutions" },
    { id: 3, number: "0+", label: "Active Students" },
  ]);
  const [recentExams, setRecentExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchAllData = async () => {
      setLoading(true);

      // Only the six cards are needed to paint the homepage. Keep aggregate
      // queries out of the critical render path below.
      const examsResult = await supabase
        .from("exams")
        .select(
          "title,subject,uuid,file_type,institution,year,downloads,uploader_name,teacher_name",
        )
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(6);

      const { data: examsData, error: examsError } = examsResult;

      if (examsError) {
        console.error("Error fetching exams:", examsError);
        if (active) setLoading(false);
        return;
      }

      const availableSubjects = [
        ...new Set(
          (examsData || []).map((item) => item.subject).filter(Boolean),
        ),
      ];
      if (!active) return;
      setSubjects(availableSubjects);
      setRecentExams(examsData || []);
      setLoading(false);

      // Stats are useful but do not affect the initial layout/content.
      const loadStats = async () => {
        const [userResult, examsCountResult, institutionsResult] = await Promise.all([
          supabase.rpc("get_user_count"),
          supabase.from("exams").select("uuid", { count: "exact", head: true }).eq("status", "approved"),
          supabase.from("exams").select("institution, subject").eq("status", "approved"),
        ]);

        if (!active) return;
        const userCount = userResult.error ? 0 : userResult.data || 0;
        const examCount = examsCountResult.error ? 0 : examsCountResult.count || 0;
        const { data: uniData, error: uniError } = institutionsResult;
        const universityCount = !uniError && uniData
          ? new Set(uniData.map((item) => item.institution).filter(Boolean)).size
          : 0;
        const allSubjects = !uniError && uniData
          ? [...new Set(uniData.map((item) => item.subject).filter(Boolean))]
          : availableSubjects;

        setStats([
          { id: 1, number: `${formatNumber(examCount)}+`, label: "Exams Available" },
          { id: 2, number: `${formatNumber(universityCount)}+`, label: "Institutions" },
          { id: 3, number: `${formatNumber(userCount)}+`, label: "Active Students" },
        ]);
        setSubjects(allSubjects);
      };

      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(loadStats, { timeout: 2000 });
      } else {
        window.setTimeout(loadStats, 0);
      }
    };

    fetchAllData();
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen  bg-slate-50 text-slate-950">
      <HomeHeader stats={stats} subjects={subjects} />

      <FeatureSection />

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
            className="whitespace-nowrap text-sm font-medium text-[#237a54] transition-colors duration-150 hover:text-[#237a54]"
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
