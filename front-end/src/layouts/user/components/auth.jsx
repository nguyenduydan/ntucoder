import { useState } from "react";
import {
    Box, Flex, Button, useDisclosure, Modal, ModalOverlay,
    ModalContent, ModalHeader, ModalBody, ModalCloseButton,
    Menu, MenuButton, MenuList, MenuItem, Divider,
} from "@chakra-ui/react";
import { LockIcon } from "@chakra-ui/icons";
import { MdAdminPanelSettings } from "react-icons/md";
import { NavLink } from "react-router-dom";
import Login from "../../auth/login";
import Register from "../../auth/register";
import ForgotPassword from "@/layouts/auth/ForgetPassword";
import { useAuth } from "@/contexts/AuthContext";
import AvatarLoadest from "@/components/fields/Avatar";
import GoogleLoginButton from "layouts/auth/GoogleButtonLogin";
import api from "@/config/apiConfig";
import { useToast } from "@chakra-ui/react";

const Auth = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLogin, setIsLogin] = useState(true);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const { coder, setCoder, logout, loginSuccessHandler } = useAuth();
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const toast = useToast();

    const handleToggle = () => {
        setIsForgotPassword(false);
        setIsLogin(!isLogin);
    };

    const handleLoginSuccess = (userData) => {
        if (userData) {
            setCoder(userData);
            setIsForgotPassword(false);
            onClose();
            loginSuccessHandler();
        }
    };

    const handleRegisterSuccess = () => {
        setIsLogin(true);
        setIsForgotPassword(false);
        onOpen();
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

    const handleGoogleLoginSuccess = async (response) => {
        setIsGoogleLoading(true);
        try {
            const googleToken = response.credential;
            const res = await api.post("/auth/google-login", { token: googleToken }, {
                withCredentials: true
            });

            const data = res.data;

            if (data?.token) {
                setCoder({
                    accountID: data.AccountID,
                    roleID: data.RoleID,
                    coderName: data.CoderName,
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
                console.error("Đăng nhập thất bại: Không có token trả về.");
            }
        } catch (error) {
            console.error("Lỗi khi đăng nhập Google:", error.response?.data || error.message);
        } finally {
            setIsGoogleLoading(false);
        }
    };

    const isOnline = Boolean(coder);

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
                                <AvatarLoadest
                                    size="sm"
                                    src={coder.avatar || null}
                                    name={coder.coderName || 'coder'}
                                    alt="avatar"
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
                            <Button variant="link" mt={5} onClick={handleToggle}>
                                {isLogin
                                    ? "Chưa có tài khoản? Đăng ký"
                                    : "Đã có tài khoản? Đăng nhập"}
                            </Button>
                        )}

                        <Divider my={5} />
                        <GoogleLoginButton
                            onSuccess={handleGoogleLoginSuccess}
                            isLoading={isGoogleLoading}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default Auth;
