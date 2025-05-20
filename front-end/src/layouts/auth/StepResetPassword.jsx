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
import { validatePassword } from "@/utils/utils";
import useDynamicPlaceholder from "@/hooks/useDynamicPlaceholder";

const StepResetPassword = ({ email, code, onResetSuccess }) => {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const toast = useToast();

    const handleReset = async () => {
        setError("");

        const validationError = validatePassword(password);
        if (validationError) {
            setError(validationError);  // hiển thị lỗi
            return;                     // dừng lại, không gọi API
        }

        setLoading(true);
        try {
            const res = await api.post("/auth/reset-password", {
                email,
                code,
                newPassword: password,
            });

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
    const placeholder = useDynamicPlaceholder(
        [
            "Mật khẩu mới",
            "Ít nhất 8 ký tự",
            "Ít nhất 1 chữ cái viết hoa",
            "Ít nhất 1 chữ cái viết thường",
            "Ít nhất 1 số",
            "Ít nhất 1 ký tự đặc biệt",
            "Mật khẩu không được chứa khoảng trắng.",
        ],
        { delaySpeed: 500 } // đổi thời gian delay ở đây
    );

    return (
        <>
            <FormControl isInvalid={!!error}>
                <FormLabel>Mật khẩu mới</FormLabel>
                <InputGroup>
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={placeholder}
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
