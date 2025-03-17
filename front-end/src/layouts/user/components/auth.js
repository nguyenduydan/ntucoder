import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { LockIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import FlushedInput from "../../../components/fields/InputField";

const Auth = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLogin, setIsLogin] = useState(true);
    const [password, setPassword] = useState("");
    const [repassword, setRepassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleToggle = () => {
        setIsLogin(!isLogin);
    };

    const handleClickReveal = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Box bg="transparent">
            <Flex justifyContent="flex-end" gap={4}>
                <Button color="black" onClick={() => { setIsLogin(true); onOpen(); }} variant='solid'>
                    Đăng nhập
                </Button>
                <Button colorScheme="blue" onClick={() => { setIsLogin(false); onOpen(); }} leftIcon={<LockIcon />}>
                    Đăng ký
                </Button>
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
                                <FormLabel>Email</FormLabel>
                                <FlushedInput type="email" placeholder="Nhập email" />
                            </FormControl>
                            <FormControl mt={4}>
                                <FormLabel>Mật khẩu</FormLabel>
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
                                    <FormLabel>Xác nhận mật khẩu</FormLabel>
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
