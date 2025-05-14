import { useState } from "react";
import {
    Box, Flex, Button, useDisclosure, Modal, ModalOverlay,
    ModalContent, ModalHeader, ModalBody, ModalCloseButton,
    Menu, MenuButton, MenuList, MenuItem
} from "@chakra-ui/react";
import { LockIcon } from "@chakra-ui/icons";
import { MdAdminPanelSettings } from "react-icons/md";
import { NavLink } from "react-router-dom";
import Login from "../../auth/authUser/login";
import Register from "../../auth/authUser/register";
import { useAuth } from "contexts/AuthContext";
import AvatarLoadest from "components/fields/Avatar";

const Auth = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLogin, setIsLogin] = useState(true);
    const { coder, setCoder, logout } = useAuth();

    const handleToggle = () => setIsLogin(!isLogin);

    const handleLoginSuccess = (userData) => {
        if (userData) {
            setCoder(userData);
            onClose();
        }
    };
    const handleRegisterSuccess = () => {
        setIsLogin(true);  // Chuyển qua chế độ đăng nhập
        onOpen();  // Mở modal
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
                                <AvatarLoadest size="sm" src={coder.avatar || null} name={coder.coderName || 'coder'} alt="avatar" />
                            </MenuButton>
                            <MenuList p={2}>
                                <MenuItem
                                    as={NavLink}
                                    to="/profile"
                                    _hover={{ bg: "gray.200" }}
                                    px={4}
                                    borderRadius="md"
                                >
                                    Hồ sơ
                                </MenuItem>
                                <MenuItem _hover={{ bg: "gray.200", }} borderRadius="md" color="red" px={4} onClick={logout}>
                                    Đăng xuất
                                </MenuItem>
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

            <Modal isOpen={isOpen} onClose={onClose} size={isLogin ? "md" : "2xl"}>
                <ModalOverlay />
                <ModalContent >
                    <ModalHeader textAlign="center">
                        {isLogin ? "Đăng nhập" : "Đăng ký"}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody textAlign={"center"} p={5}>
                        {isLogin ? (
                            <Login onSuccess={handleLoginSuccess} />
                        ) : (
                            <Register onSuccess={handleRegisterSuccess} />
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
