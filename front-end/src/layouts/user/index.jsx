import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useColorModeValue } from '@chakra-ui/react';
import routes from '@/routes';

// Import layouts
import Footer from '@/layouts/user/components/footer';
import Navbar from '@/layouts/user/components/navbar';
import { Box } from '@chakra-ui/react';
import Profile from 'views/user/Profile/index';
import NotFound from 'views/user/NotFound';
import ProtectedRoute from 'components/protectedRouter/ProtectedRoute';
import LoadingSpinner from '@/components/loading/spinner';

export default function Home(props) {
    const { ...rest } = props;
    // Áp dụng màu theo hệ thống (light/dark) từ Chakra UI
    const bg = useColorModeValue("gray.200", "navy.800");
    const textColor = useColorModeValue("black", "white");

    // Kiểm tra nếu không đang ở trang full-screen maps
    const getRoute = () => window.location.pathname !== '/user/full-screen-maps';

    // Lọc ra các route thuộc user (layout: "/user")
    const userRoutes = routes.filter((route) => route.layout === '/user');

    // Hàm sinh các Route từ mảng userRoutes
    const getRoutes = (routes) => {
        return routes.map((route, key) => {
            if (route.layout === '/user') {
                const routeKey = `route-${key}-${route.path}`;

                return (
                    <React.Fragment key={routeKey}>
                        {/* Route chính không bảo vệ */}
                        <Route path={`${route.path}`} element={route.component} />

                        {/* Route con: bảo vệ dựa vào field `protected` */}
                        {route.item && route.item.map((subRoute, subKey) => {
                            const fullPath = `${route.path}/${subRoute.path}`;
                            const element = subRoute.protected
                                ? <ProtectedRoute>{subRoute.component}</ProtectedRoute>
                                : subRoute.component;

                            return (
                                <Route
                                    key={`subroute-${key}-${subKey}`}
                                    path={fullPath}
                                    element={element}
                                />
                            );
                        })}
                    </React.Fragment>
                );
            }
            return null;
        });
    };



    return (
        <Box bg={bg} color={textColor} h="100vh" display="flex" flexDirection="column">
            <Navbar routes={userRoutes} {...rest} />

            <Box
                flex="1" // chiếm phần còn lại sau Navbar
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
                {getRoute() && (
                    <Box
                        mx="auto"
                        w="100%"
                        minH="100%" // đảm bảo chiều cao
                    >
                        <Suspense fallback={<LoadingSpinner />}>
                            <Routes>
                                {getRoutes(userRoutes)}
                                {routes.map((route) => (
                                    <Route
                                        key={`${route.path}-${route.name}`}
                                        path={route.path}
                                        element={<ProtectedRoute>{route.component}</ProtectedRoute>}
                                    />
                                ))}
                                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                                <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </Suspense>
                    </Box>
                )}
            </Box>
        </Box>
    );
}
