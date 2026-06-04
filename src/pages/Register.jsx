import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
export default function Register() {
   const [formData, setformData] = useState({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
   });
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');
   const navigate = useNavigate();

   const handleChange = (e) => {
      setformData({
         ...formData,
         [e.target.name]: e.target.value,
      });
   };
   const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      if (formData.password !== formData.confirmPassword) {
         setError("Passwords don't match");
         setLoading(false);
         return;
      }
      if (formData.password.length < 6) {
         setError('Password must be at least 6 characters');
         return;
      }

      setLoading(true);
      try {
         //here add supabase auth logic to register the user
         navigate('/dashboard');
      } catch (err) {
         setError(err.message);
      } finally {
         setLoading(false);
      }
   };
   return (
      <div className="h-[95vh] flex items-center justify-center">
         <div className="w-full md:max-w-lg  sm:max-w-md flex justify-center font-inter flex-col items-center border border-gray-300 bg-white py-6 rounded-lg shadow-lg">
            <h1 className="text-2xl  font-bold text-center ">Register Now!</h1>
            {error && (
               <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-1  m-1 text-sm">
                  {error}
               </div>
            )}
            <form onSubmit={handleSubmit}>
               <label
                  htmlFor="username"
                  className="block mb-2  font-mediumtext-gray-700"
               >
                  Username:
               </label>
               <input
                  type="text"
                  name="username"
                  value={formData.username}
                  placeholder="Username"
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-[var(--cp)] mb-2"
               />
               <label
                  htmlFor="email"
                  className="block text-gray-700 font-medium mb-2"
               >
                  Email:
               </label>
               <input
                  type="email"
                  name="email"
                  value={formData.email}
                  placeholder="Email"
                  required
                  onChange={handleChange}
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-[var(--cp)] mb-2"
               />
               <label
                  htmlFor="password"
                  className="block text-gray-700 font-medium mb-2"
               >
                  Password:
               </label>
               <input
                  type="password"
                  name="password"
                  value={formData.password}
                  placeholder="Password"
                  required
                  onChange={handleChange}
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-[var(--cp)] mb-2"
               />
               <label
                  htmlFor="confirmPassword"
                  className="block text-gray-700 font-medium mb-2"
               >
                  Confirm Password:
               </label>
               <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  placeholder="Confirm Password"
                  required
                  onChange={handleChange}
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-[var(--cp)] mb-2  "
               />
               <button
                  type="submit"
                  value="Register"
                  className="w-full bg-[var(--cp)] text-black font-semibold py-3 mt-2 rounded-lg hover:bg-[#4bc864] transition-all duration-300 disabled:opacity-50"
               >
                  {loading ? 'Registering...' : 'Register'}
               </button>
            </form>
            <div className="mt-4 text-center">
               <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-[#4bc864] hover:underline">
                     Login here
                  </Link>
               </p>
            </div>
         </div>
      </div>
   );
}
