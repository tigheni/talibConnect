import { useState, useEffect } from "react";

const useMobile = (breakpoint = 640) => {
  const [isMobile, setIsMobile] = useState(() => {
    return window.innerWidth < breakpoint;
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < breakpoint);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [breakpoint]);
  const [viewMode, setViewMode] = useState(() => (isMobile ? "grid" : "list"));
  return { isMobile, viewMode, setViewMode };
};

export default useMobile;
