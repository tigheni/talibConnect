import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MainLayout from './components/Mainlayout';
import Browse from './pages/Browse';
import About from './pages/About';
import Contact from './pages/Contact';

export default function App() {
   return (
      <BrowserRouter>
         <Routes>
            <Route element={<MainLayout />}>
               <Route path="/" element={<Home />} />
               <Route path="/login" element={<Login />} />
               <Route path="/register" element={<Register />} />
               <Route path="/dashboard" element={<Dashboard />} />
               <Route path="/about" element={<About />} />
               <Route path="/browse" element={<Browse />} />
               <Route path="/contact" element={<Contact />} />
            </Route>
         </Routes>
      </BrowserRouter>
   );
}
