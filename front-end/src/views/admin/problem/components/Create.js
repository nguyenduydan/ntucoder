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
    Select,
    useColorMode,
    Textarea,
    SimpleGrid,
    Checkbox
} from "@chakra-ui/react";
import FlushedInput from "components/fields/InputField";
import { createItem, getList } from "config/apiService";

export default function CreateProblemModal({ isOpen, onClose, fetchData }) {
    const [problem, setProblem] = useState({
        problemCode: "",
        problemName: "",
        coderId: 1,
        timeLimit: "1.00",
        memoryLimit: "128",
        testType: "Output Matching",
        testCompilerID: "",
        note: "",
        selectedCategoryIDs: [],
        testCode: "",
        problemContent: "",
        problemExplanation: "",
        published: 0,
    });
    const [categories, setCategories] = useState([]);
    const [compilers, setCompilers] = useState([]);
    const [errors, setErrors] = useState({});
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const { colorMode } = useColorMode();
    const textColor = colorMode === 'light' ? 'black' : 'white';
    const boxColor = colorMode === 'light' ? 'gray.100' : 'whiteAlpha.100';

    useEffect(() => {
        if (isOpen) {
            setProblem({
                problemCode: "",
                coderId: 1,
                problemName: "",
                timeLimit: "1.00",
                memoryLimit: "128",
                testType: "Output Matching",
                testCompilerID: "",
                note: "",
                selectedCategoryIDs: [],
                testCode: "",
                problemContent: "",
                problemExplanation: "",
                published: 0,
            });
            setErrors({});
            fetchList(); // Gọi hàm lấy danh mục khi modal mở
        }
    }, [isOpen]);

    const fetchList = async () => {
        try {
            const category = await getList({ controller: "Category", page: 1, pageSize: 10 });
            const compiler = await getList({ controller: "Compiler", page: 1, pageSize: 10 });
            setCategories(category.data);
            setCompilers(compiler.data);

            if (compiler.data.length > 0) {
                setProblem(prev => ({
                    ...prev,
                    testCompilerID: compiler.data[0].compilerID, // Gán giá trị mặc định
                }));
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh mục bài toán:", error);
            setCategories([]);
        }
    };

    const handleCategoryChange = (e, categoryID) => {
        setProblem(prev => ({
            ...prev,
            selectedCategoryIDs: e.target.checked
                ? [...new Set([...prev.selectedCategoryIDs, categoryID])] // Thêm nếu checked
                : prev.selectedCategoryIDs.filter(id => id !== categoryID), // Xóa nếu uncheck
        }));
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setProblem((prev) => ({
            ...prev,
            [name]: name === "published" ? parseInt(value, 10) : value,
        }));
    };

    const validate = () => {
        let newErrors = {};
        if (!problem.problemName) newErrors.problemName = "Tên bài toán không được bỏ trống";
        if (!problem.problemCode) newErrors.problemCode = "Mã bài toán không được bỏ trống";
        if (problem.selectedCategoryIDs.length === 0) {
            newErrors.selectedCategoryIDs = "Vui lòng chọn thể loại";
        }
        if (!problem.testCompilerID) newErrors.testCompilerID = "Vui lòng chọn biên dịch viên";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setLoading(true);

        // Tạo đối tượng dữ liệu
        const data = {
            coderId: problem.coderId,
            problemCode: problem.problemCode,
            problemName: problem.problemName,
            timeLimit: problem.timeLimit,
            memoryLimit: problem.memoryLimit,
            testType: problem.testType,
            testCompilerID: problem.testCompilerID,
            note: problem.note,
            testCode: problem.testCode,
            problemContent: problem.problemContent,
            problemExplanation: problem.problemExplanation,
            selectedCategoryIDs: problem.selectedCategoryIDs, // Mảng các thể loại đã chọn
            publish: problem.published,
        };

        try {
            // Gửi yêu cầu POST với JSON
            await createItem({
                controller: "Problem",
                data: JSON.stringify(data), // Chuyển object thành JSON
                headers: {
                    "Content-Type": "application/json"
                }
            });

            toast({
                title: 'Thêm mới bài toán thành công!',
                status: 'success',
                duration: 2000,
                isClosable: true,
                position: 'top',
                variant: "left-accent",
            });

            if (fetchData) await fetchData(); // Lấy lại dữ liệu sau khi thêm thành công

            onClose(); // Đóng modal
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
            setLoading(false); // Tắt loading khi hoàn thành
        }
    };



    return (
        <Modal size={'4xl'} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader fontSize={'25px'} textAlign={'center'}>Thêm mới bài toán</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Grid templateColumns="repeat(2, 1fr)" gap="6">
                        <GridItem>
                            <FormControl isInvalid={errors.problemCode} mb={4}>
                                <FormLabel fontWeight="bold">Mã bài toán<Text as="span" color="red.500"> *</Text></FormLabel>
                                <FlushedInput bg={boxColor} placeholder="Nhập mã bài toán" name="problemCode" value={problem.problemCode} onChange={handleChange} textColor={textColor} />
                                <FormErrorMessage>{errors.problemCode}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.problemName} mb={4}>
                                <FormLabel fontWeight="bold">Tên bài toán<Text as="span" color="red.500"> *</Text></FormLabel>
                                <FlushedInput bg={boxColor} placeholder="Nhập tên bài toán" name="problemName" value={problem.problemName} onChange={handleChange} textColor={textColor} />
                                <FormErrorMessage>{errors.problemName}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.timeLimit} mb={4}>
                                <FormLabel fontWeight="bold">Giới hạn thời gian</FormLabel>
                                <FlushedInput bg={boxColor} type="number" placeholder="Nhập giới hạn thời gian" name="timeLimit" value={problem.timeLimit} onChange={handleChange} textColor={textColor} />
                                <FormErrorMessage>{errors.timeLimit}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.memoryLimit} mb={4}>
                                <FormLabel fontWeight="bold">Giới hạn bộ nhớ</FormLabel>
                                <FlushedInput bg={boxColor} type="number" placeholder="Nhập giới hạn bộ nhớ" name="memoryLimit" value={problem.memoryLimit} onChange={handleChange} textColor={textColor} />
                                <FormErrorMessage>{errors.memoryLimit}</FormErrorMessage>
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel fontWeight="bold">Loại bài kiểm tra</FormLabel>
                                <Select bg={boxColor} name="testType" value={problem.testType} onChange={handleChange} textColor={textColor}>
                                    <option key="outputMatching" value="Output Matching">Output Matching</option>
                                    <option key="custom" value="Custom">Custom</option>
                                </Select>
                            </FormControl>
                        </GridItem>
                        <GridItem>
                            <FormControl isInvalid={errors.selectedCategoryIDs} mb={4}>
                                <FormLabel fontWeight="bold">Thể loại<Text as="span" color="red.500"> *</Text></FormLabel>
                                <SimpleGrid columns={2} spacing={2} w="full">
                                    {categories.map((category) => (
                                        <Checkbox
                                            key={category.categoryID}
                                            isChecked={problem.selectedCategoryIDs.includes(category.categoryID)}
                                            onChange={(e) => handleCategoryChange(e, category.categoryID)}
                                        >
                                            {category.catName}
                                        </Checkbox>
                                    ))}
                                </SimpleGrid>
                                <FormErrorMessage>{errors.selectedCategoryIDs}</FormErrorMessage>
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel fontWeight="bold">Trình biên dịch</FormLabel>
                                <Select value={problem.testCompilerID} onChange={handleChange}>
                                    {compilers.map((compiler) => (
                                        <option key={compiler.compilerID} value={compiler.compilerID}>
                                            {compiler.compilerName}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl isInvalid={errors.problemContent} mb={4}>
                                <FormLabel fontWeight="bold">Nội dung bài toán</FormLabel>
                                <Textarea bg={boxColor} placeholder="Nhập nội dung bài toán" name="problemContent" value={problem.problemContent} onChange={handleChange} textColor={textColor} />
                                <FormErrorMessage>{errors.problemContent}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.problemExplanation} mb={4}>
                                <FormLabel fontWeight="bold">Giải thích bài toán</FormLabel>
                                <Textarea bg={boxColor} placeholder="Nhập giải thích bài toán" name="problemExplanation" value={problem.problemExplanation} onChange={handleChange} textColor={textColor} />
                                <FormErrorMessage>{errors.problemExplanation}</FormErrorMessage>
                            </FormControl>
                            <FormControl >
                                <FormLabel fontWeight="bold">Trạng thái</FormLabel>
                                <Select bg={boxColor} name="published" value={problem.published} onChange={handleChange} textColor={textColor}>
                                    <option key="default" value="">Chọn trạng thái</option>
                                    <option key="online" value="1">Online</option>
                                    <option key="offline" value="0">Offline</option>
                                </Select>
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
