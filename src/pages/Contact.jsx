import { useState } from "react";
import { Send } from "lucide-react";
import contactIll from "../assets/contact.svg";
import toast from "react-hot-toast";

const REASONS = [
  { label: "Bug report", prefix: "I found a bug: " },
  { label: "Feature idea", prefix: "I'd love to see: " },
  { label: "Partnership", prefix: "I'd like to talk about a partnership: " },
  { label: "Other", prefix: "" },
];

export default function Contact() {
  const contactEndpoint = import.meta.env.VITE_CONTACT_ENDPOINT;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    if (!contactEndpoint) {
      setStatus("error");
      return;
    }

    try {
      const res = await fetch(contactEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Message sent — we'll get back to you soon.");
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setStatus(""), 3000);
      } else {
        const errorData = await res.json().catch(() => null);
        setStatus("error");
        toast.error(errorData?.error || "Failed to send. Please try again.");
      }
    } catch (err) {
      toast.error(" Failed to send. Please try again.");

      setStatus("error");
      console.error("Error submitting contact form:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReasonClick = (prefix) => {
    setFormData((prev) => ({ ...prev, message: prefix }));
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10 sm:px-6">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] rounded-xl overflow-hidden border border-black/15 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
        <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] px-8 py-10 sm:px-10 sm:py-12 flex flex-col justify-between overflow-hidden">
          <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-[#5ae4a8]/10 blur-3xl pointer-events-none" />

          <div className="relative">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#5ae4a8] font-roboto-mono">
              Get in touch
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mt-3 leading-tight">
              Got a question,
              <br />a bug, or an idea?
            </h1>
            <p className="text-gray-400 mt-4 text-sm leading-relaxed max-w-xs">
              TalibConnect is built by a student, for students. Tell us what's
              on your mind — every message actually gets read.
            </p>
          </div>

          <img
            src={contactIll}
            alt=""
            aria-hidden="true"
            className="relative w-full max-w-[220px] mx-auto my-8 opacity-95"
          />
        </div>

        <div className="bg-white px-6 py-10 sm:px-10 sm:py-12">
          <p className="text-xs font-medium text-gray-500 mb-2.5">
            What's this about?
          </p>
          <div className="flex flex-wrap gap-2 mb-7">
            {REASONS.map((reason) => (
              <button
                key={reason.label}
                type="button"
                onClick={() => handleReasonClick(reason.prefix)}
                className="px-3.5 py-1.5 rounded-full border border-gray-300 bg-gray-50 text-gray-700 text-xs font-medium transition-all duration-200 hover:border-[#5ae4a8] hover:text-[#2f9e6d] hover:bg-[#5ae4a8]/5 active:scale-95"
              >
                {reason.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-medium text-gray-500 mb-1.5 ml-1"
                >
                  Your name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Mohamed Kader"
                  required
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-800 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-[#5ae4a8] focus:ring-2 focus:ring-[#5ae4a8]/25 focus:bg-white"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-gray-500 mb-1.5 ml-1"
                >
                  Your email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-800 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-[#5ae4a8] focus:ring-2 focus:ring-[#5ae4a8]/25 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-xs font-medium text-gray-500 mb-1.5 ml-1"
              >
                Your message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us what's on your mind..."
                required
                rows={6}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-800 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-[#5ae4a8] focus:ring-2 focus:ring-[#5ae4a8]/25 focus:bg-white resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full flex items-center justify-center gap-2 bg-[#5ae4a8] text-black font-semibold py-3 rounded-xl shadow-[0px_4px_24px_0_rgba(99,232,126,.35)] transition-all duration-300 hover:bg-[#4bc864] hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed mt-1"
            >
              {status === "sending" ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
