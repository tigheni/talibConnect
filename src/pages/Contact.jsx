import { useState } from "react";
import { TbSend } from "react-icons/tb";
import { BiMessageSquare } from "react-icons/bi";
import contactIll from "../assets/undraw_email_b5yu1111.svg";

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
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setStatus(""), 3000);
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
      console.error("Error submitting contact form:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex flex-col-reverse items-center justify-center gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:gap-12 lg:px-8">
      <div className="w-full max-w-lg bg-white px-5 py-6 rounded-lg shadow-lg border border-gray-300 sm:px-8">
        <div className="flex gap-2 justify-center items-center">
          <BiMessageSquare className="text-3xl text-[var(--cp)] sm:text-4xl" />
          <h1 className="text-xl font-bold text-center sm:text-2xl">
            Send us a Message
          </h1>
        </div>

        <p className="text-gray-600 text-center text-sm mt-3 mb-4">
          Have questions? We'll get back to you soon!
        </p>

        {status === "success" && (
          <div className="bg-green-500/10 border border-green-500 text-green-600 rounded-lg p-2 mb-4 text-sm text-center">
            Message sent successfully!
          </div>
        )}
        {status === "error" && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-2 mb-4 text-sm text-center">
            Failed to send. Please try again.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            className="w-full bg-gray-200 border border-gray-500 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:border-[var(--cp)] mb-3"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
            className="w-full bg-gray-100 border border-gray-500 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:border-[var(--cp)] mb-3"
          />

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            required
            rows={6}
            className="w-full bg-gray-100 border border-gray-500 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:border-[var(--cp)] mb-4 resize-none"
          ></textarea>

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full bg-[var(--cp)] text-black font-semibold py-2 rounded-lg hover:bg-[#4bc864] transition-all duration-300 disabled:opacity-50"
          >
            <TbSend className="inline-block mr-2 text-lg" />
            {status === "sending" ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
      <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md">
        <img
          src={contactIll}
          alt="contact illustration"
          className="w-full h-auto max-h-72 object-contain sm:max-h-96 lg:max-h-[500px]"
        />
      </div>
    </div>
  );
}
