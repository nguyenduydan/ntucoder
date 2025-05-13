import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop({ children }) {
  const location = useLocation();

  useEffect(() => {
    if (!location.pathname.includes("/templates")) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  return <>{children}</>;
}
