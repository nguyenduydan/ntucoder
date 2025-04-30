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
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

const Login = ({ onSuccess }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [loginData, setLoginData] = useState({ userName: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ userName: "", password: "" });

    const toast = useToast();
    const navigate = useNavigate();

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
            if (response.status === 200 && response.data && response.data?.token) { // Kiểm tra sự tồn tại của token và response.data
                Cookies.set('token', response.data.token, { expires: 7, sameSite: 'Lax' });
                toast({
                    title: "Đăng nhập thành công!",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "top",
                });
                onSuccess(response.data); // Gửi dữ liệu user lên Auth
                navigate("/"); // Chuyển hướng đến trang chủ
            } else {
                // Kiểm tra sự tồn tại của message trong response.data
                const errorMessage = response.data?.message || "Vui lòng kiểm tra thông tin";
                // Cập nhật lỗi nếu có
                setErrors(prevErrors => ({
                    ...prevErrors,
                    userName: errorMessage,
                    password: errorMessage,
                }));
            }
        } catch (error) {
            console.error('Error:', error); // Log lỗi để debug
            // Cập nhật lỗi nếu có
            setErrors(prevErrors => ({
                ...prevErrors,
                userName: error.response?.data || "Tên đăng nhập hoặc mật khẩu không đúng",
                password: error.response?.data || "Tên đăng nhập hoặc mật khẩu không đúng",
            }));
        } finally {
            setLoading(false); // Kết thúc quá trình đăng nhập
        }
    };


    return (
        <>
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
                        />
                    </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>

            <Button
                colorScheme="blue"
                width="full"
                mt={4}
                onClick={handleLogin}
                isLoading={loading} // Hiển thị Spinner khi đang tải
                loadingText="Đang đăng nhập"
            >
                Đăng nhập
            </Button>
        </>
    );
};

export default Login;
