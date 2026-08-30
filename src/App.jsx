import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/authContext/AuthProvider.jsx";
import { LoginModalProvider } from "./context/loginContext/LoginModalContext.jsx";
import { useLoginModal } from "./context/loginContext/useLoginModal.js";
import LoginModal from "./pages/Login.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
const Upload = lazy(() => import("./pages/UploadPage"));
const MainLayout = lazy(() => import("./components/Mainlayout"));
const AuthLayout = lazy(() => import("./layouts/AuthLayout"));
const ExamViewer = lazy(() => import("./pages/ExamViewer"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const Home = lazy(() => import("./pages/Home"));
const Register = lazy(() => import("./pages/Register"));
const Contact = lazy(() => import("./pages/Contact"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ForgotPassword = lazy(() => import("./pages/ForgetPassword"));
const ExamPage = lazy(() => import("./pages/ExamPage"));
const Admin = lazy(() => import("./pages/Admin"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const CompleteProfile = lazy(() => import("./pages/CompleteProfile"));
function AppContent() {
  const { isLoginOpen, closeLogin, redirectTo } = useLoginModal();

  return (
    <>
      <Toaster position="top-right" />
      <ScrollToTop />

      <Suspense fallback={<LoadingSpinner />}>
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
            <Route path="/login" element={<LoginRoute />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>

        {isLoginOpen && (
          <LoginModal onClose={closeLogin} redirectTo={redirectTo} />
        )}
      </Suspense>
    </>
  );
}

function LoginRoute() {
  const navigate = useNavigate();

  return <LoginModal onClose={() => navigate("/")} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LoginModalProvider>
          <AppContent />
        </LoginModalProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
