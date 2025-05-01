import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useColorModeValue } from '@chakra-ui/react';
import routes from 'routes.js';

// Import layouts
import Footer from 'layouts/user/components/footer';
import Navbar from 'layouts/user/components/navbar';
import { Box } from '@chakra-ui/react';
import Profile from 'views/user/Profile/index.jsx';
import NotFound from 'views/user/NotFound.jsx';


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
        <Box bg={bg} color={textColor} h="86vh">
            <Navbar routes={userRoutes} {...rest} />
            <Box
                height="100%"
                overflow="auto"
                maxHeight="100%"
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
                        mx='auto'
                        w="100%"
                        h="100%"
                    >
                        <Routes>
                            {getRoutes(userRoutes)}
                            {routes.map((route, index) => (
                                <Route key={index} path={route.path} element={route.element} />
                            ))}

                            {/* ➕ Thêm route không xuất hiện trong menu ở đây */}
                            <Route path="/profile" element={<Profile />} />

                            {/* Optional: route 404 */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>

                    </Box>
                )}
            </Box>
            <Footer />
        </Box>
    );
}
