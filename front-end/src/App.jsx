import "./assets/css/App.css";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/admin";
import UserLayout from "./layouts/user";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import initialTheme from "./theme/theme";
import { useState, useEffect } from "react";
import ProgressBar from "@/components/loading/ProgressBar";
import ProtectedRoute from "components/protectedRouter/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import LoadingScreen from "@/components/loading/ScreenLoading";
import ScrollToTop from "./components/scroll/ScrollToTop";


export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  const { isLoading } = useAuth();
  const [showLoading, setShowLoading] = useState(isLoading);

  useEffect(() => {
    let timer;
    if (isLoading) {
      setShowLoading(true);
    } else {
      // Delay hide loading nếu isLoading = false
      timer = setTimeout(() => setShowLoading(false), 1000);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);


  return (
    <ChakraProvider theme={currentTheme}>
      <ProgressBar />
      {showLoading ? <LoadingScreen />
        : (
          <ScrollToTop>
            <Routes>
              <Route
                path="admin/*"
                element={
                  <ProtectedRoute allowedRoles={[1, 3]}>
                    <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/*"
                element={<UserLayout theme={currentTheme} setTheme={setCurrentTheme} />}
              />
            </Routes>
          </ScrollToTop>
        )}
    </ChakraProvider>
  );
}
