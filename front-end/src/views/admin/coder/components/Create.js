import React, { useState, useEffect } from "react";
import {
    Button,
    FormControl,
    FormLabel,
    Text,
    useToast,
    FormErrorMessage,
    Grid,
    GridItem,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    InputGroup,
    InputRightElement,
    IconButton,
    Select,
    useColorMode,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import FlushedInput from "components/fields/InputField";
import { createItem } from "config/apiService";
import { parseBackendErrors } from "utils/utils";

export default function CreateCoderModal({ isOpen, onClose, fetchData }) {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // Trạng thái hiển thị mật khẩu
    const { colorMode } = useColorMode(); // Lấy trạng thái chế độ màu
    const textColor = colorMode === 'light' ? 'black' : 'white';
    const boxColor = colorMode === 'light' ? 'gray.100' : 'whiteAlpha.100';
    const [userName, setUserName] = useState('');
    const [coderName, setCoderName] = useState('');
    const [coderEmail, setCoderEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [roleID, setRoleID] = useState('');
    const [errors, setErrors] = useState({});
    const toast = useToast();

    useEffect(() => {
        if (isOpen) {
            setCoderEmail("");
            setCoderName("");
            setPassword("");
            setPhoneNumber("");
            setUserName("");
            setErrors({});
        }
    }, [isOpen]);

    const handleClickReveal = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async () => {
        setErrors({});
        const inputs = {
            userName,
            coderName,
            coderEmail,
            phoneNumber,
            password,
            role: Number(roleID), // Ép roleID thành số
        };

        const newErrors = {};
        Object.keys(inputs).forEach((key) => {
            if (typeof inputs[key] === 'string' && !inputs[key].trim()) {
                newErrors[key] = 'Không được bỏ trống.';
            } else if (inputs[key] === null || inputs[key] === undefined) {
                newErrors[key] = 'Không được bỏ trống.';
            }
        });

        // Kiểm tra email hợp lệ
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (coderEmail && !emailRegex.test(coderEmail)) {
            newErrors.coderEmail = 'Email không hợp lệ.';
        }

        // Kiểm tra họ và tên (không chứa số)
        const nameRegex = /^[^\d]+$/;
        if (coderName && !nameRegex.test(coderName)) {
            newErrors.coderName = 'Họ và tên không được chứa số.';
        }

        // Kiểm tra số điện thoại (phải có đúng 10 chữ số)
        const phoneRegex = /^\d{10}$/;
        if (phoneNumber && !phoneRegex.test(phoneNumber)) {
            newErrors.phoneNumber = 'Số điện thoại phải có đúng 10 chữ số.';
        }

        // Kiểm tra độ dài mật khẩu
        if (password && password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự.';
        }

        // Kiểm tra roleID
        if (!roleID || isNaN(roleID)) {
            newErrors.roleID = 'Vui lòng chọn vai trò.';
        }

        // Nếu có lỗi, hiển thị và dừng lại
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await createItem({
                controller: 'Coder',
                data: inputs,
            });
            setLoading(true);
            if (fetchData) await fetchData(); // Cập nhật dữ liệu
            setErrors({});
            onClose(); // Đóng modal
            toast({
                title: 'Thêm mới thành công!',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top',
                variant: "top-accent"
            });
        } catch (error) {
            console.error('Lỗi API:', error.response ? error.response.data : error);
            const backendMessages = parseBackendErrors(error?.response?.data || {});
            if (backendMessages.length > 0) {
                backendMessages.forEach((msg) =>
                    toast({
                        title: msg,
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                        position: "top",
                        variant: "left-accent",
                    })
                );
            } else {
                toast({
                    title: "Đã xảy ra lỗi không xác định.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position: "top",
                    variant: "left-accent",
                });
            }
            setLoading(false);
        }
    };


    return (
        <Modal size={'4xl'} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader fontSize={"25px"} textAlign={'center'} > Thêm mới người dùng </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Grid templateColumns="repeat(2, 1fr)" gap="6">
                        <GridItem>
                            <FormControl isInvalid={errors.coderName} mb={4}>
                                <FormLabel fontWeight="bold">Họ và tên<Text as="span" color="red.500"> *</Text></FormLabel>
                                <FlushedInput
                                    bg={boxColor}
                                    placeholder="Nhập họ và tên"
                                    value={coderName}
                                    onChange={(e) => setCoderName(e.target.value)}
                                    textColor={textColor}
                                />
                                <FormErrorMessage>{errors.coderName}</FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={errors.userName} mb={4}>
                                <FormLabel fontWeight="bold">Tên đăng nhập<Text as="span" color="red.500"> *</Text></FormLabel>
                                <FlushedInput
                                    bg={boxColor}
                                    placeholder="Nhập tên đăng nhập"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    textColor={textColor}
                                />
                                <FormErrorMessage>{errors.userName}</FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={!!errors.password}>
                                <FormLabel fontWeight="bold">
                                    Mật khẩu<Text as="span" color="red.500"> *</Text>
                                </FormLabel>
                                <InputGroup>
                                    <FlushedInput
                                        bg={boxColor}
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
                                <FormErrorMessage>{errors.password}</FormErrorMessage>
                            </FormControl>
                        </GridItem>

                        <GridItem>
                            <FormControl isInvalid={errors.coderEmail} mb={4}>
                                <FormLabel fontWeight="bold">Email<Text as="span" color="red.500"> *</Text></FormLabel>
                                <FlushedInput
                                    bg={boxColor}
                                    type="email"
                                    placeholder="Nhập email"
                                    value={coderEmail}
                                    onChange={(e) => setCoderEmail(e.target.value)}
                                    textColor={textColor}
                                />
                                <FormErrorMessage>{errors.coderEmail}</FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={errors.phoneNumber} mb={4}>
                                <FormLabel fontWeight="bold">Số điện thoại</FormLabel>
                                <FlushedInput
                                    bg={boxColor}
                                    type="tel"
                                    placeholder="Nhập số điện thoại"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    textColor={textColor}
                                />
                                <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.roleID} mb={4}>
                                <FormLabel fontWeight="bold">
                                    Vai trò
                                    <Text as="span" color="red.500">
                                        {' '}
                                        *
                                    </Text>
                                </FormLabel>
                                <Select
                                    placeholder="Chọn vai trò"
                                    value={roleID}
                                    onChange={(e) => setRoleID(e.target.value)}
                                >
                                    <option value="1">Admin</option>
                                    <option value="2">User</option>
                                    <option value="3">Manager</option>
                                </Select>
                                <FormErrorMessage>{errors.roleID}</FormErrorMessage>
                            </FormControl>
                        </GridItem>
                    </Grid>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="gray" mr={3} onClick={onClose}>
                        Hủy
                    </Button>
                    <Button
                        colorScheme="green"
                        isLoading={loading}  // Hiển thị trạng thái loading
                        loadingText="Đang lưu..."
                        onClick={handleSubmit}
                        justifyContent="center"
                        alignItems="center"
                    >
                        Thêm
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
