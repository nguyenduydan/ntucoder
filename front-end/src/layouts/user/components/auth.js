import React, { useEffect, useState } from "react";
import {
    Box,
    Flex,
    Button,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    InputGroup,
    FormControl,
    FormLabel,
    InputRightElement,
    IconButton,
    Menu, MenuButton, MenuList, MenuItem, Avatar
} from "@chakra-ui/react";
import { LockIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { MdAdminPanelSettings } from "react-icons/md";
import FlushedInput from "../../../components/fields/InputField";
import { NavLink } from "react-router-dom";

const Auth = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLogin, setIsLogin] = useState(true);
    const [password, setPassword] = useState("");
    const [repassword, setRepassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [isOnline, setIsOnline] = useState(false);
    const [user, setUser] = useState({ name: "Người dùng", role: "admin" });

    const handleToggle = () => {
        setIsLogin(!isLogin);
    };

    const handleClickReveal = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        if (isOpen) {
            setPassword("");
            setRepassword("");
        }
    }, [isOpen]);  // Chạy lại khi isOpen thay đổi


    return (
        <Box bg="transparent">
            <Flex justifyContent="flex-end" gap={4}>
                {isOnline ? (
                    <Flex alignItems="center">
                        {user.role === "admin" && <NavLink to={`/admin/dashboard`} >
                            <Button
                                leftIcon={<MdAdminPanelSettings />}
                                boxShadow="sm"
                                variant="outline"
                                _hover={{
                                    border: "1px solid blue",
                                }}
                                transition="all .2s ease-in-out"
                                _active={{ transform: "scale(0.90)" }}
                            >
                                Trang quản trị
                            </Button>
                        </NavLink>}
                        <Menu>
                            <MenuButton as={Button} variant="none">
                                <Avatar size="sm" name={user.name} />
                            </MenuButton>
                            <MenuList>
                                <MenuItem onClick={() => alert("Trang cá nhân")}>Hồ sơ</MenuItem>
                                <MenuItem onClick={() => setIsOnline(false)}>Đăng xuất</MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex>
                ) : (
                    <Flex gap="1">
                        <Button color="black" onClick={() => { setIsLogin(true); onOpen(); }} variant='solid'>
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
                        <Flex direction="column" px="10px" py="15px">
                            <FormControl>
                                <FormLabel fontWeight="bold">Email</FormLabel>
                                <FlushedInput type="email" placeholder="Nhập email" />
                            </FormControl>
                            <FormControl mt={4}>
                                <FormLabel fontWeight="bold">Mật khẩu</FormLabel>
                                <InputGroup>
                                    <FlushedInput
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Nhập mật khẩu"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <InputRightElement>
                                        <IconButton
                                            variant="link"
                                            icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                            onClick={handleClickReveal}
                                        />
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>
                            {!isLogin && (
                                <FormControl mt={4}>
                                    <FormLabel fontWeight="bold">Xác nhận mật khẩu</FormLabel>
                                    <FlushedInput
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Xác nhận mật khẩu"
                                        value={repassword}
                                        onChange={(e) => setRepassword(e.target.value)}
                                    />
                                </FormControl>
                            )}
                            <Button colorScheme="blue" width="full" mt={4}>
                                {isLogin ? "Đăng nhập" : "Đăng ký"}
                            </Button>
                            <Button variant="link" mt={5} onClick={handleToggle}>
                                {isLogin ? "Chưa có tài khoản? Đăng ký" : "Đã có tài khoản? Đăng nhập"}
                            </Button>
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default Auth;
