import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Upload from "./pages/UploadPage";
import MainLayout from "./components/Mainlayout";
import ScrollToTop from "./components/ScrollToTop";
import Contact from "./pages/Contact";
import AuthLayout from "./components/AuthLayout";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgetPassword";
export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        <Route elemet={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
