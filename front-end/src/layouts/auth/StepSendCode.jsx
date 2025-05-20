import { useState } from "react";
import { FormControl, FormLabel, Input, Button, useToast, FormErrorMessage } from "@chakra-ui/react";
import api from "@/config/apiConfig";

const StepSendCode = ({ onCodeSent }) => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const toast = useToast();

    const handleSendCode = async () => {
        setError("");
        if (!email) {
            setError("Vui lòng nhập email.");
            return;
        }
        setLoading(true);
        try {
            const res = await api.post("/auth/send-reset-code", { email });
            if (res.status === 200) {
                toast({
                    title: "Mã reset đã được gửi đến email của bạn.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    variant: "top-accent",
                    position: "top",
                });
                onCodeSent(email);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Gửi mã thất bại. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <FormControl isInvalid={!!error}>
                <FormLabel>Email</FormLabel>
                <Input
                    type="email"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                />
                <FormErrorMessage>{error}</FormErrorMessage>
            </FormControl>
            <Button mt={4} colorScheme="blue" onClick={handleSendCode} isLoading={loading} width="30%">
                Gửi mã
            </Button>
        </>
    );
};

export default StepSendCode;
