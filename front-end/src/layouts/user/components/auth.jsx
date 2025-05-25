import { useState } from "react";
import {
    Box, Flex, Button, useDisclosure, Modal, ModalOverlay,
    ModalContent, ModalHeader, ModalBody, ModalCloseButton,
    Menu, MenuButton, MenuList, MenuItem, Divider, Image,
    Avatar
} from "@chakra-ui/react";
import { LockIcon } from "@chakra-ui/icons";
import { MdAdminPanelSettings } from "react-icons/md";
import { NavLink } from "react-router-dom";
import Login from "../../auth/login";
import Register from "../../auth/register";
import ForgotPassword from "@/layouts/auth/ForgetPassword";
import { useAuth } from "@/contexts/AuthContext";
import GoogleLoginButton from "layouts/auth/GoogleButtonLogin";
import api from "@/config/apiConfig";
import { useToast } from "@chakra-ui/react";
import LoginImg from "@/assets/img/codingImg.png";

const Auth = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLogin, setIsLogin] = useState(true);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const { coder, setCoder, logout, loginSuccessHandler } = useAuth();
    const toast = useToast();
    const isGif = coder?.avatar ? /\.gif(\?.*)?$/i.test(coder.avatar) : false;

    const staticAvatar = isGif
        ? coder.avatar.replace(/\.gif(\?.*)?$/i, '.png')
        : coder?.avatar || '';

    const handleToggle = () => {
        setIsForgotPassword(false);
        setIsLogin(prev => !prev);
    };

    const handleLoginSuccess = (userData) => {
        if (userData) {
            setCoder(userData);
            setIsForgotPassword(false);
            onClose();
            loginSuccessHandler();
        }
    };

    const handleRegisterSuccess = (userData) => {
        if (userData) {
            setCoder(userData);
            toast({
                title: "Đăng ký thành công!",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top",
                variant: "top-accent",
            });
            setIsLogin(true);
            setIsForgotPassword(false);
            onOpen();
        }
    };

    const handleForgotPasswordClick = () => {
        setIsForgotPassword(true);
        onOpen();
    };

    const handleForgotPasswordSuccess = () => {
        setIsForgotPassword(false);
        setIsLogin(true);
        onClose();
    };

    const getModalSize = () => {
        if (isForgotPassword) return "3xl";
        if (!isLogin) return "2xl";
        return "md";
    };

    // 1. Định nghĩa hàm xử lý ở component cha (hoặc nơi bạn muốn)
    const handleGoogleLoginSuccess = async (response) => {
        if (!response?.credential) {
            toast({
                title: "Token không hợp lệ.",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top",
                variant: "top-accent",
            });
            return;
        }

        try {
            const res = await api.post("/auth/google-login", { token: response.credential });
            const data = res?.data;

            if (data?.token) {
                setCoder({
                    accountID: data.accountID,
                    roleID: data.roleID,
                    coderName: data.coderName,
                    token: data.token,
                });

                toast({
                    title: "Đăng nhập thành công!",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "top",
                    variant: "top-accent",
                });

                setIsForgotPassword(false);
                setIsLogin(true);
                onClose();
                loginSuccessHandler();
            } else {
                toast({
                    title: "Đăng nhập thất bại!",
                    description: "Token không hợp lệ hoặc thiếu thông tin.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position: "top",
                    variant: "top-accent",
                });
            }
        } catch (error) {
            console.error("Lỗi khi đăng nhập Google:", error);
            toast({
                title: "Lỗi đăng nhập Google",
                description: error?.response?.data?.message || error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top",
                variant: "top-accent",
            });
        }
    };


    const isOnline = !!coder;

    return (
        <Box bg="transparent">
            <Flex justifyContent="flex-end" gap={4}>
                {isOnline ? (
                    <Flex alignItems="center">
                        {(coder.roleID === 1 || coder.roleID === 3) && (
                            <NavLink to="/admin/dashboard">
                                <Button
                                    leftIcon={<MdAdminPanelSettings />}
                                    variant="outline"
                                    _hover={{ border: "1px solid blue" }}
                                    _active={{ transform: "scale(0.90)" }}
                                >
                                    Trang quản trị
                                </Button>
                            </NavLink>
                        )}
                        <Menu>
                            <MenuButton as={Button} variant="none">
                                <Avatar
                                    borderRadius="full"
                                    boxSize="40px"
                                    objectFit="cover"
                                    loading="lazy"
                                    border="3px solid blue"
                                    src={staticAvatar || { LoginImg }}
                                    fallbackSrc={LoginImg}
                                    fallback={<Image src={LoginImg} boxSize="40px" />}
                                    alt={coder.coderName || "coder"}
                                />
                            </MenuButton>
                            <MenuList p={2}>
                                <MenuItem
                                    as={NavLink}
                                    to="/profile"
                                    _hover={{ bg: "gray.200" }}
                                    px={4}
                                    borderRadius="md"
                                >
                                    Hồ sơ cá nhân
                                </MenuItem>
                                <MenuItem
                                    _hover={{ bg: "gray.200" }}
                                    borderRadius="md"
                                    color="red"
                                    px={4}
                                    onClick={logout}
                                >
                                    Đăng xuất
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex>
                ) : (
                    <Flex gap={1}>
                        <Button color="black" onClick={() => {
                            setIsLogin(true);
                            setIsForgotPassword(false);
                            onOpen();
                        }}>
                            Đăng nhập
                        </Button>
                        <Button colorScheme="blue" onClick={() => {
                            setIsLogin(false);
                            setIsForgotPassword(false);
                            onOpen();
                        }} leftIcon={<LockIcon />}>
                            Đăng ký
                        </Button>
                    </Flex>
                )}
            </Flex>

            <Modal
                size={getModalSize()}
                isOpen={isOpen}
                onClose={onClose}
                isCentered
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign="center">
                        {isForgotPassword
                            ? "Quên mật khẩu"
                            : isLogin
                                ? "Đăng nhập"
                                : "Đăng ký"
                        }
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody textAlign="center" p={5}>
                        {isForgotPassword ? (
                            <ForgotPassword onSuccess={handleForgotPasswordSuccess} />
                        ) : isLogin ? (
                            <Login
                                onSuccess={handleLoginSuccess}
                                onForgotPassword={handleForgotPasswordClick}
                            />
                        ) : (
                            <Register onSuccess={handleRegisterSuccess} />
                        )}

                        {!isForgotPassword && (
                            <Button variant="link" mt={3} onClick={handleToggle}>
                                {isLogin
                                    ? "Chưa có tài khoản? Đăng ký"
                                    : "Đã có tài khoản? Đăng nhập"}
                            </Button>
                        )}

                        <Divider my={3} />
                        {!isForgotPassword && (
                            <GoogleLoginButton
                                onSuccess={handleGoogleLoginSuccess}
                                onError={(error) => {
                                    console.error("Lỗi Google Login:", error);
                                    toast({
                                        title: "Lỗi đăng nhập Google",
                                        description: error?.message || "Đã xảy ra lỗi.",
                                        status: "error",
                                        duration: 3000,
                                        isClosable: true,
                                        position: "top",
                                        variant: "top-accent",
                                    });
                                }}
                            />
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default Auth;
