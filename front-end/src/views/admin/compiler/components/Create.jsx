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
    useColorMode,
} from "@chakra-ui/react";
import FlushedInput from "@/components/fields/InputField";
import { createItem } from "@/config/apiService";

export default function CreateCompilerModal({ isOpen, onClose, fetchData }) {
    const [compiler, setCompiler] = useState({
        compilerName: "",
        compilerPath: "",
        compilerOption: "",
        compilerExtension: "",
    });
    const [errors, setErrors] = useState({});
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const { colorMode } = useColorMode();
    const textColor = colorMode === 'light' ? 'black' : 'white';
    const boxColor = colorMode === 'light' ? 'gray.100' : 'whiteAlpha.100';

    useEffect(() => {
        if (isOpen) {
            setCompiler({
                compilerName: "",
                compilerPath: "",
                compilerOption: "",
                compilerExtension: "",
            });
            setErrors({});
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCompiler((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validate = () => {
        let newErrors = {};
        if (!compiler.compilerName) newErrors.compilerName = "Tên biên dịch không được bỏ trống";
        if (!compiler.compilerPath) newErrors.compilerPath = "Vui lòng chọn đường dẫn biên dịch";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setLoading(true);

        // Tạo FormData để gửi dữ liệu
        const formData = new FormData();
        formData.append("compilerName", compiler.compilerName);
        formData.append("compilerPath", compiler.compilerPath);
        formData.append("compilerOption", compiler.compilerOption);
        formData.append("compilerExtension", compiler.compilerExtension);

        try {

            await createItem({ controller: "Compiler", data: formData }); // Gửi FormData lên backend

            toast({
                title: 'Thêm mới biên dịch thành công!',
                status: 'success',
                duration: 2000,
                isClosable: true,
                position: 'top',
                variant: "left-accent",
            });

            if (fetchData) await fetchData();
            onClose();
        } catch (error) {
            toast({
                title: "Đã xảy ra lỗi.",
                description: error.message || "Có lỗi xảy ra khi tạo biên dịch.",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top",
                variant: "left-accent",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal size={'3xl'} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader fontSize={'25px'} textAlign={'center'}>Thêm mới biên dịch</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Grid templateColumns="repeat(2, 1fr)" gap="6">
                        <GridItem>
                            <FormControl isInvalid={errors.compilerName} mb={4}>
                                <FormLabel fontWeight="bold">Tên biên dịch<Text as="span" color="red.500"> *</Text></FormLabel>
                                <FlushedInput bg={boxColor} placeholder="Nhập tên biên dịch" name="compilerName" value={compiler.compilerName} onChange={handleChange} textColor={textColor} />
                                <FormErrorMessage>{errors.compilerName}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.compilerOption} mb={4}>
                                <FormLabel fontWeight="bold">Tùy chọn biên dịch</FormLabel>
                                <FlushedInput bg={boxColor} type="text" placeholder="Nhập tùy chọn biên dịch" name="compilerOption" value={compiler.compilerOption} onChange={handleChange} textColor={textColor} />
                                <FormErrorMessage>{errors.compilerOption}</FormErrorMessage>
                            </FormControl>

                        </GridItem>
                        <GridItem>
                            <FormControl isInvalid={errors.compilerPath} mb={4}>
                                <FormLabel fontWeight="bold">Đường dẫn biên dịch<Text as="span" color="red.500"> *</Text></FormLabel>
                                <FlushedInput bg={boxColor} placeholder="Nhập đường dẫn biên dịch" name="compilerPath" value={compiler.compilerPath} onChange={handleChange} textColor={textColor} />
                                <FormErrorMessage>{errors.compilerPath}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.compilerExtension} mb={4}>
                                <FormLabel fontWeight="bold">Phần mở rộng biên dịch</FormLabel>
                                <FlushedInput bg={boxColor} type="text" placeholder="Nhập phần mở rộng" name="compilerExtension" value={compiler.compilerExtension} onChange={handleChange} textColor={textColor} />
                                <FormErrorMessage>{errors.compilerExtension}</FormErrorMessage>
                            </FormControl>
                        </GridItem>
                    </Grid>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="gray" mr={3} onClick={onClose}>Hủy</Button>
                    <Button colorScheme="green" isLoading={loading} loadingText="Đang lưu..." onClick={handleSubmit}>Thêm</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
