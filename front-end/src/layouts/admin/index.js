// Chakra imports
import { Portal, Box, useDisclosure } from '@chakra-ui/react';
import Footer from 'components/footer/FooterAdmin.js';
// Layout components
import Navbar from 'components/navbar/NavbarAdmin.js';
import Sidebar from 'components/sidebar/Sidebar.js';
import { SidebarContext } from 'contexts/SidebarContext';
import React, { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import routes from 'routes.js';
import NotFound from 'views/user/NotFound.jsx';
import ProtectedRoute from 'components/protectedRouter/ProtectedRoute';
import { useAuth } from 'contexts/AuthContext';

// Custom Chakra theme
export default function Dashboard(props) {
  const { ...rest } = props;
  const { onOpen } = useDisclosure();
  const { coder } = useAuth();
  // states and functions
  const [fixed] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);
  // functions for changing the states from components
  const getRoute = () => {
    return window.location.pathname !== '/admin/full-screen-maps';
  };
  const getActiveRoute = (routes) => {
    let activeRoute = 'Default Brand Text';
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = getActiveRoute(routes[i].items);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      } else if (routes[i].category) {
        let categoryActiveRoute = getActiveRoute(routes[i].items);
        if (categoryActiveRoute !== activeRoute) {
          return categoryActiveRoute;
        }
      } else {
        // Kiểm tra nếu URL chứa đường dẫn của route
        if (
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          return routes[i].name; // Trả về tên của route
        }
      }
    }
    return activeRoute;
  };

  const getActiveNavbar = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveNavbar = getActiveNavbar(routes[i].items);
        if (collapseActiveNavbar !== activeNavbar) {
          return collapseActiveNavbar;
        }
      } else if (routes[i].category) {
        let categoryActiveNavbar = getActiveNavbar(routes[i].items);
        if (categoryActiveNavbar !== activeNavbar) {
          return categoryActiveNavbar;
        }
      } else {
        // Kiểm tra nếu URL chứa đường dẫn của route
        if (
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          return routes[i].secondary; // Trả về navbar phụ
        }
      }
    }
    return activeNavbar;
  };

  const getActiveNavbarText = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveNavbar = getActiveNavbarText(routes[i].items);
        if (collapseActiveNavbar !== activeNavbar) {
          return collapseActiveNavbar;
        }
      } else if (routes[i].category) {
        let categoryActiveNavbar = getActiveNavbarText(routes[i].items);
        if (categoryActiveNavbar !== activeNavbar) {
          return categoryActiveNavbar;
        }
      } else {
        // Kiểm tra nếu URL chứa đường dẫn của route
        if (
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          return routes[i].messageNavbar; // Trả về navbar text
        }
      }
    }
    return activeNavbar;
  };

  const getRoutes = (routes, coder) => {
    return routes.flatMap((route, key) => {
      if (route.layout === "/admin" && route.allowedRoles?.includes(coder?.roleID)) {
        let mainRoute = (
          <Route
            key={key}
            path={route.path}
            element={
              <ProtectedRoute allowedRoles={route.allowedRoles}>
                {route.component}
              </ProtectedRoute>
            }
          />
        );

        let subRoutes = route.item
          ? route.item.map((subRoute, subKey) => (
            <Route
              key={`${key}-${subKey}`}
              path={`${route.path}/${subRoute.path}`}
              element={subRoute.component}
            />
          ))
          : [];

        return [mainRoute, ...subRoutes];
      }
      return [];
    });
  };



  return (
    <Box >
      <Box >
        <SidebarContext.Provider
          value={{
            toggleSidebar,
            setToggleSidebar,
          }}
        >
          <Sidebar routes={routes} display="none" {...rest} />
          <Box
            float="right"
            minHeight="95vh"
            height="100%"
            overflow="auto"
            position="relative"
            maxHeight="100%"
            w={{ base: "100%", xl: "calc( 100% - 290px )" }}
            maxWidth={{ base: "100%", xl: "calc( 100% - 290px )" }}
            transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
            transitionDuration=".2s, .2s, .35s"
            transitionProperty="top, bottom, width"
            transitionTimingFunction="linear, linear, ease"

          >
            <Portal>
              <Box>
                <Navbar
                  onOpen={onOpen}
                  logoText={"NTU"}
                  brandText={getActiveRoute(routes)}
                  secondary={getActiveNavbar(routes)}
                  message={getActiveNavbarText(routes)}
                  fixed={fixed}
                  {...rest}
                />
              </Box>
            </Portal>

            {getRoute() ? (
              <Box
                mx="auto"
                p={{ base: "20px", md: "30px" }}
                pe="20px"
                minH="90vh"
                pt="50px"

              >
                <Routes>
                  {getRoutes(routes, coder)}
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  {/* Optional: route 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Box>
            ) : null}
            <Box>
              <Footer />
            </Box>
          </Box>
        </SidebarContext.Provider>
      </Box>
    </Box>
  );
}
