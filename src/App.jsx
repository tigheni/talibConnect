import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/Mainlayout";
import ScrollToTop from "./components/ScrollToTop";
import AuthLayout from "./components/AuthLayout";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Upload = lazy(() => import("./pages/UploadPage"));
const Contact = lazy(() => import("./pages/Contact"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ForgotPassword = lazy(() => import("./pages/ForgetPassword"));

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={null}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
