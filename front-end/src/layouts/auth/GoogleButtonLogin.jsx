import { useEffect } from "react";

const GoogleLoginButton = ({ onSuccess, onError }) => {
    useEffect(() => {
        /* global google */
        if (window.google) {
            window.google.accounts.id.initialize({
                client_id: import.meta.env.VITE_API_CLIENT_ID,
                callback: onSuccess,
            });

            window.google.accounts.id.renderButton(
                document.getElementById("google-signin-button"),
                { theme: "outline", size: "large" }
            );

            // Nếu muốn tự động hiển thị popup đăng nhập:
            // window.google.accounts.id.prompt();
        }
    }, [onSuccess]);

    return <div id="google-signin-button"></div>;
};

export default GoogleLoginButton;
