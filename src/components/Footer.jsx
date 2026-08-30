import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-slate-400 bg-[#f8fafc]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <div className="text-lg font-black tracking-tight text-slate-950">
            TalibConnect
          </div>
          <p className="mt-1 text-sm text-slate-600">
            The largest collection of Algerian university exams.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-slate-600">
          <Link to="/exams" className="hover:text-slate-950">
            Browse
          </Link>
          <Link to="/register" className="hover:text-slate-950">
            Upload
          </Link>
          <Link to="/privacy" className="hover:text-slate-950">
            Privacy
          </Link>{" "}
          <Link to="/terms" className="hover:text-slate-950">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
