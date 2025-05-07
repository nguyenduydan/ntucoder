import "./assets/css/App.css";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/admin";
import UserLayout from "./layouts/user";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import initialTheme from "./theme/theme"; //  { themeGreen }
import { useState, useEffect } from "react";
import Loading from "./components/loading/loadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import ProgressBar from "components/loading/ProgressBar";
import ProtectedRoute from "components/protectedRouter/ProtectedRoute";
const MotionFlex = motion(Flex);

export default function Main() {
  // State theme và trạng thái loading
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Giả lập quá trình tải (ví dụ 1 giây)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ChakraProvider theme={currentTheme}>
      <ProgressBar />
      {isLoading ? (
        <Loading message="Chào mừng đến với NTUCODER" />
      ) : (
        <AnimatePresence>
          <MotionFlex
            key="content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            direction="column"
            width="100%"
          >
            <Routes>
              <Route
                path="admin/*"
                element={
                  <ProtectedRoute allowedRoles={[1, 3]}>
                    <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
                  </ProtectedRoute>
                }
              />
              <Route path="/*" element={
                <UserLayout theme={currentTheme} setTheme={setCurrentTheme} />
              } />
            </Routes>
          </MotionFlex>
        </AnimatePresence>
      )}
    </ChakraProvider>
  );
}
