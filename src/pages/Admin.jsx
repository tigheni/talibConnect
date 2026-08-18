import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Admin() {
  const [pendingExams, setPendingExams] = useState([]);
  const [examsLoading, setExamsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();

  const visibleExams = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return pendingExams;

    return pendingExams.filter((exam) => {
      return (
        exam.title?.toLowerCase().includes(q) ||
        exam.subject?.toLowerCase().includes(q) ||
        exam.university?.toLowerCase().includes(q) ||
        exam.uploader_name?.toLowerCase().includes(q) ||
        String(exam.year || "")
          .toLowerCase()
          .includes(q)
      );
    });
  }, [pendingExams, filter]);

  useEffect(() => {
    if (authLoading) return;

    if (!user || !isAdmin) {
      navigate("/", { replace: true });
      return;
    }

    let cancelled = false;

    async function loadPendingExams() {
      setExamsLoading(true);
      const { data, error } = await supabase
        .from("exams")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (cancelled) return;

      if (error) {
        setMessage(error.message);
      } else {
        setPendingExams(data || []);
      }

      setExamsLoading(false);
    }

    loadPendingExams();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user, isAdmin, navigate]);

  const handleApprove = async (uuid) => {
    const { error } = await supabase
      .from("exams")
      .update({ status: "approved" })
      .eq("uuid", uuid);

    if (error) {
      setMessage(error.message);
      return;
    }

    setPendingExams((prev) => prev.filter((exam) => exam.uuid !== uuid));
    setMessage("Exam approved.");
  };

  const handleReject = async (uuid) => {
    const { error } = await supabase.from("exams").delete().eq("uuid", uuid);

    if (error) {
      setMessage(error.message);
      return;
    }

    setPendingExams((prev) => prev.filter((exam) => exam.uuid !== uuid));
    setMessage("Exam rejected and removed.");
  };

  if (examsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#2f9e6d]">
              Admin dashboard
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-slate-950 sm:text-5xl">
              Review pending exam papers
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-700">
              Approve valid uploads, reject the ones that do not belong, and
              keep the archive clean.
            </p>
          </div>

          <div className="mt-8 flex justify-between ">
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Pending exams
              </div>
              <div className="mt-2 text-3xl font-black text-slate-950">
                {pendingExams.length}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Status
              </div>
              <div className="mt-2 text-3xl font-black text-[#2f9e6d]">
                Live
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full max-w-xl rounded-[1.2rem] border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <label
                htmlFor="filterExam"
                className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500"
              >
                Search pending exams
              </label>
              <input
                id="filterExam"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="title, subject, university, uploader, year"
                className="mt-1 w-full bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="text-sm text-slate-600">
              Showing{" "}
              <span className="font-semibold text-slate-950">
                {visibleExams.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-950">
                {pendingExams.length}
              </span>
            </div>
          </div>

          {message && (
            <div className="mt-6 rounded-2xl border border-[#5ae4a8]/30 bg-[#5ae4a8]/10 px-4 py-3 text-sm text-emerald-800">
              {message}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {visibleExams.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-slate-900">
              No pending exams right now.
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Everything is approved, or there are no new uploads yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {visibleExams.map((exam) => (
              <article
                key={exam.uuid}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-black tracking-tight text-slate-950">
                        {exam.title}
                      </h3>
                      <span className="rounded-full border border-[#5ae4a8]/30 bg-[#5ae4a8]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#2f9e6d]">
                        Pending
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-600">
                      {exam.university} • {exam.subject} • {exam.year}
                    </p>

                    <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                      <p>
                        <span className="font-semibold text-slate-900">
                          Uploaded by:
                        </span>{" "}
                        {exam.uploader_name || "Unknown"}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-900">
                          Teacher consent:
                        </span>{" "}
                        {exam.teacher_consent ? "Yes" : "No"}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-900">
                          File:
                        </span>{" "}
                        <button
                          onClick={async () => {
                            const { data, error } = await supabase.storage
                              .from("exams")
                              .createSignedUrl(exam.file_path, 60 * 60);

                            if (error) {
                              setMessage(error.message);
                              return;
                            }

                            window.open(
                              data.signedUrl,
                              "_blank",
                              "noopener,noreferrer",
                            );
                          }}
                          className="text-[#2f9e6d] hover:underline"
                        >
                          View PDF
                        </button>
                      </p>
                      <p>
                        <span className="font-semibold text-slate-900">
                          Uploaded:
                        </span>{" "}
                        {exam.created_at
                          ? new Date(exam.created_at).toLocaleDateString()
                          : "Unknown"}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-3 lg:flex-col">
                    <button
                      onClick={() => handleApprove(exam.uuid)}
                      className="rounded-xl border border-[#5ae4a8] bg-[#5ae4a8] px-5 py-3 text-sm font-bold text-[#0f0f0f] transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(exam.uuid)}
                      className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-bold text-rose-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-rose-100 active:scale-95"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
