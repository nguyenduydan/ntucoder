import React, { useState, useEffect, useRef } from "react";
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
    SimpleGrid,
    Checkbox,
    Box,
    Flex,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    IconButton,
    HStack,
    VStack,
    Badge,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, CopyIcon } from "@chakra-ui/icons";
import CodeEditor from "@monaco-editor/react";

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { modules, formats } from '@/utils/formatReactQuill';

import FlushedInput from "@/components/fields/InputField";
import { createItem, getList } from "@/config/apiService";
import { getMonacoLanguage } from "@/utils/utils";

// Template problem structure
const createEmptyProblem = () => ({
    problemCode: "",
    problemName: "",
    coderId: 1,
    timeLimit: "1.00",
    memoryLimit: "128",
    testType: "Output Matching",
    testCompilerID: "",
    selectedCategoryIDs: [],
    testCode: "",
    problemContent: "",
    problemExplanation: "",
    selectedLessonID: "",
    published: 1,
});

export default function BulkCreateProblemModal({ isOpen, onClose, fetchData }) {
    const [problems, setProblems] = useState([createEmptyProblem()]);
    const [activeTab, setActiveTab] = useState(0);
    const [categories, setCategories] = useState([]);
    const [compilers, setCompilers] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [errors, setErrors] = useState({});
    const [globalSettings, setGlobalSettings] = useState({
        selectedLessonID: "",
        testCompilerID: "",
        timeLimit: "1.00",
        memoryLimit: "128",
        testType: "Output Matching",
        published: 1,
        selectedCategoryIDs: [],
    });

    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const { colorMode } = useColorMode();
    const textColor = colorMode === 'light' ? 'black' : 'white';
    const boxColor = colorMode === 'light' ? 'gray.100' : 'whiteAlpha.100';

    const [theme, setTheme] = useState("vs-dark");
    const [language, setLanguage] = useState("cpp");

    useEffect(() => {
        if (isOpen) {
            setProblems([createEmptyProblem()]);
            setActiveTab(0);
            setErrors({});
            setGlobalSettings({
                selectedLessonID: "",
                testCompilerID: "",
                timeLimit: "1.00",
                memoryLimit: "128",
                testType: "Output Matching",
                published: 1,
                selectedCategoryIDs: [],
            });
            fetchList();
        }
    }, [isOpen]);

    const fetchList = async () => {
        try {
            const category = await getList({ controller: "Category", page: 1, pageSize: 10 });
            const compiler = await getList({ controller: "Compiler", page: 1, pageSize: 10 });
            const lesson = await getList({ controller: "Lesson", page: 1, pageSize: 10 });
            setLessons(lesson.data);
            setCategories(category.data);
            setCompilers(compiler.data);

            if (compiler.data.length > 0) {
                const defaultCompilerID = compiler.data[0].compilerID;
                setGlobalSettings(prev => ({
                    ...prev,
                    testCompilerID: defaultCompilerID,
                }));
                setProblems(prev => prev.map(problem => ({
                    ...problem,
                    testCompilerID: defaultCompilerID,
                })));
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh mục bài toán:", error);
            setCategories([]);
            setCompilers([]);
            setLessons([]);
        }
    };

    // Add new problem
    const addProblem = () => {
        const newProblem = {
            ...createEmptyProblem(),
            ...globalSettings, // Apply global settings to new problem
        };
        setProblems(prev => [...prev, newProblem]);
        setActiveTab(problems.length); // Switch to new tab
    };

    // Remove problem
    const removeProblem = (index) => {
        if (problems.length === 1) {
            toast({
                title: "Không thể xóa",
                description: "Phải có ít nhất một bài toán.",
                status: "warning",
                duration: 2000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        setProblems(prev => prev.filter((_, i) => i !== index));
        if (activeTab >= index && activeTab > 0) {
            setActiveTab(activeTab - 1);
        }
    };

    // Copy problem
    const copyProblem = (index) => {
        const problemToCopy = { ...problems[index] };
        problemToCopy.problemCode = problemToCopy.problemCode + "_copy";
        problemToCopy.problemName = problemToCopy.problemName + " (Sao chép)";

        setProblems(prev => [...prev, problemToCopy]);
        setActiveTab(problems.length); // Switch to copied tab
    };

    // Apply global settings to all problems
    const applyGlobalSettings = () => {
        setProblems(prev => prev.map(problem => ({
            ...problem,
            ...globalSettings,
        })));
        toast({
            title: "Áp dụng thành công",
            description: "Cài đặt chung đã được áp dụng cho tất cả bài toán.",
            status: "success",
            duration: 2000,
            isClosable: true,
            position: "top",
        });
    };

    const handleGlobalSettingsChange = (e) => {
        const { name, value } = e.target;
        setGlobalSettings(prev => ({
            ...prev,
            [name]: name === "published" ? parseInt(value, 10) : value,
        }));
    };

    const handleGlobalCategoryChange = (e, categoryID) => {
        setGlobalSettings(prev => ({
            ...prev,
            selectedCategoryIDs: e.target.checked
                ? [...new Set([...prev.selectedCategoryIDs, categoryID])]
                : prev.selectedCategoryIDs.filter(id => id !== categoryID),
        }));
    };

    const handleProblemChange = (index, e) => {
        const { name, value } = e.target;
        setProblems(prev => prev.map((problem, i) =>
            i === index
                ? { ...problem, [name]: name === "published" ? parseInt(value, 10) : value }
                : problem
        ));
    };

    const handleCategoryChange = (index, e, categoryID) => {
        setProblems(prev => prev.map((problem, i) =>
            i === index
                ? {
                    ...problem,
                    selectedCategoryIDs: e.target.checked
                        ? [...new Set([...problem.selectedCategoryIDs, categoryID])]
                        : problem.selectedCategoryIDs.filter(id => id !== categoryID),
                }
                : problem
        ));
    };

    const handleEditorChange = (index, field, content) => {
        setProblems(prev => prev.map((problem, i) =>
            i === index ? { ...problem, [field]: content } : problem
        ));
    };

    const validate = () => {
        let newErrors = {};
        let hasErrors = false;

        problems.forEach((problem, index) => {
            const problemErrors = {};
            if (!problem.problemName) problemErrors.problemName = "Tên bài toán không được bỏ trống";
            if (!problem.problemCode) problemErrors.problemCode = "Mã bài toán không được bỏ trống";
            if (problem.selectedCategoryIDs.length === 0) {
                problemErrors.selectedCategoryIDs = "Vui lòng chọn thể loại";
            }
            if (!problem.testCompilerID) problemErrors.testCompilerID = "Vui lòng chọn biên dịch viên";

            if (Object.keys(problemErrors).length > 0) {
                newErrors[index] = problemErrors;
                hasErrors = true;
            }
        });

        // Check for duplicate problem codes
        const problemCodes = problems.map(p => p.problemCode.toLowerCase());
        const duplicates = problemCodes.filter((code, index) => problemCodes.indexOf(code) !== index);

        if (duplicates.length > 0) {
            problems.forEach((problem, index) => {
                if (duplicates.includes(problem.problemCode.toLowerCase())) {
                    if (!newErrors[index]) newErrors[index] = {};
                    newErrors[index].problemCode = "Mã bài toán bị trùng lặp";
                    hasErrors = true;
                }
            });
        }

        setErrors(newErrors);
        return !hasErrors;
    };

    const handleSubmit = async () => {
        if (!validate()) {
            toast({
                title: "Lỗi xác thực",
                description: "Vui lòng kiểm tra lại thông tin các bài toán.",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        setLoading(true);
        let successCount = 0;
        let failedProblems = [];

        try {
            // Create problems sequentially to avoid overwhelming the server
            for (let i = 0; i < problems.length; i++) {
                const problem = problems[i];
                const data = {
                    coderId: problem.coderId,
                    problemCode: problem.problemCode,
                    problemName: problem.problemName,
                    timeLimit: problem.timeLimit,
                    memoryLimit: problem.memoryLimit,
                    testType: problem.testType,
                    testCompilerID: problem.testCompilerID,
                    testCode: problem.testCode,
                    problemContent: problem.problemContent,
                    problemExplanation: problem.problemExplanation,
                    selectedCategoryIDs: problem.selectedCategoryIDs,
                    selectedLessonID: problem.selectedLessonID,
                    published: problem.published,
                };

                try {
                    await createItem({
                        controller: "Problem",
                        data: data,
                    });
                    successCount++;
                } catch (error) {
                    failedProblems.push({
                        index: i + 1,
                        name: problem.problemName,
                        error: error.message,
                    });
                }
            }

            // Show results
            if (successCount === problems.length) {
                toast({
                    title: `Thành công!`,
                    description: `Đã tạo thành công ${successCount} bài toán.`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    position: 'top',
                    variant: "left-accent",
                });
                onClose();
            } else {
                toast({
                    title: `Hoàn thành một phần`,
                    description: `Tạo thành công ${successCount}/${problems.length} bài toán. ${failedProblems.length} bài toán bị lỗi.`,
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                    position: 'top',
                    variant: "left-accent",
                });
            }

            if (fetchData) await fetchData();

        } catch (error) {
            toast({
                title: "Đã xảy ra lỗi.",
                description: "Có lỗi xảy ra trong quá trình tạo bài toán.",
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

    const selectedCompiler = compilers.find(c => c.compilerID === Number(language));
    const monacoLang = getMonacoLanguage(selectedCompiler?.compilerExtension || '');

    return (
        <Modal size={'full'} isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader fontSize={'25px'} textAlign={'center'}>
                    <Flex justify="center" align="center" gap={4}>
                        <Text>Thêm nhiều bài toán</Text>
                        <Badge colorScheme="blue" fontSize="md">
                            {problems.length} bài toán
                        </Badge>
                    </Flex>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Tabs index={activeTab} onChange={setActiveTab} >
                        <Flex justify="space-between" align="center" mb={4}>
                            <TabList overflow="hidden" flex="1">
                                <Tab key="global" fontWeight="bold" color="blue.500">
                                    Cài đặt chung
                                </Tab>
                                {problems.map((problem, index) => (
                                    <Tab key={index} position="relative">
                                        <VStack spacing={1}>
                                            <Text fontSize="sm">
                                                Bài {index + 1}
                                            </Text>
                                            {problem.problemName && (
                                                <Text fontSize="xs" color="gray.500" maxW="100px" isTruncated>
                                                    {problem.problemName}
                                                </Text>
                                            )}
                                        </VStack>
                                        {errors[index] && (
                                            <Box
                                                position="absolute"
                                                top="-2px"
                                                right="-2px"
                                                w="8px"
                                                h="8px"
                                                bg="red.500"
                                                borderRadius="full"
                                            />
                                        )}
                                    </Tab>
                                ))}
                            </TabList>
                            <HStack>
                                <IconButton
                                    icon={<AddIcon />}
                                    colorScheme="green"
                                    size="sm"
                                    onClick={addProblem}
                                    title="Thêm bài toán mới"
                                />
                            </HStack>
                        </Flex>

                        <TabPanels>
                            {/* Global Settings Tab */}
                            <TabPanel>
                                <VStack spacing={6} align="stretch">
                                    <Alert status="info">
                                        <AlertIcon />
                                        <Box>
                                            <AlertTitle>Cài đặt chung!</AlertTitle>
                                            <AlertDescription>
                                                Thiết lập các giá trị mặc định cho tất cả bài toán. Bạn có thể chỉnh sửa từng bài toán riêng lẻ sau.
                                            </AlertDescription>
                                        </Box>
                                    </Alert>

                                    <Grid templateColumns="1fr 1fr" gap="6">
                                        <GridItem>
                                            <FormControl mb={4}>
                                                <FormLabel fontWeight="bold">Chọn bài học<Text as="span" color="red.500"> *</Text></FormLabel>
                                                <Menu>
                                                    <MenuButton as={Button} w="100%" border="1px solid gray">
                                                        {lessons.find(l => l.lessonID === globalSettings.selectedLessonID)?.lessonTitle || "-- Chọn bài học --"}
                                                    </MenuButton>
                                                    <MenuList maxH="200px" overflow="auto" maxW="500px" boxShadow="md">
                                                        {lessons.map(lesson => (
                                                            <MenuItem
                                                                key={lesson.lessonID}
                                                                _hover={{ bg: "gray.300" }}
                                                                onClick={() => handleGlobalSettingsChange({
                                                                    target: { name: "selectedLessonID", value: lesson.lessonID }
                                                                })}
                                                            >
                                                                {lesson.lessonTitle}
                                                            </MenuItem>
                                                        ))}
                                                    </MenuList>
                                                </Menu>
                                            </FormControl>

                                            <FormControl mb={4}>
                                                <FormLabel fontWeight="bold">Trình biên dịch</FormLabel>
                                                <Select value={globalSettings.testCompilerID} name="testCompilerID" onChange={handleGlobalSettingsChange}>
                                                    {compilers.map((compiler) => (
                                                        <option key={compiler.compilerID} value={compiler.compilerID}>
                                                            {compiler.compilerName}
                                                        </option>
                                                    ))}
                                                </Select>
                                            </FormControl>

                                            <FormControl mb={4}>
                                                <FormLabel fontWeight="bold">Giới hạn thời gian</FormLabel>
                                                <FlushedInput
                                                    bg={boxColor}
                                                    type="number"
                                                    placeholder="Nhập giới hạn thời gian"
                                                    name="timeLimit"
                                                    value={globalSettings.timeLimit}
                                                    onChange={handleGlobalSettingsChange}
                                                    textColor={textColor}
                                                />
                                            </FormControl>

                                            <FormControl mb={4}>
                                                <FormLabel fontWeight="bold">Giới hạn bộ nhớ</FormLabel>
                                                <FlushedInput
                                                    bg={boxColor}
                                                    type="number"
                                                    placeholder="Nhập giới hạn bộ nhớ"
                                                    name="memoryLimit"
                                                    value={globalSettings.memoryLimit}
                                                    onChange={handleGlobalSettingsChange}
                                                    textColor={textColor}
                                                />
                                            </FormControl>
                                        </GridItem>

                                        <GridItem>
                                            <FormControl mb={4}>
                                                <FormLabel fontWeight="bold">Thể loại</FormLabel>
                                                <SimpleGrid columns={2} spacing={2} w="full">
                                                    {categories.map((category) => (
                                                        <Checkbox
                                                            key={category.categoryID}
                                                            isChecked={globalSettings.selectedCategoryIDs.includes(category.categoryID)}
                                                            onChange={(e) => handleGlobalCategoryChange(e, category.categoryID)}
                                                        >
                                                            {category.catName}
                                                        </Checkbox>
                                                    ))}
                                                </SimpleGrid>
                                            </FormControl>

                                            <FormControl mb={4}>
                                                <FormLabel fontWeight="bold">Loại bài kiểm tra</FormLabel>
                                                <Select bg={boxColor} name="testType" value={globalSettings.testType} onChange={handleGlobalSettingsChange} textColor={textColor}>
                                                    <option value="Output Matching">Output Matching</option>
                                                    <option value="Custom">Custom</option>
                                                </Select>
                                            </FormControl>

                                            <FormControl mb={4}>
                                                <FormLabel fontWeight="bold">Trạng thái</FormLabel>
                                                <Select bg={boxColor} name="published" value={globalSettings.published} onChange={handleGlobalSettingsChange} textColor={textColor}>
                                                    <option value="1">Online</option>
                                                    <option value="0">Offline</option>
                                                </Select>
                                            </FormControl>
                                        </GridItem>
                                    </Grid>

                                    <Button colorScheme="blue" onClick={applyGlobalSettings}>
                                        Áp dụng cho tất cả bài toán
                                    </Button>
                                </VStack>
                            </TabPanel>

                            {/* Individual Problem Tabs */}
                            {problems.map((problem, index) => (
                                <TabPanel key={index}>
                                    <Flex justify="space-between" align="center" mb={4}>
                                        <Text fontSize="lg" fontWeight="bold">
                                            Bài toán #{index + 1}
                                        </Text>
                                        <HStack>
                                            <IconButton
                                                icon={<CopyIcon />}
                                                colorScheme="blue"
                                                size="sm"
                                                onClick={() => copyProblem(index)}
                                                title="Sao chép bài toán này"
                                            />
                                            <IconButton
                                                icon={<DeleteIcon />}
                                                colorScheme="red"
                                                size="sm"
                                                onClick={() => removeProblem(index)}
                                                title="Xóa bài toán này"
                                                isDisabled={problems.length === 1}
                                            />
                                        </HStack>
                                    </Flex>

                                    <Grid templateColumns="1fr 500px" gap="6">
                                        <GridItem>
                                            <FormControl isInvalid={errors[index]?.problemCode} mb={4}>
                                                <FormLabel fontWeight="bold">Mã bài toán<Text as="span" color="red.500"> *</Text></FormLabel>
                                                <FlushedInput
                                                    bg={boxColor}
                                                    placeholder="Nhập mã bài toán"
                                                    name="problemCode"
                                                    value={problem.problemCode}
                                                    onChange={(e) => handleProblemChange(index, e)}
                                                    textColor={textColor}
                                                />
                                                <FormErrorMessage>{errors[index]?.problemCode}</FormErrorMessage>
                                            </FormControl>

                                            <FormControl isInvalid={errors[index]?.problemName} mb={4}>
                                                <FormLabel fontWeight="bold">Tên bài toán<Text as="span" color="red.500"> *</Text></FormLabel>
                                                <FlushedInput
                                                    bg={boxColor}
                                                    placeholder="Nhập tên bài toán"
                                                    name="problemName"
                                                    value={problem.problemName}
                                                    onChange={(e) => handleProblemChange(index, e)}
                                                    textColor={textColor}
                                                />
                                                <FormErrorMessage>{errors[index]?.problemName}</FormErrorMessage>
                                            </FormControl>

                                            <FormControl mb={4}>
                                                <FormLabel fontWeight="bold">Nội dung bài toán</FormLabel>
                                                <Box maxH="400px" overflowY="auto">
                                                    <ReactQuill
                                                        key={`${index}-content`}
                                                        modules={modules}
                                                        formats={formats}
                                                        theme="snow"
                                                        placeholder="Nội dung bài toán...."
                                                        value={problem.problemContent}
                                                        onChange={(newContent) => handleEditorChange(index, 'problemContent', newContent)}
                                                    />
                                                </Box>
                                            </FormControl>

                                            <FormControl mb={4}>
                                                <FormLabel fontWeight="bold">Code mẫu</FormLabel>
                                                <Flex gap={20} direction="row">
                                                    <Select mb={4} value={language} onChange={(e) => setLanguage(e.target.value)}>
                                                        <option defaultValue="none" disabled>Chọn ngôn ngữ</option>
                                                        {compilers.map((compiler) => (
                                                            <option key={compiler.compilerID} value={compiler.compilerID}>
                                                                {compiler.compilerName}
                                                            </option>
                                                        ))}
                                                    </Select>
                                                    <Select mb={4} value={theme} onChange={(e) => setTheme(e.target.value)}>
                                                        <option defaultValue="none" disabled>Chọn giao diện</option>
                                                        <option value="vs-dark">Tối</option>
                                                        <option value="vs-light">Sáng</option>
                                                    </Select>
                                                </Flex>
                                                <Box border="1px solid" borderColor="gray.600" borderRadius="md" mb={4}>
                                                    <CodeEditor
                                                        height="300px"
                                                        theme={theme}
                                                        language={monacoLang || "cpp"}
                                                        value={problem.testCode}
                                                        onChange={(value) => handleEditorChange(index, 'testCode', value || '')}
                                                        options={{
                                                            fontSize: 14,
                                                            minimap: { enabled: false },
                                                            suggestOnTriggerCharacters: true,
                                                            quickSuggestions: {
                                                                other: true,
                                                                comments: true,
                                                                strings: true
                                                            },
                                                            wordBasedSuggestions: true,
                                                            parameterHints: { enabled: true },
                                                            tabCompletion: "on"
                                                        }}
                                                    />
                                                </Box>
                                            </FormControl>
                                        </GridItem>

                                        <GridItem>
                                            <Box position="sticky" top="0" >
                                                <FormControl isInvalid={errors[index]?.selectedCategoryIDs} mb={4}>
                                                    <FormLabel fontWeight="bold">
                                                        Thể loại<Text as="span" color="red.500"> *</Text>
                                                    </FormLabel>
                                                    <SimpleGrid columns={2} spacing={2} w="full">
                                                        {categories.map((category) => (
                                                            <Checkbox
                                                                key={category.categoryID}
                                                                isChecked={problem.selectedCategoryIDs.includes(category.categoryID)}
                                                                onChange={(e) => handleCategoryChange(index, e, category.categoryID)}
                                                            >
                                                                {category.catName}
                                                            </Checkbox>
                                                        ))}
                                                    </SimpleGrid>
                                                    <FormErrorMessage>{errors[index]?.selectedCategoryIDs}</FormErrorMessage>
                                                </FormControl>

                                                <FormControl mb={4}>
                                                    <FormLabel fontWeight="bold">Trình biên dịch</FormLabel>
                                                    <Select value={problem.testCompilerID} name="testCompilerID" onChange={(e) => handleProblemChange(index, e)}>
                                                        {compilers.map((compiler) => (
                                                            <option key={compiler.compilerID} value={compiler.compilerID}>
                                                                {compiler.compilerName}
                                                            </option>
                                                        ))}
                                                    </Select>
                                                </FormControl>

                                                <FormControl mb={4}>
                                                    <FormLabel fontWeight="bold">Chọn bài học<Text as="span" color="red.500"> *</Text></FormLabel>
                                                    <Menu>
                                                        <MenuButton as={Button} w="100%" border="1px solid gray">
                                                            {lessons.find(l => l.lessonID === problem.selectedLessonID)?.lessonTitle || "-- Chọn bài học --"}
                                                        </MenuButton>
                                                        <MenuList maxH="200px" overflow="auto" maxW="500px" boxShadow="md">
                                                            {lessons.map(lesson => (
                                                                <MenuItem
                                                                    key={lesson.lessonID}
                                                                    _hover={{ bg: "gray.300" }}
                                                                    onClick={() => handleProblemChange(index, {
                                                                        target: { name: "selectedLessonID", value: lesson.lessonID }
                                                                    })}
                                                                >
                                                                    {lesson.lessonTitle}
                                                                </MenuItem>
                                                            ))}
                                                        </MenuList>
                                                    </Menu>
                                                </FormControl>

                                                <Grid templateColumns="1fr 1fr" gap={2}>
                                                    <FormControl mb={4}>
                                                        <FormLabel fontWeight="bold">Giới hạn thời gian</FormLabel>
                                                        <FlushedInput
                                                            bg={boxColor}
                                                            type="number"
                                                            placeholder="Thời gian"
                                                            name="timeLimit"
                                                            value={problem.timeLimit}
                                                            onChange={(e) => handleProblemChange(index, e)}
                                                            textColor={textColor}
                                                        />
                                                    </FormControl>

                                                    <FormControl mb={4}>
                                                        <FormLabel fontWeight="bold">Giới hạn bộ nhớ</FormLabel>
                                                        <FlushedInput
                                                            bg={boxColor}
                                                            type="number"
                                                            placeholder="Bộ nhớ"
                                                            name="memoryLimit"
                                                            value={problem.memoryLimit}
                                                            onChange={(e) => handleProblemChange(index, e)}
                                                            textColor={textColor}
                                                        />
                                                    </FormControl>
                                                </Grid>

                                                <FormControl mb={4}>
                                                    <FormLabel fontWeight="bold">Loại bài kiểm tra</FormLabel>
                                                    <Select bg={boxColor} name="testType" value={problem.testType} onChange={(e) => handleProblemChange(index, e)} textColor={textColor}>
                                                        <option value="Output Matching">Output Matching</option>
                                                        <option value="Custom">Custom</option>
                                                    </Select>
                                                </FormControl>

                                                <FormControl mb={4}>
                                                    <FormLabel fontWeight="bold">Trạng thái</FormLabel>
                                                    <Select bg={boxColor} name="published" value={problem.published} onChange={(e) => handleProblemChange(index, e)} textColor={textColor}>
                                                        <option value="1">Online</option>
                                                        <option value="0">Offline</option>
                                                    </Select>
                                                </FormControl>
                                                <FormControl mb={4}>
                                                    <FormLabel fontWeight="bold">Giải thích bài toán</FormLabel>
                                                    <Box>
                                                        <ReactQuill
                                                            key={`${index}-explanation`}
                                                            modules={modules}
                                                            formats={formats}
                                                            theme="snow"
                                                            placeholder="Giải thích chi tiết..."
                                                            value={problem.problemExplanation}
                                                            onChange={(newContent) => handleEditorChange(index, 'problemExplanation', newContent)}
                                                        />
                                                    </Box>
                                                </FormControl>
                                            </Box>
                                        </GridItem>
                                    </Grid>
                                </TabPanel>
                            ))}
                        </TabPanels>
                    </Tabs>
                </ModalBody>
                <ModalFooter>
                    <HStack spacing={3}>
                        <Text fontSize="sm" color="gray.500">
                            Tổng cộng: {problems.length} bài toán
                        </Text>
                        <Button colorScheme="gray" onClick={onClose}>
                            Hủy
                        </Button>
                        <Button
                            colorScheme="green"
                            isLoading={loading}
                            loadingText="Đang tạo..."
                            onClick={handleSubmit}
                            isDisabled={problems.length === 0}
                        >
                            Tạo tất cả ({problems.length})
                        </Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
