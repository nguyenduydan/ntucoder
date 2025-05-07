import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";
import { useToast } from "@chakra-ui/react";

const ProtectedRoute = ({ allowedRoles, children }) => {
    const { isAuthenticated, coder, isLoading } = useAuth();
    const toast = useToast();

    const [shouldRedirect, setShouldRedirect] = useState(false);
    const [redirectReason, setRedirectReason] = useState("");

    console.log("coder", coder);

    useEffect(() => {
        if (isLoading) return; // Đợi tải xong

        if (!isAuthenticated) {
            setRedirectReason("Bạn cần đăng nhập để truy cập trang này.");
            setShouldRedirect(true);
        } else if (!allowedRoles.includes(coder?.roleID)) {
            setRedirectReason("Bạn không có quyền truy cập.");
            setShouldRedirect(true);
        }
    }, [isAuthenticated, coder, allowedRoles, isLoading]);

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

    if (isLoading) return null; // Hoặc spinner nếu bạn muốn
    if (shouldRedirect) return <Navigate to="/" replace />;

    return children;
};

export default ProtectedRoute;
