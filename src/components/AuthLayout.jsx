// src/layouts/AuthLayout.jsx
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen">
      <Outlet /> {/* Login or Register page goes here */}
    </div>
  );
}
