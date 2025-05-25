import React, { lazy, Suspense, useMemo } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useColorModeValue, Box, Spinner } from "@chakra-ui/react";
import routes from "@/routes";

// Import layouts/components
import Navbar from "@/layouts/user/components/navbar";
const NotFound = React.lazy(() => import('views/user/NotFound.jsx'));
import ProtectedRoute from "components/protectedRouter/ProtectedRoute";
import Profile from "views/user/Profile";
import LoadingScreen from "@/components/loading/ScreenLoading";

export default function Home(props) {
    const { ...rest } = props;
    const bg = useColorModeValue("gray.200", "navy.800");
    const textColor = useColorModeValue("black", "white");
    const location = useLocation();

    // Kiểm tra xem có phải route full screen map hay không
    const isFullScreenMap = location.pathname === "/user/full-screen-maps";

    // Lọc route thuộc layout user
    const userRoutes = useMemo(() => routes.filter((r) => r.layout === "/user"), []);

    // Tạo flat list các Route element từ userRoutes
    const renderRoutes = () => {
        const allRoutes = [];

        userRoutes.forEach((route, idx) => {
            // Route chính
            const mainElement = route.protected
                ? <ProtectedRoute key={`route-${idx}`}>{route.component}</ProtectedRoute>
                : React.cloneElement(route.component, { key: `route-${idx}` });

            allRoutes.push(
                <Route
                    key={`route-${idx}`}
                    path={route.path}
                    element={mainElement}
                />
            );

            // Route con (nếu có)
            if (route.item && Array.isArray(route.item)) {
                route.item.forEach((subRoute, sIdx) => {
                    const fullPath = `${route.path}/${subRoute.path}`;
                    const subElement = subRoute.protected
                        ? <ProtectedRoute key={`subroute-${idx}-${sIdx}`}>{subRoute.component}</ProtectedRoute>
                        : React.cloneElement(subRoute.component, { key: `subroute-${idx}-${sIdx}` });

                    allRoutes.push(
                        <Route
                            key={`subroute-${idx}-${sIdx}`}
                            path={fullPath}
                            element={subElement}
                        />
                    );
                });
            }
        });

        // Routes đặc biệt ngoài map
        allRoutes.push(
            <Route key="profile-main" path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />,
            <Route key="profile-id" path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />,
            <Route key="not-found" path="*" element={<NotFound />} />
        );

        return allRoutes;
    };

    return (
        <Box bg={bg} color={textColor} h="100vh" display="flex" flexDirection="column">
            <Navbar routes={userRoutes} {...rest} />

            {!isFullScreenMap && (
                <Box
                    flex="1"
                    w="100%"
                    overflowX="hidden"
                    overflowY="auto"
                    position="relative"
                    bg={bg}
                    color={textColor}
                    mx={{ lg: "auto", md: "0" }}
                    transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
                    transitionDuration=".2s, .2s, .35s"
                    transitionProperty="top, bottom, width"
                    transitionTimingFunction="linear, linear, ease"
                >
                    <Suspense fallback={<LoadingScreen />}>
                        <Routes>{renderRoutes()}</Routes>
                    </Suspense>
                </Box>
            )}
        </Box>
    );
}
