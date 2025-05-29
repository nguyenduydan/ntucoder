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
    VStack,
    HStack,
    Text,
    IconButton,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
} from '@chakra-ui/react';
import { HiUpload, HiTrash, HiPlus } from 'react-icons/hi';
import api from '@/config/apiConfig';

export default function CreateTestCaseModal({
    isOpen, onClose, fetchData,
    problemID,
}) {
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [problemName, setProblemName] = useState('');

    const initialTestCase = useMemo(() => ({
        sampleTest: 0,
        preTest: 0,
        input: '',
        output: '',
    }), []);

    const [testCases, setTestCases] = useState([{ ...initialTestCase }]);

    useEffect(() => {
        if (!isOpen) {
            setTestCases([{ ...initialTestCase }]);
        }
    }, [isOpen, initialTestCase]);


    useEffect(() => {
        const fetchProblemName = async () => {
            try {
                const response = await api.get(`/Problem/${problemID}`);
                setProblemName(response.data.problemName || 'Unknown Problem');
            } catch (error) {
                console.error('Error fetching problem name:', error);
                setProblemName('Unknown Problem');
            }
        };

        if (problemID) {
            fetchProblemName();
        }
    }, [problemID]);

    const handleChange = (index, e) => {
        const updatedTestCases = [...testCases];
        updatedTestCases[index] = {
            ...updatedTestCases[index],
            [e.target.name]: e.target.value
        };
        setTestCases(updatedTestCases);
    };

    const handleToggleCheckbox = (index, field, checked) => {
        const updatedTestCases = [...testCases];
        updatedTestCases[index] = {
            ...updatedTestCases[index],
            [field]: checked ? 1 : 0,
        };
        setTestCases(updatedTestCases);
    };

    const handleFileUpload = (index, e, field) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const updatedTestCases = [...testCases];
                updatedTestCases[index] = {
                    ...updatedTestCases[index],
                    [field]: event.target.result,
                };
                setTestCases(updatedTestCases);
            };
            reader.readAsText(file);
        }
    };

    const addTestCase = () => {
        setTestCases([...testCases, { ...initialTestCase }]);
    };

    const removeTestCase = (index) => {
        if (testCases.length > 1) {
            const updatedTestCases = testCases.filter((_, i) => i !== index);
            setTestCases(updatedTestCases);
        }
    };

    const validateTestCases = () => {
        for (let i = 0; i < testCases.length; i++) {
            const testCase = testCases[i];
            if (!testCase.output) {
                toast({
                    title: 'Lỗi',
                    description: `TestCase ${i + 1}: Không được để trống Output.`,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                    position: "top",
                    variant: "left-accent",
                });
                return false;
            }
        }
        return true;
    };

    const handleCreateTestCases = async () => {
        if (!validateTestCases()) {
            return;
        }

        try {
            setLoading(true);

            // Gửi từng test case với testCaseOrder tự động
            const promises = testCases.map((testCase, index) =>
                api.post('/TestCase', {
                    ...testCase,
                    testCaseOrder: index + 1, // Tự động tính index + 1
                    problemID,
                })
            );

            const responses = await Promise.all(promises);

            // Kiểm tra tất cả response đều thành công
            const allSuccess = responses.every(response =>
                response.status === 200 || response.status === 201
            );

            if (allSuccess) {
                toast({
                    title: 'Thành công!',
                    description: `Đã thêm ${testCases.length} TestCase thành công!`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    position: 'top',
                    variant: "left-accent",
                });

                onClose();
                fetchData();
            } else {
                throw new Error('Một số TestCase không thể tạo được.');
            }
        } catch (error) {
            toast({
                title: "Đã xảy ra lỗi.",
                description: error.message || "Có lỗi xảy ra khi tạo TestCase.",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top",
                variant: "left-accent",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal size="4xl" isOpen={isOpen} onClose={onClose} isCentered scrollBehavior='inside'>
            <ModalOverlay />
            <ModalContent maxH="90vh">
                <ModalHeader>
                    <HStack justifyContent="center">
                        <Text>Thêm TestCase mới cho {problemName}</Text>
                        <Button
                            size="sm"
                            colorScheme="blue"
                            leftIcon={<HiPlus />}
                            onClick={addTestCase}
                        >
                            Thêm TestCase
                        </Button>
                    </HStack>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody overflowY="auto">
                    <Accordion allowMultiple defaultIndex={[0]}>
                        {testCases.map((testCase, index) => (
                            <AccordionItem key={index} border="1px" borderColor="gray.200" borderRadius="md" mb={3}>
                                <AccordionButton>
                                    <Box flex="1" textAlign="left">
                                        <HStack justifyContent="space-between">
                                            <VStack align="start" spacing={1}>
                                                <Text fontWeight="bold" fontSize="lg">
                                                    TestCase {index + 1}
                                                </Text>
                                                <Text fontSize="sm" color="gray.600">
                                                    {testCase.sampleTest === 1 && "Sample Test"}
                                                    {testCase.sampleTest === 1 && testCase.preTest === 1 && " • "}
                                                    {testCase.preTest === 1 && "Pre Test"}
                                                    {testCase.sampleTest === 0 && testCase.preTest === 0 && "Normal Test"}
                                                </Text>
                                            </VStack>
                                            {testCases.length > 1 && (
                                                <IconButton
                                                    size="sm"
                                                    colorScheme="red"
                                                    variant="ghost"
                                                    icon={<HiTrash />}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeTestCase(index);
                                                    }}
                                                    aria-label="Xóa TestCase"
                                                />
                                            )}
                                        </HStack>
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel pb={4}>
                                    <Grid templateColumns="3fr 1fr" gap={6}>
                                        <GridItem>
                                            <FormControl mb={4}>
                                                <FormLabel fontWeight="bold">Input</FormLabel>
                                                <Textarea
                                                    name="input"
                                                    placeholder="Nhập dữ liệu đầu vào (có thể để trống)"
                                                    value={testCase.input}
                                                    onChange={(e) => handleChange(index, e)}
                                                    minH="80px"
                                                />
                                                <Button
                                                    mt={2}
                                                    bg="gray.200"
                                                    borderRadius={3}
                                                    leftIcon={<HiUpload />}
                                                    as="label"
                                                    cursor="pointer"
                                                    size="sm"
                                                >
                                                    Import File
                                                    <VisuallyHiddenInput
                                                        type="file"
                                                        accept=".txt"
                                                        onChange={(e) => handleFileUpload(index, e, 'input')}
                                                    />
                                                </Button>
                                            </FormControl>
                                            <FormControl mb={4}>
                                                <FormLabel fontWeight="bold">
                                                    Output <Text as="span" color="red.500">*</Text>
                                                </FormLabel>
                                                <Textarea
                                                    name="output"
                                                    placeholder="Nhập dữ liệu đầu ra (bắt buộc)"
                                                    value={testCase.output}
                                                    onChange={(e) => handleChange(index, e)}
                                                    minH="80px"
                                                    borderColor={!testCase.output ? "red.300" : "gray.200"}
                                                />
                                                <Button
                                                    mt={2}
                                                    bg="gray.200"
                                                    borderRadius={3}
                                                    leftIcon={<HiUpload />}
                                                    as="label"
                                                    cursor="pointer"
                                                    size="sm"
                                                >
                                                    Import File
                                                    <VisuallyHiddenInput
                                                        type="file"
                                                        accept=".txt"
                                                        onChange={(e) => handleFileUpload(index, e, 'output')}
                                                    />
                                                </Button>
                                            </FormControl>
                                        </GridItem>
                                        <GridItem>
                                            <Text fontWeight="bold" mb={3}>Loại TestCase</Text>
                                            <VStack align="start" spacing={3}>
                                                <FormControl>
                                                    <Checkbox
                                                        isChecked={testCase.sampleTest === 1}
                                                        onChange={(e) =>
                                                            handleToggleCheckbox(index, 'sampleTest', e.target.checked)
                                                        }
                                                    >
                                                        Sample Test
                                                    </Checkbox>
                                                </FormControl>
                                                <FormControl>
                                                    <Checkbox
                                                        isChecked={testCase.preTest === 1}
                                                        onChange={(e) =>
                                                            handleToggleCheckbox(index, 'preTest', e.target.checked)
                                                        }
                                                    >
                                                        Pre Test
                                                    </Checkbox>
                                                </FormControl>
                                                <Box p={3} bg="gray.50" borderRadius="md" fontSize="sm">
                                                    <Text fontWeight="semibold" mb={1}>Thứ tự:</Text>
                                                    <Text color="blue.600">TestCase {index + 1}</Text>
                                                </Box>
                                            </VStack>
                                        </GridItem>
                                    </Grid>
                                </AccordionPanel>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </ModalBody>
                <ModalFooter>
                    <HStack>
                        <Text fontSize="sm" color="gray.600">
                            Tổng cộng: {testCases.length} TestCase
                        </Text>
                        <Button colorScheme="gray" mr={3} onClick={onClose}>
                            Hủy
                        </Button>
                        <Button
                            colorScheme="green"
                            isLoading={loading}
                            loadingText="Đang lưu..."
                            onClick={handleCreateTestCases}
                        >
                            Thêm tất cả
                        </Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
