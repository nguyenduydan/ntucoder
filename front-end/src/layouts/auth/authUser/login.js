import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    InputGroup,
    InputRightElement,
    IconButton,
    Button,
    useToast,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState } from "react";
import FlushedInput from "../../../components/fields/InputField";
import { login } from "config/apiService";
import api from "config/apiConfig";
import Cookies from 'js-cookie';

const Login = ({ onSuccess }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [loginData, setLoginData] = useState({ userName: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ userName: "", password: "" });

    const toast = useToast();
    const handleLogin = async () => {
        setErrors({ userName: "", password: "" }); // Reset errors
        // Kiểm tra nếu tên đăng nhập hoặc mật khẩu bị bỏ trống
        if (!loginData.userName || !loginData.password) {
            setErrors(prevErrors => ({
                ...prevErrors,
                userName: !loginData.userName ? "Tên đăng nhập không thể bỏ trống." : "",
                password: !loginData.password ? "Mật khẩu không thể bỏ trống." : ""
            }));
            return; // Dừng lại nếu có trường trống
        }

        setLoading(true); // Bắt đầu quá trình đăng nhập
        try {
            const response = await login(loginData);
            if (response.status === 200 && response.data && response.data.token) {
                Cookies.set('token', response.data.token);
                const resUser = await api.get('/Auth/me',
                    {
                        withCredentials: true,
                    }
                );
                if (resUser.status === 200) {
                    onSuccess(resUser.data); // Gửi dữ liệu user lên Auth

                }
                toast({
                    title: "Đăng nhập thành công!",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "top",
                });
                window.location.href = '/';
            } else {
                const errorMessage = response.data?.message || "Vui lòng kiểm tra thông tin";
                setErrors(prevErrors => ({
                    ...prevErrors,
                    userName: errorMessage,
                    password: errorMessage,
                }));
            }
        } catch (error) {
            console.error('Error:', error);
            setErrors(prevErrors => ({
                ...prevErrors,
                userName: error.response?.data || "Tên đăng nhập hoặc mật khẩu không đúng",
                password: error.response?.data || "Tên đăng nhập hoặc mật khẩu không đúng",
            }));
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
                mt={4}
                isLoading={loading}
                loadingText="Đang đăng nhập.."
            >
                Đăng nhập
            </Button>
        </form>
    );
};

export default Login;
