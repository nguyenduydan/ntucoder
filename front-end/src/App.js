import "./assets/css/App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "./layouts/auth";
import AdminLayout from "./layouts/admin";
import { ChakraProvider } from "@chakra-ui/react";
import initialTheme from "./theme/theme"; //  { themeGreen }
import { useState, useEffect } from "react";
import Loading from "./components/loading/loadingSpinner";

export default function Main() {
  // State theme và trạng thái loading
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Giả lập quá trình tải (ví dụ 2 giây)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ChakraProvider theme={currentTheme}>
      {isLoading ? (
        <Loading message="Chào mừng đến với NTUCODER" />
      ) : (
        <Routes>
          <Route path="auth/*" element={<AuthLayout />} />
          <Route
            path="admin/*"
            element={
              <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
            }
          />
          <Route path="/" element={<Navigate to="/admin" replace />} />
        </Routes>
      )}
    </ChakraProvider>
  );
}
