import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-[#d4e1d8] bg-[#eaf1eb]">
      <div className="mx-auto flex max-w-[120rem] flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
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
          <Link to="/upload" className="hover:text-slate-950">
            Submit resource
          </Link>
          <Link to="/privacy" className="hover:text-slate-950">
            Privacy
          </Link>{" "}
          <Link to="/terms" className="hover:text-slate-950">
            Terms
          </Link>
          <Link to="/admin" className="hover:text-slate-950">
            Admin access
          </Link>
        </div>
      </div>
    </footer>
  );
}
