import { useState } from "react";
import {
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    IconButton,
    Button,
    useToast,
    FormErrorMessage,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import api from "@/config/apiConfig";

const StepResetPassword = ({ email, code, onResetSuccess }) => {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const toast = useToast();

    const handleReset = async () => {
        setError("");
        if (!password) {
            setError("Vui lòng nhập mật khẩu mới.");
            return;
        }
        if (password.length < 6) {
            setError("Mật khẩu ít nhất 6 ký tự.");
            return;
        }

        setLoading(true);
        try {
            const res = await api.post("/auth/reset-password", { email, code, newPassword: password });

            if (res.status === 200) {
                toast({
                    title: "Đổi mật khẩu thành công!",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                onResetSuccess();
            }
        } catch (err) {
            setError(err.response?.data?.message || "Đổi mật khẩu thất bại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <FormControl isInvalid={!!error}>
                <FormLabel>Mật khẩu mới</FormLabel>
                <InputGroup>
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu mới"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoFocus
                    />
                    <InputRightElement>
                        <IconButton
                            aria-label="Toggle password visibility"
                            icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                            onClick={() => setShowPassword(!showPassword)}
                            variant="ghost"
                        />
                    </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{error}</FormErrorMessage>
            </FormControl>
            <Button mt={4} colorScheme="blue" onClick={handleReset} isLoading={loading} width="30%">
                Đổi mật khẩu
            </Button>
        </>
    );
};

export default StepResetPassword;
