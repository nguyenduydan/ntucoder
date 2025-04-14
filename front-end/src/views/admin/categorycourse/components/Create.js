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
    Select
} from "@chakra-ui/react";
import FlushedInput from "components/fields/InputField";
import { createItem } from "config/apiService";

export default function CreateCourseCategoryModal({ isOpen, onClose, fetchData }) {
    const [name, setName] = useState("");
    const [order, setOrder] = useState("");
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
            setOrder("");
            setErrors({});
        }
    }, [isOpen]);

    const validate = () => {
        const newErrors = {};
        if (!name.trim()) newErrors.name = "Tên loại khóa học không được để trống.";
        if (!order) newErrors.order = "Vui lòng chọn thứ tự.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            const data = { name, order: Number(order) };

            await createItem({
                controller: "CourseCategory",
                data: data,
            });
            toast({
                title: "Thêm mới thành công!",
                status: "success",
                duration: 2000,
                isClosable: true,
                position: "top",
                variant: "left-accent",
            });

            if (fetchData) await fetchData();
            setErrors({});
            onClose();
        } catch (error) {
            if (error.response && error.response.data.errors) {
                const errorMap = error.response.data.errors.reduce((acc, err) => {
                    if (err.includes("Tên loại khóa học")) acc.name = err;
                    if (err.includes("Thứ tự")) acc.order = err;
                    return acc;
                }, {});
                setErrors(errorMap);
            } else {
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
            setLoading(false);
        }
    };

    return (
        <Modal size={"2xl"} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader fontSize={"25px"} textAlign={"center"}>Thêm mới nhãn</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl isInvalid={!!errors.name} mb={4}>
                        <FormLabel fontWeight="bold">
                            Tên loại khóa học <Text as="span" color="red.500">*</Text>
                        </FormLabel>
                        <FlushedInput
                            bg={boxColor}
                            placeholder="Nhập tên nhãn"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            textColor={textColor}
                        />
                        <FormErrorMessage>{errors.name}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.order} mb={4}>
                        <FormLabel fontWeight="bold">
                            Thứ tự <Text as="span" color="red.500">*</Text>
                        </FormLabel>
                        <Select
                            bg={boxColor}
                            placeholder="Chọn thứ tự"
                            value={order}
                            onChange={(e) => setOrder(e.target.value)}
                            textColor={textColor}
                        >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </Select>
                        <FormErrorMessage>{errors.order}</FormErrorMessage>
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="gray" mr={3} onClick={onClose}>
                        Hủy
                    </Button>
                    <Button
                        colorScheme="green"
                        isLoading={loading}
                        loadingText="Đang lưu..."
                        onClick={handleSubmit}
                    >
                        Thêm
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
