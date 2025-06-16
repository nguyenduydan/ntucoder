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
import Footer from "@/layouts/user/components/footer";

export default function Home(props) {
    const { ...rest } = props;
    const bg = useColorModeValue("gray.200", "navy.800");
    const textColor = useColorModeValue("black", "white");
    const location = useLocation();

    // Danh sách các trang không hiển thị footer
    const footerBlacklist = useMemo(() => [
        "/user/full-screen-maps",
    ], []);

    // Danh sách các pattern regex để ẩn footer
    const footerBlacklistPatterns = useMemo(() => [
        /^\/course\/[^\/]+\/\d+$/, // Pattern cho /course/slug/id
        /^\/lesson\/[^\/]+\/\d+$/, // Pattern cho /lesson/slug/id (nếu có)
        // Thêm các pattern khác nếu cần
    ], []);

    // Kiểm tra xem có phải route full screen map hay không
    const isFullScreenMap = location.pathname === "/user/full-screen-maps";

    // Kiểm tra xem có nên hiển thị footer hay không
    const shouldShowFooter = useMemo(() => {
        // Kiểm tra exact match và prefix match
        const isInBlacklist = footerBlacklist.some(path =>
            location.pathname === path ||
            location.pathname.startsWith(path + "/")
        );

        // Kiểm tra pattern match
        const isMatchPattern = footerBlacklistPatterns.some(pattern =>
            pattern.test(location.pathname)
        );

        return !isInBlacklist && !isMatchPattern;
    }, [location.pathname, footerBlacklist, footerBlacklistPatterns]);

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
        <Box bg={bg} color={textColor} minH="100vh" display="flex" flexDirection="column">
            <Navbar routes={userRoutes} {...rest} />

            {!isFullScreenMap && (
                <Box
                    flex="1"
                    w="100%"
                    // overflowX="hidden"
                    // overflowY="auto"
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

            {/* Footer chỉ hiển thị khi không có trong blacklist */}
            {shouldShowFooter && <Footer />}
        </Box>
    );
}
