import "./assets/css/App.css";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/admin";
import UserLayout from "./layouts/user";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import initialTheme from "./theme/theme";
import { useState, useEffect } from "react";
import ProgressBar from "@/components/loading/ProgressBar";
import ProtectedRoute from "components/protectedRouter/ProtectedRoute";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ScrollToTop from "./components/scroll/ScrollToTop";


export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);


  return (
    <ChakraProvider theme={currentTheme}>
      <ProgressBar />
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
    </ChakraProvider>
  );
}
