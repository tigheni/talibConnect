import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/authContext/AuthProvider.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
const Upload = lazy(() => import("./pages/UploadPage"));
const MainLayout = lazy(() => import("./components/MainLayout"));
const ExamViewer = lazy(() => import("./pages/ExamViewer"));
const Home = lazy(() => import("./pages/Home"));
const Contact = lazy(() => import("./pages/Contact"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ForgotPassword = lazy(() => import("./pages/AdminForgotPassword"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const ExamPage = lazy(() => import("./pages/ExamPage"));
const Admin = lazy(() => import("./pages/Admin"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
function AppContent() {
  return (
    <>
      <Toaster position="top-right" />
      <ScrollToTop />

      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />

            <Route path="/upload" element={<Upload />} />

            <Route path="/contact" element={<Contact />} />
            <Route path="/exams" element={<ExamPage />} />
            <Route path="/admin" element={<Admin />} />
          </Route>

          <Route path="/exam/:id" element={<ExamViewer />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/reset-password" element={<ResetPassword />} />
          <Route path="/admin/forgot-password" element={<ForgotPassword />} />

          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
