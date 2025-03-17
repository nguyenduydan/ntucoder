import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import routes from "routes.js";

const useTitle = () => {
    const location = useLocation();

    useEffect(() => {
        let title = "NTU-CODER"; // Tiêu đề mặc định
        const currentPath = location.pathname.replace(/\/$/, ""); // Xóa "/" cuối nếu có

        routes.forEach(route => {
            let routePath = `${route.layout}${route.path}`.replace(/\/$/, "");

            if (route.layout === "/user") {
                routePath = route.path; // Bỏ "/user" để khớp với URL
            }

            // Kiểm tra đường dẫn chính (VD: /course, /admin/dashboard)
            if (routePath === currentPath) {
                title = `${route.name} | NTU-CODER`;
            }

            // Xử lý layout USER (VD: /course/reactjs-101-123)
            if (route.layout === "/user" && route.item) {
                route.item.forEach(subRoute => {
                    const regex = new RegExp(`^${routePath}/(.+)-\\d+$`); // Bắt slug từ "/course/reactjs-101-123"
                    const match = currentPath.match(regex);

                    if (match) {
                        const courseName = match[1].replace(/-/g, " "); // Đổi "reactjs-101" -> "ReactJS 101"
                        title = `${courseName} | NTU-CODER`;
                    }
                });
            }

            // Xử lý layout ADMIN (VD: /admin/course/detail/10)
            if (route.layout === "/admin" && route.item) {
                route.item.forEach(subRoute => {
                    const regex = new RegExp(`^${routePath}/${subRoute.path.replace(":id", "\\d+")}$`);
                    if (regex.test(currentPath)) {
                        title = `${subRoute.name} | NTU-CODER`;
                    }
                });
            }
        });

        document.title = title;
    }, [location]);

    return null;
};

export default useTitle;
