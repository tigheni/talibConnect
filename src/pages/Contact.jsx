import { useState } from 'react';

export default function Contact() {
   const contactEndpoint = import.meta.env.VITE_CONTACT_ENDPOINT;
   const [formData, setFormData] = useState({
      name: '',
      email: '',
      message: '',
   });
   const [status, setStatus] = useState('');

   const handleSubmit = async (e) => {
      e.preventDefault();
      setStatus('sending');

      if (!contactEndpoint) {
         setStatus('error');
         return;
      }

      try {
         const res = await fetch(contactEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
         });

         if (res.ok) {
            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => setStatus(''), 3000);
         } else {
            setStatus('error');
         }
      } catch (err) {
         setStatus('error');
         console.error('Error submitting contact form:', err);
      }
   };

   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   return (
      <div className="min-h-screen flex items-center justify-center ">
         <div className="w-full max-w-lg bg-white py-4 px-8 rounded-lg shadow-lg border border-gray-300">
            <h1 className="text-2xl font-bold text-center mb-4">Contact Us</h1>

            <p className="text-gray-600 text-center text-sm mb-4">
               Have questions? We'll get back to you soon!
            </p>

            {status === 'success' && (
               <div className="bg-green-500/10 border border-green-500 text-green-600 rounded-lg p-2 mb-4 text-sm text-center">
                  Message sent successfully!
               </div>
            )}
            {status === 'error' && (
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
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:border-[var(--cp)] mb-3"
               />

               <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  required
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:border-[var(--cp)] mb-3"
               />

               <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  required
                  rows={8}
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:border-[var(--cp)] mb-4 resize-none"
               ></textarea>

               <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-[var(--cp)] text-black font-semibold py-2 rounded-lg hover:bg-[#4bc864] transition-all duration-300 disabled:opacity-50"
               >
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                  部队
               </button>
            </form>
         </div>
      </div>
   );
}
