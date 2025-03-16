import React, { useState } from "react";
import {
    Box,
    Flex,
    Button,
    Icon,
    useColorModeValue,
    useColorMode,
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
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import { LockIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import FlushedInput from "../../../components/fields/InputField";
import { FaGoogle } from "react-icons/fa";

const Header = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const navbarIcon = useColorModeValue('navy', 'white');
    const textColor = useColorModeValue('gray.600', 'white');
    const loginBtn = useColorModeValue('navy.300', 'navy.200');
    const textBtn = useColorModeValue('white', 'black');
    // State
    const [password, setPassword] = useState("");
    const [repassword, setRepassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // Trạng thái hiển thị mật khẩu

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLogin, setIsLogin] = useState(true);

    // kiểm tra trạng thái đăng nhập hoặc đăng ký
    const handleToggle = () => {
        setIsLogin(!isLogin);
    };

    // Hàm để chuyển đổi giữa ẩn và hiện mật khẩu
    const handleClickReveal = () => {
        setShowPassword(!showPassword);
    };
    return (
        <Box
            bg="transparent"
            color="white"
            py={2} px={4}
            w={{ lg: "calc(100% - 560px)", md: "100%" }}
            mx={{ lg: "auto", md: "0" }}
        >
            <Box display="flex"
                align="center"
                justifyContent={{ base: "center", md: "space-between" }}
                flexDirection={{ base: "column", md: "row" }}
                px={4}>
                <Box
                    fontWeight="bold"
                    textAlign="center"
                    fontFamily="revert-layer"
                    display={{ base: "none", lg: "block" }}
                    textTransform="uppercase"
                    fontSize='25px'
                    color={navbarIcon}
                    mb={{ base: 2, md: 0 }}>
                    Nha Trang University
                </Box>
                <Flex gap={4} alignItems="center" justify="flex-end" minW="300px">
                    <Button
                        onClick={onOpen}
                        variant='solid'
                        textColor={textColor}
                        textTransform="uppercase"
                    >
                        Đăng nhập
                    </Button>
                    <Button href="#" textTransform="uppercase" leftIcon={<LockIcon mb={1} />} onClick={() => { setIsLogin(false); onOpen(); }} bg={loginBtn}
                        color={textBtn}
                        _hover={{ bg: 'navy.400', transform: 'scale(1.05)' }}>
                        Đăng ký
                    </Button>

                    <Modal isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader textTransform="uppercase" textAlign="center" >{isLogin ? "Đăng nhập" : "Đăng ký"}</ModalHeader>
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
                                                type={showPassword ? "text" : "password"} // Chuyển đổi giữa text và password
                                                placeholder="Nhập mật khẩu"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                textColor={textColor}
                                                w="100%"
                                            />
                                            <InputRightElement>
                                                <IconButton
                                                    variant="link"
                                                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
                                                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                                    onClick={handleClickReveal}
                                                />
                                            </InputRightElement>
                                        </InputGroup>
                                    </FormControl>
                                    {!isLogin && (
                                        <FormControl mt={4}>
                                            <FormLabel>Xác nhận mật khẩu</FormLabel>
                                            <InputGroup>
                                                <FlushedInput
                                                    type={showPassword ? "text" : "password"} // Chuyển đổi giữa text và password
                                                    placeholder="Xác nhận mật khẩu"
                                                    value={repassword}
                                                    onChange={(e) => setRepassword(e.target.value)}
                                                    textColor={textColor}
                                                    w="100%"
                                                />
                                            </InputGroup>
                                        </FormControl>
                                    )}
                                    <Button colorScheme="blue" width="full" mt={4} fontSize={18}>
                                        {isLogin ? "Đăng nhập" : "Đăng ký"}
                                    </Button>
                                    <Button variant="link" mt={5} onClick={handleToggle}>
                                        {isLogin ? "Chưa có tài khoản? Đăng ký" : "Đã có tài khoản? Đăng nhập"}
                                    </Button>
                                    <Box
                                        align="center"
                                        h='2px'
                                        my={5}
                                        borderBottomWidth='2px'
                                        borderColor='black'
                                        borderRadius={"md"}
                                    ></Box>
                                    {/* nút đang nhập google */}
                                    <Button
                                        rightIcon={<FaGoogle />}
                                        colorScheme="red"
                                        variant="outline"
                                        onClick={() => {
                                            // Xử lý đăng nhập Google
                                            console.log("Đăng nhập với Google");
                                        }}
                                        fontSize={18}
                                    >
                                        Đăng nhập với Google
                                    </Button>
                                </Flex>
                            </ModalBody>
                        </ModalContent>
                    </Modal>

                    <Button
                        variant="outline"
                        colorScheme='teal'
                        p="10px"
                        h="100%"
                        w="15%"
                        ms="10px"
                        boxShadow="md"
                        onClick={toggleColorMode}
                    >
                        <Icon
                            h="18px"
                            w="18px"
                            color={navbarIcon}
                            as={colorMode === 'light' ? IoMdMoon : IoMdSunny}
                        />
                    </Button>
                </Flex>
            </Box>
        </Box >
    );
};

export default Header;
