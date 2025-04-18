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
    useColorMode,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import FlushedInput from "components/fields/InputField";
import { createItem } from "config/apiService";

export default function CreateCoderModal({ isOpen, onClose, fetchData }) {
    const [userName, setUserName] = useState("");
    const [coderName, setCoderName] = useState("");
    const [coderEmail, setCoderEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // Trạng thái hiển thị mật khẩu

    const { colorMode } = useColorMode(); // Lấy trạng thái chế độ màu
    const textColor = colorMode === 'light' ? 'black' : 'white';
    const boxColor = colorMode === 'light' ? 'gray.100' : 'whiteAlpha.100';


    // Reset lại input khi modal mở
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

    // Hàm để chuyển đổi giữa ẩn và hiện mật khẩu
    const handleClickReveal = () => {
        setShowPassword(!showPassword);
    };
    const handleSubmit = async () => {
        setLoading(true); // Bật trạng thái loading khi gửi yêu cầu
        try {
            // Gửi yêu cầu tạo mới người dùng
            const data = {
                userName,
                coderName,
                coderEmail,
                phoneNumber,
                password,
            };

            await createItem({ controller: "Coder", data: data }); // Gọi service
            // Hiển thị thông báo thành công
            toast({
                title: 'Thêm mới thành công!',
                status: 'success',
                duration: 2000,
                isClosable: true,
                position: 'top',
                variant: 'left-accent',
            });

            if (fetchData) await fetchData(); // Cập nhật dữ liệu
            setErrors({});
            onClose(); // Đóng modal
        } catch (error) {
            if (error.response && error.response.data.errors) {
                // Xử lý lỗi trả về dưới dạng mảng các thông báo lỗi
                const errorMap = error.response.data.errors.reduce((acc, err) => {
                    if (err.includes("Tên đăng nhập")) acc.userName = err;
                    if (err.includes("Họ và tên")) acc.coderName = err;
                    if (err.includes("Email")) acc.coderEmail = err;
                    if (err.includes("Số điện thoại")) acc.phoneNumber = err;
                    if (err.includes("Mật khẩu")) acc.password = err;
                    return acc;
                }, {});
                setErrors(errorMap);
            } else {
                // Hiển thị thông báo lỗi chung nếu không có lỗi chi tiết
                toast({
                    title: "Đã xảy ra lỗi.",
                    description: error.message || "Có lỗi xảy ra khi tạo người dùng.",
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                    position: "top",
                    variant: "left-accent",
                });
            }
        } finally {
            setLoading(false); // Tắt trạng thái loading sau khi hoàn thành
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

                            <FormControl isInvalid={errors.password}>
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
