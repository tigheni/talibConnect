import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ExamCard from "../components/exams/ExamCard";
import { supabase } from "../lib/supabase";
import { HomeHeader } from "../components/home/HomeHeader";
import { FeatureSection } from "../components/home/FeatureSection";
import SEO from "../components/SEO";
const EXAMS_PREVIEW_LIMIT = 6;
const formatNumber = new Intl.NumberFormat("en-US").format;
const INITIAL_STATS = [
  { id: 1, number: "0", label: "Approved Exams" },
  { id: 2, number: "0", label: "Institutions" },
  { id: 3, number: "0", label: "Subjects" },
];

const uniqueValues = (rows, key) => [
  ...new Set(rows.map((row) => row[key]).filter(Boolean)),
];

export default function Home() {
  const [stats, setStats] = useState(INITIAL_STATS);
  const [recentExams, setRecentExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasLoadedAllSubjects = useRef(false);

  useEffect(() => {
    let active = true;

    const loadPreview = async () => {
      const { data, error } = await supabase
        .from("exams")
        .select(
          "title,subject,uuid,file_type,institution,year,downloads,teacher_name",
        )
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(EXAMS_PREVIEW_LIMIT);

      if (error) {
        console.error("Error fetching exams:", error);
      }
      if (!active) return;

      const exams = data || [];
      // The preview gives us subjects immediately. Do not let a slower
      // development request overwrite the complete list loaded by stats.
      if (!hasLoadedAllSubjects.current) {
        setSubjects(uniqueValues(exams, "subject"));
      }
      setRecentExams(exams);
      setLoading(false);
    };

    const loadStats = async () => {
      const [examsCountResult, institutionsResult] =
        await Promise.all([
          supabase
            .from("exams")
            .select("uuid", { count: "exact", head: true })
            .eq("status", "approved"),
          supabase
            .from("exams")
            .select("institution, subject")
            .eq("status", "approved"),
        ]);

      if (!active) return;

      const rows = institutionsResult.data || [];
      const universityCount = institutionsResult.error
        ? 0
        : uniqueValues(rows, "institution").length;
      const allSubjects = institutionsResult.error
        ? []
        : uniqueValues(rows, "subject");

      setStats([
        {
          id: 1,
          number: formatNumber(examsCountResult.count || 0),
          label: "Approved Exams",
        },
        {
          id: 2,
          number: formatNumber(universityCount),
          label: "Institutions",
        },
        {
          id: 3,
          number: formatNumber(allSubjects.length),
          label: "Subjects",
        },
      ]);
      if (allSubjects.length) {
        hasLoadedAllSubjects.current = true;
        setSubjects(allSubjects);
      }
    };

    let idleId;
    let timeoutId;
    loadPreview();

    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(loadStats, { timeout: 2000 });
    } else {
      timeoutId = window.setTimeout(loadStats, 0);
    }

    return () => {
      active = false;
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <>
      <SEO
        title="TalibConnect | Algerian Exam Archive"
        description="Find and share past exam papers from universities across Algeria on TalibConnect."
        path="/"
      />
      <main className="min-h-screen  bg-slate-50 text-slate-950">
        <HomeHeader stats={stats} subjects={subjects} />

        <FeatureSection />

        <section className="mx-auto w-full max-w-[120rem] px-4 sm:px-6 lg:px-12 2xl:px-16">
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

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
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

        <section className="mx-auto w-full max-w-[120rem] px-4 pb-20 pt-16 sm:px-6 lg:px-12 2xl:px-16">
          <div className="grid gap-6 rounded-[1.8rem] border border-slate-300 bg-slate-950 p-8 shadow-[0_18px_60px_rgba(15,23,42,0.2)] lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                Contribute
              </p>
              <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight text-white md:text-5xl">
                Browse freely. Submit a resource for review.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 md:text-base">
                No account is needed to search, download approved papers, or
                submit a paper to the moderation queue.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                to="/upload"
                className="rounded-full bg-white px-8 py-3.5 text-center text-sm font-bold uppercase tracking-[0.22em] text-slate-950 transition-transform duration-200 hover:-translate-y-0.5"
              >
                Submit a resource
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
    </>
  );
}
