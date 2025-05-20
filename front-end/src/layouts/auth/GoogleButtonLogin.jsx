import { GoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { Box } from "@chakra-ui/react";

const GoogleLoginButton = ({ onSuccess, onError }) => {
    return (
        <Box display="inline-block">
            <GoogleLogin
                onSuccess={(credentialResponse) => {
                    onSuccess(credentialResponse);
                }}
                onError={() => {
                    onError?.({ message: "Đăng nhập Google thất bại" });
                }}
                useOneTap={false} // không tự hiện popup
                text="signin_with"
                shape="pill"
                logo_alignment="left"
                width="280"
            />
        </Box>
    );
};

export default GoogleLoginButton;
