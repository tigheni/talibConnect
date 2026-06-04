import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MainLayout from './components/Mainlayout';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

import Contact from './pages/Contact';

export default function App() {
   return (
      <BrowserRouter>
         <ScrollToTop />
         <Routes>
            <Route element={<MainLayout />}>
               <Route path="/" element={<Home />} />
               <Route path="/login" element={<Login />} />
               <Route path="/register" element={<Register />} />
               <Route path="/dashboard" element={<Dashboard />} />
               <Route path="/contact" element={<Contact />} />
            </Route>
         </Routes>
         <Footer />
      </BrowserRouter>
   );
}
