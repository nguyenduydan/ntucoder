import React, { useEffect, useMemo, useState } from 'react';
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Input,
    Checkbox,
    FormLabel,
    useToast,
    VisuallyHiddenInput,
    Textarea,
    FormControl,
    Grid,
    GridItem,
} from '@chakra-ui/react';
import { HiUpload } from 'react-icons/hi';
import api from 'config/apiConfig';

export default function CreateTestCaseModal({
    isOpen, onClose, fetchData,
    problemID,
}) {
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const initialState = useMemo(() => ({
        testCaseOrder: '',
        sampleTest: 0,
        preTest: 0,
        input: '',
        output: '',
    }), []);
    const [newTestCase, setNewTestCase] = useState(initialState);

    useEffect(() => {
        if (!isOpen) {
            setNewTestCase(initialState);
        }
    }, [isOpen, initialState]);

    const handleChange = (e) => {
        setNewTestCase({ ...newTestCase, [e.target.name]: e.target.value });
    };

    const handleToggleCheckbox = (field, checked) => {
        setNewTestCase((prev) => ({
            ...prev,
            [field]: checked ? 1 : 0,
        }));
    };

    const handleFileUpload = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setNewTestCase((prev) => ({
                    ...prev,
                    [field]: event.target.result,
                }));
            };
            reader.readAsText(file);
        }
    };

    const handleCreateTestCase = async () => {
        if (!newTestCase.testCaseOrder || !newTestCase.output) {
            toast({
                title: 'Lỗi',
                description: 'Không được để trống.',
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: "top",
                variant: "left-accent",
            });
            return;
        }
        if (
            isNaN(newTestCase.testCaseOrder) ||
            parseInt(newTestCase.testCaseOrder) <= 0
        ) {
            toast({
                title: 'Lỗi',
                description: 'TestCase Order phải là số nguyên lớn hơn 0.',
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: "top",
                variant: "left-accent",
            });
            return;
        }

        try {
            setLoading(true);
            const response = await api.post('/TestCase', {
                ...newTestCase,
                problemID,
            });

            if (response.status === 200 || response.status === 201) {
                toast({
                    title: 'Thêm mới bài toán thành công!',
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                    position: 'top',
                    variant: "left-accent",
                });

                onClose();
                fetchData();
            } else {
                throw new Error('Có lỗi xảy ra khi thêm mới.');
            }
        } catch (error) {
            toast({
                title: "Đã xảy ra lỗi.",
                description: error.message || "Có lỗi xảy ra khi tạo bài toán.",
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
        <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    Thêm TestCase mới
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Grid templateColumns="3fr 1fr" gap={10}>
                        <GridItem >
                            <FormControl mb={4}>
                                <FormLabel fontWeight="bold">TestCase Order</FormLabel>
                                <Input
                                    name="testCaseOrder"
                                    placeholder="Nhập thứ tự TestCase"
                                    value={newTestCase.testCaseOrder}
                                    onChange={handleChange}
                                />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel fontWeight="bold">Input</FormLabel>
                                <Textarea
                                    name="input"
                                    placeholder="Nhập dữ liệu đầu vào"
                                    value={newTestCase.input}
                                    onChange={handleChange}
                                    h="50px"
                                />
                                <Button
                                    mt={2}
                                    bg="gray.200"
                                    borderRadius={3}
                                    leftIcon={<HiUpload />}
                                    as="label"
                                    cursor="pointer"
                                >
                                    Import File
                                    <VisuallyHiddenInput
                                        type="file"
                                        accept=".txt"
                                        onChange={(e) => handleFileUpload(e, 'input')}
                                    />
                                </Button>
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel fontWeight="bold">Output</FormLabel>
                                <Textarea
                                    name="output"
                                    placeholder="Nhập dữ liệu đầu ra"
                                    value={newTestCase.output}
                                    onChange={handleChange}
                                />
                                <Button
                                    mt={2}
                                    bg="gray.200"
                                    borderRadius={3}
                                    leftIcon={<HiUpload />}
                                    as="label"
                                    cursor="pointer"
                                >
                                    Import File
                                    <VisuallyHiddenInput
                                        type="file"
                                        accept=".txt"
                                        onChange={(e) => handleFileUpload(e, 'output')}
                                    />
                                </Button>
                            </FormControl>
                        </GridItem>
                        <GridItem mt={5}>
                            <FormControl mb={2} fontWeight="bold">
                                <Checkbox
                                    isChecked={newTestCase.sampleTest === 1}
                                    onChange={(e) =>
                                        handleToggleCheckbox('sampleTest', e.target.checked)
                                    }
                                >
                                    Sample Test
                                </Checkbox>
                            </FormControl>
                            <FormControl fontWeight="bold">
                                <Checkbox
                                    isChecked={newTestCase.preTest === 1}
                                    onChange={(e) =>
                                        handleToggleCheckbox('preTest', e.target.checked)
                                    }
                                >
                                    Pre Test
                                </Checkbox>
                            </FormControl>
                        </GridItem>
                    </Grid>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="gray" mr={3} onClick={onClose}>Hủy</Button>
                    <Button colorScheme="green" isLoading={loading} loadingText="Đang lưu..." onClick={handleCreateTestCase}>Thêm</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
