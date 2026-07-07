import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/Mainlayout";
import ScrollToTop from "./components/ScrollToTop";
import AuthLayout from "./layouts/AuthLayout";
import ExamViewer from "./pages/ExamViewer";
import ProtectedRoute from "./components/ProtectedRoute";
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Upload = lazy(() => import("./pages/UploadPage"));
const Contact = lazy(() => import("./pages/Contact"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ForgotPassword = lazy(() => import("./pages/ForgetPassword"));
const ExamPage = lazy(() => import("./pages/ExamPage"));
const Admin = lazy(() => import("./pages/Admin"));
export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={null}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              }
            />
            <Route path="/contact" element={<Contact />} />
            <Route path="/exams" element={<ExamPage />} />
            <Route path="/admin" element={<Admin />} />
          </Route>
          <Route path="/exam/:id" element={<ExamViewer />} />
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
