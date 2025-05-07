import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";
import { useToast } from "@chakra-ui/react";

const ProtectedRoute = ({ allowedRoles, children }) => {
    const { isAuthenticated, coder } = useAuth();
    const toast = useToast();

    const [shouldRedirect, setShouldRedirect] = useState(false);
    const [redirectReason, setRedirectReason] = useState("");

    // Kiểm tra quyền truy cập khi người dùng thay đổi trạng thái
    useEffect(() => {
        if (!isAuthenticated) {
            setRedirectReason("Bạn cần đăng nhập để truy cập trang này.");
            setShouldRedirect(true);
        } else if (!allowedRoles.includes(coder?.roleID)) {
            setRedirectReason("Bạn không có quyền truy cập.");
            setShouldRedirect(true);
        }
    }, [isAuthenticated, coder, allowedRoles]);

    // Hiển thị thông báo nếu phải chuyển hướng
    useEffect(() => {
        if (shouldRedirect && redirectReason) {
            toast({
                title: redirectReason,
                status: "warning",
                duration: 2000,
                isClosable: true,
                position: "top",
                variant: "top-accent",
            });
        }
    }, [shouldRedirect, redirectReason, toast]);

    // Nếu cần chuyển hướng thì thực hiện
    if (shouldRedirect) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
