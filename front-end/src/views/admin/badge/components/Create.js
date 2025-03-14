import React, { useState, useEffect } from "react";
import {
    Button,
    FormControl,
    FormLabel,
    Text,
    useToast,
    FormErrorMessage,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    useColorMode,
    Textarea,
    Grid,
    Input
} from "@chakra-ui/react";
import FlushedInput from "components/fields/InputField";
import { create } from "config/badgeService";

export default function CreateCoderModal({ isOpen, onClose, fetchData }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState("");
    const [errors, setErrors] = useState({});
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    const { colorMode } = useColorMode(); // Lấy trạng thái chế độ màu
    const textColor = colorMode === 'light' ? 'black' : 'white';
    const boxColor = colorMode === 'light' ? 'gray.100' : 'whiteAlpha.100';


    // Reset lại input khi modal mở
    useEffect(() => {
        if (isOpen) {
            setName("");
            setDescription("");
            setColor("");
            setErrors({});
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        setLoading(true); // Bật trạng thái loading khi gửi yêu cầu
        try {
            // Gửi yêu cầu tạo mới người dùng
            const data = {
                name,
                description,
                color
            };

            await create(data); // Gọi service
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
                    if (err.includes("Tên nhãn")) acc.name = err;
                    if (err.includes("Mô tả")) acc.description = err;
                    if (err.includes("Mã màu")) acc.color = err;
                    return acc;
                }, {});
                setErrors(errorMap);
            } else {
                // Hiển thị thông báo lỗi chung nếu không có lỗi chi tiết
                toast({
                    title: "Đã xảy ra lỗi.",
                    description: error.message || "Có lỗi xảy ra khi tạo nhãn.",
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
        <Modal size={'2xl'} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader fontSize={"25px"} textAlign={'center'} > Thêm mới nhãn </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl isInvalid={errors.name} mb={4}>
                        <FormLabel fontWeight="bold">Tên nhãn<Text as="span" color="red.500"> *</Text></FormLabel>
                        <FlushedInput
                            bg={boxColor}
                            placeholder="Nhập tên nhãn"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            textColor={textColor}
                        />
                        <FormErrorMessage>{errors.name}</FormErrorMessage>
                    </FormControl>

                    <FormControl mb={4}>
                        <FormLabel fontWeight="bold">Mã màu</FormLabel>
                        <Grid templateColumns="1fr auto auto" gap={4} alignItems="center">
                            {/* Ô nhập mã màu */}
                            <FlushedInput
                                bg={boxColor}
                                placeholder="Nhập mã màu (VD: #ff0000)"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                textColor={color}
                            />
                            {/* Bộ chọn màu */}
                            <Input
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                w="40px"
                                h="40px"
                                p={0}
                                border="none"
                                borderRadius="md"
                                cursor="pointer"
                            />
                        </Grid>
                    </FormControl>

                    <FormControl mb={4}>
                        <FormLabel fontWeight="bold">Mô tả</FormLabel>
                        <Textarea
                            bg={boxColor}
                            placeholder="Nhập mô tả"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            textColor={textColor}
                        />
                    </FormControl>
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
