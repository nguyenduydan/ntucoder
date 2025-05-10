import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";
import { useToast } from "@chakra-ui/react";

const ProtectedRoute = ({ allowedRoles, children }) => {
    const { isAuthenticated, coder, isLoading } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const [redirectReason, setRedirectReason] = useState("");

    //Check data
    //console.log("coder", coder);

    useEffect(() => {
        if (isLoading) return;

        if (!isAuthenticated) {
            setRedirectReason("Bạn cần phải đăng nhập.");
            setShouldRedirect(true);
        } else if (
            allowedRoles && !allowedRoles.includes(coder?.roleID)
        ) {
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
    if (shouldRedirect) return navigate(-1);

    return children;
};

export default ProtectedRoute;
