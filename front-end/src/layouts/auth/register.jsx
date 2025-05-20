// components/auth/Register
import React, { useState } from "react";
import {
    FormControl,
    FormLabel,
    InputGroup,
    InputRightElement,
    IconButton,
    Button,
    useToast,
    FormErrorMessage,
    Text,
    SimpleGrid,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import FlushedInput from "../../components/fields/InputField";
import { useNavigate } from "react-router-dom";
import { register } from "@/config/apiService";
import { validatePassword } from "@/utils/utils";

const Register = ({ onSuccess }) => {
    const [data, setData] = useState({ coderName: "", coderEmail: "", userName: "", password: "", repassword: "", phoneNumber: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ coderName: "", coderEmail: "", userName: "", password: "", repassword: "", phoneNumber: "" });
    const [loading, setLoading] = useState(false);

    const toast = useToast();
    const navigate = useNavigate();


    const validateInputs = (data) => {
        const errors = {
            coderName: !data.coderName ? "Họ và tên không thể bỏ trống." : "",
            coderEmail: !data.coderEmail
                ? "Email không thể bỏ trống."
                : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.coderEmail)
                    ? "Email không đúng định dạng."
                    : "",
            phoneNumber: data.phoneNumber && !/^0\d{9}$/.test(data.phoneNumber)
                ? "Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0."
                : "",

            userName: !data.userName
                ? "Tên đăng nhập không thể bỏ trống."
                : data.userName.length < 6
                    ? "Tên đăng nhập phải có ít nhất 6 ký tự."
                    : "",
            password: validatePassword(data.password),
            repassword: !data.repassword
                ? "Xác nhận mật khẩu không thể bỏ trống."
                : data.repassword !== data.password
                    ? "Mật khẩu xác nhận không khớp."
                    : "",
        };

        return errors;
    };


    const handleRegister = async () => {
        setErrors({ coderName: "", coderEmail: "", userName: "", password: "", repassword: "", phone: "", phoneNumber: "" }); // Reset errors

        const newErrors = validateInputs(data);

        const hasError = Object.values(newErrors).some((err) => err);
        if (hasError) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            const response = await register(data);

            if (response.status === 200 || response.status === 201) {
                toast({
                    title: "Đăng ký thành công!",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "top",
                    variant: "top-accent"
                });
                onSuccess(response.data);
                navigate("/");
            } else {
                toast({
                    title: "Đã xảy ra lỗi. Vui lòng thử lại.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position: "top",
                    variant: "top-accent"
                });
            }
        } catch (error) {
            console.error("Lỗi đăng ký:", error);
            const errorFields = error.response?.data?.errors;
            if (Array.isArray(errorFields)) {
                // Kiểm tra lỗi và gán vào từng trường tương ứng
                const newErrors = {};

                // Ví dụ, nếu lỗi chứa "Email đã tồn tại"
                if (errorFields.includes("Email đã tồn tại.")) {
                    newErrors.coderEmail = "Email đã tồn tại.";
                }

                setErrors((prevErrors) => ({
                    ...prevErrors,
                    ...newErrors,
                }));
            } else if (typeof errorFields === "object" && errorFields !== null) {
                // Gán lỗi từng trường nếu là object (trường hợp khác nếu lỗi trả về là object { fieldName: message })
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    ...errorFields,
                }));
            } else {
                // Lỗi chung khi không rõ nguyên nhân
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    general: "Đã xảy ra lỗi. Vui lòng thử lại.",
                }));
            }

        } finally {
            setLoading(false);
        }
    };


    return (
        <form
            onSubmit={(e) => {
                e.preventDefault(); // Ngăn submit mặc định của trình duyệt
                handleRegister();
            }}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isInvalid={!!errors.coderName}>
                    <FormLabel fontWeight="bold">
                        Họ và tên <Text as="span" color="red.500"> *</Text>
                    </FormLabel>
                    <FlushedInput
                        type="text"
                        placeholder="Nhập họ và tên"
                        value={data.coderName}
                        onChange={(e) => setData({ ...data, coderName: e.target.value })}
                    />
                    <FormErrorMessage>{errors.coderName}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.userName}>
                    <FormLabel fontWeight="bold">
                        Tên đăng nhập<Text as="span" color="red.500"> *</Text>
                    </FormLabel>
                    <FlushedInput
                        type="text"
                        placeholder="Nhập tên đăng nhập (ít nhất 6 ký tự)"
                        value={data.userName}
                        onChange={(e) => setData({ ...data, userName: e.target.value })}
                    />
                    <FormErrorMessage>{errors.userName}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.password}>
                    <FormLabel fontWeight="bold">
                        Mật khẩu<Text as="span" color="red.500"> *</Text>
                    </FormLabel>
                    <InputGroup>
                        <FlushedInput
                            type={showPassword ? "text" : "password"}
                            placeholder="Nhập ít nhất 6 ký tự"
                            value={data.password}
                            onChange={(e) => setData({ ...data, password: e.target.value })}
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

                <FormControl isInvalid={!!errors.repassword}>
                    <FormLabel fontWeight="bold">
                        Xác nhận mật khẩu<Text as="span" color="red.500"> *</Text>
                    </FormLabel>
                    <FlushedInput
                        type={showPassword ? "text" : "password"}
                        placeholder="Xác nhận mật khẩu"
                        value={data.repassword}
                        onChange={(e) => setData({ ...data, repassword: e.target.value })}
                    />
                    <FormErrorMessage>{errors.repassword}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.coderEmail}>
                    <FormLabel fontWeight="bold">
                        Email<Text as="span" color="red.500"> *</Text>
                    </FormLabel>
                    <FlushedInput
                        type="email"
                        placeholder="Nhập email"
                        value={data.coderEmail}
                        onChange={(e) => setData({ ...data, coderEmail: e.target.value })}
                    />
                    <FormErrorMessage>{errors.coderEmail}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.phoneNumber}>
                    <FormLabel fontWeight="bold">Số điện thoại</FormLabel>
                    <FlushedInput
                        type="number"
                        placeholder="Nhập số điện thoại"
                        value={data.phoneNumber}
                        onChange={(e) => setData({ ...data, phoneNumber: e.target.value })}
                    />
                    <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
                </FormControl>
            </SimpleGrid>

            <Button
                colorScheme="green"
                width="full"
                mt={6}
                type="submit"
                isLoading={loading}
                loadingText="Đang đăng ký..."
                _hover={{ boxShadow: "0px 4px 10px rgb(74, 222, 128)" }}
            >
                Đăng ký
            </Button>
        </form>

    );
};

export default Register;
