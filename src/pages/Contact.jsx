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
         const response = await fetch(contactEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
         });

         if (response.ok) {
            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => setStatus(''), 3000);
         } else {
            setStatus('error');
         }
      } catch {
         setStatus('error');
      }
   };

   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   return (
      <div className="min-h-screen bg-[#0f0f0f] font-inter">
         <div className="max-w-2xl mx-auto px-4 py-24">
            <div className="text-center mb-12">
               <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Contact Us
               </h1>
               <p className="text-gray-400">
                  Have questions? We'll get back to you soon!
               </p>
               <p className="text-gray-400">
                  You can also reach us at contact@talibconnect.com
               </p>
            </div>

            <form
               onSubmit={handleSubmit}
               className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800"
            >
               <div className="mb-4">
                  <input
                     type="text"
                     name="name"
                     placeholder="Your Name"
                     value={formData.name}
                     onChange={handleChange}
                     required
                     className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#63E87E]"
                  />
               </div>

               <div className="mb-4">
                  <input
                     type="email"
                     name="email"
                     placeholder="Your Email"
                     value={formData.email}
                     onChange={handleChange}
                     required
                     className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#63E87E]"
                  />
               </div>

               <div className="mb-6">
                  <textarea
                     name="message"
                     placeholder="Your Message"
                     value={formData.message}
                     onChange={handleChange}
                     required
                     rows={5}
                     className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#63E87E] resize-none"
                  ></textarea>
               </div>

               <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-[var(--cp)] text-black font-semibold py-3 rounded-lg hover:bg-[#4bc864] transition-all duration-300 disabled:opacity-50"
               >
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
               </button>

               {status === 'success' && (
                  <p className="text-green-500 text-center mt-4">
                     Message sent successfully!
                  </p>
               )}
               {status === 'error' && (
                  <p className="text-red-500 text-center mt-4">
                     Failed to send. Please try again.
                  </p>
               )}
            </form>
         </div>
      </div>
   );
}
