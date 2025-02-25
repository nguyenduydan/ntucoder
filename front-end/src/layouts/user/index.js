import React, { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import routes from 'routes.js';

// Import layouts
import Header from 'layouts/user/components/header';
import Footer from 'layouts/user/components/footer';
import Navbar from 'layouts/user/components/navbar';

import { Box } from '@chakra-ui/react';
import Problem from 'views/user/Problem';

export default function Home(props) {
    const { ...rest } = props;
    // const [fixed] = useState(false);
    // const [toggleSidebar, setToggleSidebar] = useState(false);

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
        <Box>
            <Header />
            <Navbar routes={userRoutes} {...rest} />
            <Box
                minHeight="100vh"
                height="100%"
                overflow="auto"
                position="relative"
                maxHeight="100%"
                w={{ base: '100%', xl: 'calc( 100% - 290px )' }}
                maxWidth={{ base: '100%', xl: 'calc( 100% - 290px )' }}
                transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
                transitionDuration=".2s, .2s, .35s"
                transitionProperty="top, bottom, width"
                transitionTimingFunction="linear, linear, ease"
            >
                {getRoute() && (
                    <Box
                        mx="auto"
                        p={{ base: '20px', md: '30px' }}
                        pe="20px"
                        minH="80vh"
                        pt="50px"
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
