import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useColorModeValue } from '@chakra-ui/react';
import routes from 'routes.js';

// Import layouts
import Footer from 'layouts/user/components/footer';
import Navbar from 'layouts/user/components/navbar';
import { Box } from '@chakra-ui/react';

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
                return (
                    <>
                        <Route path={`${route.path}`} element={route.component} key={key} />
                        {route.item && route.item.map((subRoute, subKey) => (
                            <Route key={subKey} path={`${route.path}/${subRoute.path}`} element={subRoute.component} />
                        ))}
                    </>
                );
            }
            return null;
        });
    };

    return (
        <Box bg={bg} color={textColor}>
            <Navbar routes={userRoutes} {...rest} />
            <Box
                minHeight="60vh"
                height="100%"
                overflow="auto"
                position="relative"
                maxHeight="100%"
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
                        mx='auto'
                        minH="60vh"
                        w="100%"
                    >
                        <Routes>
                            {getRoutes(userRoutes)}
                            {routes.map((route, index) => (
                                <Route key={index} path={route.path} element={route.element} />
                            ))}
                        </Routes>
                    </Box>
                )}
            </Box>
            <Footer />
        </Box>
    );
}
