import { useEffect, useState } from "react";
import {
    FormControl,
    FormLabel,
    Input,
    Button,
    useToast,
    FormErrorMessage,
    Text,
} from "@chakra-ui/react";
import api from "@/config/apiConfig";

const StepVerifyCode = ({ email, onCodeVerified }) => {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [timeLeft, setTimeLeft] = useState(30); // Thời gian đếm ngược
    const toast = useToast();

    // Đếm ngược thời gian
    useEffect(() => {
        if (timeLeft <= 0) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    const handleVerifyCode = async () => {
        setError("");

        if (!code) {
            setError("Vui lòng nhập mã.");
            return;
        }

        if (timeLeft <= 0) {
            toast({
                title: "Mã đã hết hạn. Vui lòng yêu cầu mã mới.",
                status: "error",
                duration: 3000,
                isClosable: true,
                variant: "top-accent",
                position: "top",
            });
            return;
        }

        setLoading(true);
        try {
            const res = await api.post("/auth/verify-reset-code", { email, code });

            if (res.status === 200) {
                toast({
                    title: "Mã xác thực hợp lệ.",
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                    variant: "top-accent",
                    position: "top",
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
                    isDisabled={timeLeft <= 0}
                />
                <FormErrorMessage>{error}</FormErrorMessage>
            </FormControl>

            <Text mt={2} fontSize="sm" color={timeLeft <= 10 ? "red.500" : "gray.500"}>
                Mã hết hạn sau: {formatTime(timeLeft)}
            </Text>

            <Button
                mt={4}
                colorScheme="blue"
                onClick={handleVerifyCode}
                isLoading={loading}
                width="30%"
                isDisabled={timeLeft <= 0}
            >
                Xác nhận mã
            </Button>
        </>
    );
};

export default StepVerifyCode;
