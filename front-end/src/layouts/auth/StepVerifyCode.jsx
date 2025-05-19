import { useState } from "react";
import { FormControl, FormLabel, Input, Button, useToast, FormErrorMessage } from "@chakra-ui/react";
import api from "@/config/apiConfig";

const StepVerifyCode = ({ email, onCodeVerified }) => {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const toast = useToast();

    const handleVerifyCode = async () => {
        setError("");
        if (!code) {
            setError("Vui lòng nhập mã.");
            return;
        }

        setLoading(true);
        try {
            // Nếu backend có api verify riêng thì gọi ở đây
            // Nếu không có, bạn có thể gọi API đổi mật khẩu luôn ở bước cuối
            // Giả sử backend có api xác thực mã code:
            const res = await api.post("/auth/verify-reset-code", { email, code });

            if (res.status === 200) {
                toast({
                    title: "Mã xác thực hợp lệ.",
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                });
                onCodeVerified(code);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Mã không hợp lệ hoặc đã hết hạn.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <FormControl isInvalid={!!error}>
                <FormLabel>Mã xác thực</FormLabel>
                <Input
                    placeholder="Nhập mã đã nhận"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    autoFocus
                />
                <FormErrorMessage>{error}</FormErrorMessage>
            </FormControl>
            <Button mt={4} colorScheme="blue" onClick={handleVerifyCode} isLoading={loading} width="30%">
                Xác nhận mã
            </Button>
        </>
    );
};

export default StepVerifyCode;
