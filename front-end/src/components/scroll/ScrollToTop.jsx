import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box } from "@chakra-ui/react";

export default function ScrollToTop({ children }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return <Box>{children}</Box>;
}
