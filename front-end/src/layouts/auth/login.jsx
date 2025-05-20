import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    InputGroup,
    InputRightElement,
    IconButton,
    Button,
    useToast,
    Text,
    Link,
    Box,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState } from "react";
import FlushedInput from "../../components/fields/InputField";
import { login } from "@/config/apiService";
import api from "@/config/apiConfig";

const Login = ({ onSuccess, onForgotPassword }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [loginData, setLoginData] = useState({ userName: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ userName: "", password: "" });

    const toast = useToast();

    const handleLogin = async () => {
        setErrors({ userName: "", password: "" });

        if (!loginData.userName || !loginData.password) {
            setErrors({
                userName: !loginData.userName ? "Tên đăng nhập không thể bỏ trống." : "",
                password: !loginData.password ? "Mật khẩu không thể bỏ trống." : ""
            });
            return;
        }

        setLoading(true);
        try {
            const response = await login(loginData); // login() gọi API login backend

            if (response.status === 200) {
                const resUser = await api.get('/Auth/me', { withCredentials: true });

                if (resUser.status === 200) {
                    onSuccess(resUser.data);
                }

                toast({
                    title: "Đăng nhập thành công!",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "top",
                    variant: "top-accent",
                });
            } else {
                const errorMessage = response.data?.message || "Vui lòng kiểm tra thông tin";
                setErrors({ userName: errorMessage, password: errorMessage });
            }
        } catch (error) {
            console.error('Error:', error);
            setErrors({
                userName: error.response?.data || "Tên đăng nhập hoặc mật khẩu không đúng",
                password: error.response?.data || "Tên đăng nhập hoặc mật khẩu không đúng",
            });
        } finally {
            setLoading(false);
        }
    };


    return (
        <form
            onSubmit={(e) => {
                e.preventDefault(); // Ngăn submit mặc định của trình duyệt
                handleLogin();
            }}
        >
            <FormControl isInvalid={!!errors.userName}>
                <FormLabel fontWeight="bold">Tên đăng nhập</FormLabel>
                <FlushedInput
                    type="text"
                    placeholder="Nhập tên đăng nhập"
                    value={loginData.userName}
                    onChange={(e) =>
                        setLoginData({ ...loginData, userName: e.target.value })
                    }
                    autoFocus
                />
                <FormErrorMessage>{errors.userName}</FormErrorMessage>
            </FormControl>

            <FormControl mt={4} isInvalid={!!errors.password}>
                <FormLabel fontWeight="bold">Mật khẩu</FormLabel>
                <InputGroup>
                    <FlushedInput
                        type={showPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu"
                        value={loginData.password}
                        onChange={(e) =>
                            setLoginData({ ...loginData, password: e.target.value })
                        }
                    />
                    <InputRightElement>
                        <IconButton
                            variant="link"
                            icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label="Toggle Password Visibility"
                        />
                    </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>

            <Button
                type="submit"
                colorScheme="blue"
                width="full"
                mt={7}
                isLoading={loading}
                loadingText="Đang đăng nhập.."
                _hover={{ boxShadow: "0px 4px 10px rgb(74, 168, 222)" }}
            >
                Đăng nhập
            </Button>

            {/* Nút quên mật khẩu */}
            <Box textAlign="right" mt={2}>
                <Link
                    color="blue.500"
                    fontSize="sm"
                    cursor="pointer"
                    onClick={() => {
                        if (onForgotPassword) onForgotPassword();
                    }}
                    _hover={{ textDecoration: "underline" }}
                >
                    Quên mật khẩu?
                </Link>
            </Box>
        </form>
    );
};

export default Login;
