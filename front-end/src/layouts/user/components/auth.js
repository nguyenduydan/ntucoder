import { useState } from "react";
import {
    Box, Flex, Button, useDisclosure, Modal, ModalOverlay,
    ModalContent, ModalHeader, ModalBody, ModalCloseButton,
    Menu, MenuButton, MenuList, MenuItem, Avatar
} from "@chakra-ui/react";
import { LockIcon } from "@chakra-ui/icons";
import { MdAdminPanelSettings } from "react-icons/md";
import { NavLink } from "react-router-dom";
import Login from "../../auth/authUser/login";
import Register from "../../auth/authUser/register";
import { useAuth } from "contexts/AuthContext";

const Auth = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLogin, setIsLogin] = useState(true);
    const { coder, setCoder, logout, isLoading } = useAuth();

    const handleToggle = () => setIsLogin(!isLogin);

    const handleLoginSuccess = (userData) => {
        if (userData) {
            setCoder(userData);
            onClose();
        }
    };

    if (isLoading) {
        return <Box textAlign="center" mt={4}>Đang kiểm tra đăng nhập...</Box>;
    }

    const isOnline = Boolean(coder);

    return (
        <Box bg="transparent">
            <Flex justifyContent="flex-end" gap={4}>
                {isOnline ? (
                    <Flex alignItems="center">
                        {coder.roleID === 1 && (
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
                                <Avatar size="sm" name={coder.coderName} />
                            </MenuButton>
                            <MenuList>
                                <MenuItem>Hồ sơ</MenuItem>
                                <MenuItem onClick={logout}>Đăng xuất</MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex>
                ) : (
                    <Flex gap={1}>
                        <Button color="black" onClick={() => { setIsLogin(true); onOpen(); }}>
                            Đăng nhập
                        </Button>
                        <Button colorScheme="blue" onClick={() => { setIsLogin(false); onOpen(); }} leftIcon={<LockIcon />}>
                            Đăng ký
                        </Button>
                    </Flex>
                )}
            </Flex>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign="center">
                        {isLogin ? "Đăng nhập" : "Đăng ký"}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {isLogin ? (
                            <Login onSuccess={handleLoginSuccess} />
                        ) : (
                            <Register />
                        )}
                        <Button variant="link" mt={5} onClick={handleToggle}>
                            {isLogin ? "Chưa có tài khoản? Đăng ký" : "Đã có tài khoản? Đăng nhập"}
                        </Button>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default Auth;
