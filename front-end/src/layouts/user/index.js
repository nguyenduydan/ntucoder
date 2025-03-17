import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useColorModeValue } from '@chakra-ui/react';
import routes from 'routes.js';

// Import layouts
import Header from 'layouts/user/components/header';
import Footer from 'layouts/user/components/footer';
import Navbar from 'layouts/user/components/navbar';

import { Box } from '@chakra-ui/react';
import Problem from 'views/user/Problem';
import Course from 'views/user/Course';

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
    const getRoutes = (routesArray) =>
        routesArray.map((route, key) => {
            // Nếu route có layout là /user thì trả về một Route
            if (route.layout === '/user') {
                return (
                    <Route
                        key={key}
                        path={route.path}
                        element={route.component}
                    />
                );
            }
            // Nếu có thuộc tính collapse (nếu có nested routes) thì xử lý đệ quy
            if (route.collapse && route.items) {
                return getRoutes(route.items);
            }
            return null;
        });

    return (
        <Box bg={bg} color={textColor}>
            <Header />
            <Navbar routes={userRoutes} {...rest} />
            <Box
                minHeight="60vh"
                height="100%"
                overflow="auto"
                position="relative"
                maxHeight="100%"
                bg={bg}
                color={textColor}
                w={{ lg: "calc(100% - 360px)", md: "100%" }}
                mx={{ lg: "auto", md: "0" }}
                transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
                transitionDuration=".2s, .2s, .35s"
                transitionProperty="top, bottom, width"
                transitionTimingFunction="linear, linear, ease"
            >
                {getRoute() && (
                    <Box
                        mx="auto"
                        p={{ base: '20px', md: '20px' }}
                        pe="20px"
                        minH="60vh"
                        pt="50px"
                        w="100%"
                    >
                        <Routes>
                            {getRoutes(userRoutes)}
                            {/* Ví dụ: Nếu muốn chuyển hướng mặc định */}
                            <Route
                                key="home"
                                path="/"
                                element={<Navigate to="/" replace />}
                            />
                            <Route
                                key="course"
                                path="/course"
                                element={<Course />}
                            />
                            <Route
                                key="problem"
                                path="/problem"
                                element={<Problem />}
                            />
                        </Routes>
                    </Box>
                )}
            </Box>
            <Footer />
        </Box>
    );
}
