import React, { useEffect, useRef, useState, useCallback } from "react";
import {
    Box,
    Text,
    VStack,
    Flex,
    Grid,
    GridItem,
    Link,
    Button,
    Input,
    IconButton,
    useToast,
    Select,
    useColorMode,
    SimpleGrid,
    Checkbox,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { MdOutlineArrowBack, MdEdit } from "react-icons/md";
import ScrollToTop from "@/components/scroll/ScrollToTop";
import ProgressBar from "@/components/loading/loadingBar";
import JoditEditor from "jodit-react";
import sanitizeHtml from "@/utils/sanitizedHTML";
import Editor from "@/utils/configEditor";
import CodeEditor from "@monaco-editor/react";
import { getMonacoLanguage } from "@/utils/utils";

import "moment/locale/vi";
//import api
import { getList, getDetail, updateItem } from "@/config/apiService";


const ProblemDetail = () => {
    const { id } = useParams();
    const editor = useRef(null);
    const navigate = useNavigate();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const { colorMode } = useColorMode(); // Lấy trạng thái chế độ màu
    const textColor = colorMode === 'light' ? 'black' : 'white';
    const boxColor = colorMode === 'light' ? 'white' : 'whiteAlpha.300';

    const [problem, setProblemDetail] = useState(null);

    const [categories, setProblemCategories] = useState([]);
    const [lessons, setLesson] = useState([]);

    const [editField, setEditField] = useState(null);
    const [editableValues, setEditableValues] = useState({});
    const testTypeMapping = {
        'Output Matching': 'Output Matching',
        'Validate Output': 'Validate Output',
    };

    const [compilers, setCompiler] = useState([]);
    const [language, setLanguage] = useState("");

    const fetchProblemDetail = useCallback(async () => {
        try {
            const data = await getDetail({ controller: "Problem", id: id });

            setProblemDetail({
                ...data,
                selectedCategoryIDs: data.selectedCategoryIDs || [],
                selectedCategoryNames: data.selectedCategoryNames || []
            });

            setEditableValues({
                ...data,
                selectedCategoryIDs: data.selectedCategoryIDs || []
            });
        } catch (error) {
            toast({
                title: "Đã xảy ra lỗi.",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top",
                variant: "left-accent",
            });
        }
    }, [id, toast]);

    const fetchListData = async () => {
        try {
            const compiler = await getList({ controller: "Compiler", page: 1, pageSize: 10 });
            const category = await getList({ controller: "Category", page: 1, pageSize: 10 });
            const lesson = await getList({ controller: "Lesson", page: 1, pageSize: 10 });
            setLesson(lesson.data);
            setProblemCategories(category.data);

            const compilerData = compiler.data;

            setCompiler(compilerData);

            if (compilerData.length > 0) {
                const defaultCompiler = compilerData[0];
                setLanguage(defaultCompiler);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh mục khóa học:", error);
            setProblemCategories([]);
            setCompiler([]);
            setLesson([]);
        }
    };
    useEffect(() => {
        if (id) {
            fetchProblemDetail();
            fetchListData();
        }
    }, [id, fetchProblemDetail]);


    const handleEdit = (field) => {
        if (field === 'selectedCategory') {
            setEditableValues((prev) => ({
                ...prev,
                selectedCategoryIDs: problem.selectedCategoryIDs || [],
            }));
        }
        setEditField(field);
    };

    const handleInputChange = (field, value) => {
        setEditableValues((prev) => {
            const updatedValues = { ...prev, [field]: value };
            setProblemDetail((prevProblemDetail) => ({
                ...prevProblemDetail,
                [field]: value,
            }));
            return updatedValues;
        });
    };

    const handleSave = async () => {
        setLoading(true);  // Bật trạng thái loading khi gửi yêu cầu
        try {
            const formData = new FormData();

            // Lưu tất cả các trường đã chỉnh sửa.
            Object.keys(editableValues).forEach((field) => {
                if (field === "selectedCategoryIDs") {
                    editableValues.selectedCategoryIDs.forEach(id => {
                        formData.append("SelectedCategoryIDs", id); // Hoặc "SelectedCategoryIDs[]" nếu backend yêu cầu
                    });
                } else if (field !== "ProblemID") {
                    formData.append(field, editableValues[field]);
                }
            });

            // Cập nhật ProblemDetail sau khi chỉnh sửa
            setProblemDetail((prev) => ({
                ...prev,
                ...editableValues,
            }));

            // Gọi API PUT để cập nhật dữ liệu
            await updateItem({ controller: "Problem", id: id, data: formData });
            await fetchProblemDetail();
            setEditField(null); // Reset trạng thái chỉnh sửa
            toast({
                title: "Cập nhật thành công!",
                status: "success",
                duration: 2000,
                isClosable: true,
                position: "top",
                variant: "left-accent",
            });
            setLoading(false);  // Bật trạng thái loading khi gửi yêu cầu
        } catch (error) {
            console.error("Đã xảy ra lỗi khi cập nhật", error);
            toast({
                title: "Đã xảy ra lỗi khi cập nhật.",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top",
                variant: "left-accent",
            });
            setLoading(false);  // Bật trạng thái loading khi gửi yêu cầu
        }
    };

    const selectedCompiler = compilers.find(c => c.compilerID === Number(language)); // `language` là ID bạn đang select
    const monacoLang = getMonacoLanguage(selectedCompiler?.compilerExtension || '');


    if (!problem) {
        return (
            <ProgressBar />
        );
    }
    return (
        <ScrollToTop>
            <Box pt={{ base: "130px", md: "80px", xl: "80px" }} px="10px">
                <Box
                    bg={boxColor}
                    p={{ base: "4", md: "6" }}  // Padding responsive
                    borderRadius="lg"
                    boxShadow="lg"
                    w="100%"
                    maxW="1000vh"
                    mx="auto"
                >
                    <Flex justifyContent="end" align="end" px={{ base: "10px", md: "25px" }}>
                        <Link>
                            <Button
                                onClick={() => navigate(-1)}
                                variant="solid"
                                size="lg"
                                colorScheme="teal"
                                borderRadius="xl"
                                px={5}
                                boxShadow="lg"
                                bgGradient="linear(to-l, messenger.500, navy.300)"
                                transition="all 0.2s ease-in-out"
                                _hover={{
                                    color: "white",
                                    transform: "scale(1.05)",
                                }}
                                _active={{
                                    transform: "scale(0.90)",
                                }}
                            >
                                <MdOutlineArrowBack /> Quay lại
                            </Button>
                        </Link>
                    </Flex>
                    <VStack spacing={6} align="stretch" mt={4}>
                        {/* Responsive Grid: 1 column on mobile, 2 columns on md+ */}
                        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
                            {/* Left Column */}
                            <GridItem>
                                <VStack align="stretch" spacing={4}>
                                    {['problemCode', 'problemName', 'timeLimit', 'memoryLimit'].map(
                                        (field) => (
                                            <Flex key={field} align="center">
                                                {editField === field ? (
                                                    <Input
                                                        type={
                                                            field === 'timeLimit' || field === 'memoryLimit'
                                                                ? 'number'
                                                                : 'text'
                                                        }
                                                        textColor={textColor}
                                                        value={editableValues[field] || ""}
                                                        onChange={(e) => handleInputChange(field, e.target.value)}
                                                        placeholder={`Chỉnh sửa ${field}`}
                                                        onBlur={() => setEditField(null)}
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <Text fontSize="lg">
                                                        <strong>
                                                            {field === 'problemCode'
                                                                ? 'Mã bài tập'
                                                                : field === 'problemName'
                                                                    ? 'Tên bài tập'
                                                                    : field === 'timeLimit'
                                                                        ? 'Thời gian giới hạn'
                                                                        : 'Bộ nhớ giới hạn'}
                                                            :
                                                        </strong>{' '}
                                                        {problem[field] || 'Chưa có thông tin'}
                                                    </Text>
                                                )}
                                                <IconButton
                                                    aria-label="Edit"
                                                    icon={<MdEdit />}
                                                    ml={2}
                                                    size="sm"
                                                    onClick={() => handleEdit(field)}
                                                    cursor="pointer"
                                                />
                                            </Flex>
                                        ),
                                    )}
                                    <Flex align="center">
                                        <Text fontSize="lg" fontWeight="bold">
                                            Nội dung:
                                        </Text>
                                        <IconButton
                                            aria-label="Edit"
                                            icon={<MdEdit />}
                                            ml={2}
                                            size="sm"
                                            onClick={() => handleEdit('problemContent')}
                                            cursor="pointer"
                                        />
                                    </Flex>
                                    {editField === 'problemContent' ? (
                                        <JoditEditor
                                            ref={editor}
                                            value={editableValues.problemContent}
                                            config={Editor}
                                            onChange={(newContent) => handleInputChange("problemContent", newContent)}
                                            autoFocus
                                            style={{ width: "100%", minHeight: "300px" }}
                                        />
                                    ) : (
                                        <Box
                                            overflowY={"auto"}
                                            maxHeight="300px"
                                            bg="gray.200"
                                            borderRadius="md"
                                            p={2}
                                            sx={{ wordBreak: "break-word" }}
                                            dangerouslySetInnerHTML={
                                                {
                                                    __html: sanitizeHtml(problem?.problemContent)
                                                }
                                            }
                                        />
                                    )}

                                    <Flex align="center">
                                        <Text fontSize="lg" fontWeight="bold">
                                            Giải thích:
                                        </Text>
                                        <IconButton
                                            aria-label="Edit"
                                            icon={<MdEdit />}
                                            ml={2}
                                            size="sm"
                                            onClick={() => handleEdit('problemExplanation')}
                                            cursor="pointer"
                                        />
                                    </Flex>
                                    {editField === 'problemExplanation' ? (
                                        <JoditEditor
                                            ref={editor}
                                            value={editableValues.problemExplanation}
                                            config={Editor}
                                            onChange={(newContent) => handleInputChange("problemExplanation", newContent)}
                                            autoFocus
                                            style={{ width: "100%", minHeight: "300px" }}
                                        />
                                    ) : (
                                        <Box
                                            overflowY={"auto"}
                                            maxHeight="300px"
                                            bg="gray.200"
                                            borderRadius="md"
                                            p={2}
                                            sx={{ wordBreak: "break-word" }}
                                            dangerouslySetInnerHTML={
                                                {
                                                    __html: sanitizeHtml(problem?.problemExplanation)
                                                }
                                            }
                                        />
                                    )}

                                    <Flex align="center">
                                        <Text fontSize="lg" fontWeight="bold">
                                            Code mẫu:
                                        </Text>
                                        <IconButton
                                            aria-label="Edit"
                                            icon={<MdEdit />}
                                            ml={2}
                                            size="sm"
                                            onClick={() => handleEdit('testCode')}
                                            cursor="pointer"
                                        />
                                    </Flex>
                                    {editField === 'testCode' ? (
                                        <Box borderColor="gray.600" borderRadius="md" mb={4}>
                                            <Select
                                                mb={4}
                                                placeholder="Chọn ngôn ngữ"
                                                value={language}
                                                onChange={(e) => setLanguage(e.target.value)}
                                            >
                                                {compilers.map((compiler) => (
                                                    <option key={compiler.compilerID} value={compiler.compilerID}>
                                                        {compiler.compilerName}
                                                    </option>
                                                ))}
                                            </Select>
                                            <CodeEditor
                                                height="400px"
                                                theme={"vs-dark"}
                                                value={problem.testCode}
                                                language={monacoLang}
                                                onChange={(value) => handleInputChange('testCode', value || '')}
                                                onBlur={(value) => handleInputChange('testCode', value || '')}
                                                options={{
                                                    fontSize: 14,
                                                    minimap: { enabled: false },
                                                    suggestOnTriggerCharacters: true,    // Gợi ý khi gõ các ký tự đặc biệt (ví dụ: .)
                                                    quickSuggestions: {                  // Gợi ý tự động khi đang gõ
                                                        other: true,
                                                        comments: true,
                                                        strings: true
                                                    },
                                                    wordBasedSuggestions: true,           // Gợi ý từ các từ trong file hiện tại
                                                    parameterHints: { enabled: true },     // Gợi ý tham số hàm
                                                    tabCompletion: "on"
                                                }}
                                            />
                                        </Box>
                                    ) : (
                                        <Box
                                            overflowY={"auto"}
                                            maxHeight="300px"
                                            bg="gray.200"
                                            borderRadius="md"
                                            p={2}
                                            sx={{ wordBreak: "break-word" }}
                                            dangerouslySetInnerHTML={
                                                {
                                                    __html: sanitizeHtml(problem?.testCode)
                                                }
                                            }
                                        />
                                    )}

                                </VStack>
                            </GridItem>

                            {/* Right Column */}
                            <GridItem>
                                <VStack align="stretch" spacing={4}>
                                    <Flex align="center">
                                        {editField === 'testType' ? (
                                            <Select
                                                value={
                                                    editableValues.testType || problem.testType || ''
                                                }
                                                onBlur={() => setEditField(null)}
                                                onChange={(e) => handleInputChange("testType", e.target.value)}
                                                autoFocus
                                                width="100%"
                                            >
                                                <option value="Output Matching">Output Matching</option>
                                                <option value="Validate Output">Validate Output</option>
                                            </Select>
                                        ) : (
                                            <Text fontSize="lg">
                                                <strong>Hình thức kiểm tra:</strong>{' '}
                                                {testTypeMapping[problem.testType] ||
                                                    'Không xác định'}
                                            </Text>
                                        )}
                                        <IconButton
                                            aria-label="Edit"
                                            icon={<MdEdit />}
                                            ml={2}
                                            size="sm"
                                            onClick={() => handleEdit('testType')}
                                            cursor="pointer"
                                        />
                                    </Flex>
                                    <Flex align="center">
                                        <Text fontSize="lg">
                                            <strong>Tên người tạo:</strong>{' '}
                                            {problem.coderName || 'Chưa có thông tin'}
                                        </Text>
                                    </Flex>

                                    <Flex align="center">
                                        <Text fontSize="lg">
                                            <strong>Trạng thái:</strong>{' '}
                                            {problem.published === 1 ? 'Công khai' : 'Riêng tư'}
                                        </Text>
                                    </Flex>

                                    <Flex align="center">
                                        {editField === "compiler" ? (
                                            <Select
                                                mb={4}
                                                placeholder="Chọn ngôn ngữ"
                                                value={language}
                                                onChange={(e) => setLanguage(e.target.value)}
                                            >
                                                {compilers.map((compiler) => (
                                                    <option key={compiler.compilerID} value={compiler.compilerID}>
                                                        {compiler.compilerName}
                                                    </option>
                                                ))}
                                            </Select>

                                        ) : (
                                            <Text fontSize="lg">
                                                <strong>Trình biên dịch:</strong> {compilers.find(c => c.compilerID === Number(problem.testCompilerID))?.compilerName || "Chưa chọn"}
                                            </Text>
                                        )}
                                        <IconButton
                                            aria-label="Edit"
                                            icon={<MdEdit />}
                                            ml={2}
                                            size="sm"
                                            onClick={() => handleEdit('compiler')}
                                        />
                                    </Flex>

                                    <Flex align="center">
                                        {editField === 'selectedCategory' ? (
                                            <SimpleGrid columns={2} spacing={2} w="full">
                                                {categories.map((category) => {
                                                    const isChecked = editableValues.selectedCategoryIDs?.includes(category.categoryID);
                                                    return (
                                                        <Checkbox
                                                            key={category.categoryID}
                                                            isChecked={isChecked}
                                                            onChange={(e) => {
                                                                const updatedCategoryIDs = e.target.checked
                                                                    ? [...new Set([...(editableValues.selectedCategoryIDs || []), category.categoryID])]
                                                                    : (editableValues.selectedCategoryIDs || []).filter((id) => id !== category.categoryID);

                                                                setEditableValues(prev => ({
                                                                    ...prev,
                                                                    selectedCategoryIDs: updatedCategoryIDs
                                                                }));
                                                            }}
                                                        >
                                                            {category.catName}
                                                        </Checkbox>
                                                    );
                                                })}
                                            </SimpleGrid>
                                        ) : (
                                            <Text fontSize="lg">
                                                <strong>Thể loại:</strong>{' '}
                                                {problem.selectedCategoryNames?.length > 0
                                                    ? problem.selectedCategoryNames.join(', ')
                                                    : 'Chưa có danh mục'}
                                            </Text>
                                        )}

                                        <IconButton
                                            aria-label="Edit"
                                            icon={<MdEdit />}
                                            ml={2}
                                            size="sm"
                                            onClick={() => handleEdit('selectedCategory')}
                                        />
                                    </Flex>
                                    <Flex align="center">
                                        {editField === "lesson" ? (
                                            <Select
                                                name="selectedLessonID"
                                                value={editableValues.selectedLessonID || ""}
                                                onBlur={() => setEditField(null)}
                                                onChange={(e) => handleInputChange("selectedLessonID", e.target.value)}
                                                autoFocus
                                                width="100%"
                                            >
                                                {lessons.map((lesson) => (
                                                    <option key={lesson.lessonID} value={lesson.lessonID}>
                                                        {lesson.lessonTitle}
                                                    </option>
                                                ))}
                                            </Select>
                                        ) : (
                                            <Text fontSize="lg">
                                                <strong>Bài học: </strong> {lessons.find(l => l.lessonID === Number(problem.selectedLessonID))?.lessonTitle || "Chưa chọn"}
                                            </Text>
                                        )}
                                        <IconButton
                                            aria-label="Edit"
                                            icon={<MdEdit />}
                                            ml={2}
                                            size="sm"
                                            onClick={() => handleEdit('lesson')}
                                        />
                                    </Flex>
                                </VStack>
                            </GridItem>
                        </Grid>
                    </VStack>
                    <Flex justifyContent="flex-end" mt={6}>
                        <Button
                            variant="solid"
                            size="lg"
                            colorScheme="teal"
                            borderRadius="xl"
                            px={10}
                            boxShadow="lg"
                            bgGradient="linear(to-l, green.500, green.300)"
                            transition="all 0.2s ease-in-out"
                            _hover={{
                                color: "white",
                                transform: "scale(1.05)",
                            }}
                            _active={{
                                transform: "scale(0.90)",
                            }}
                            onClick={handleSave}
                            isLoading={loading}
                            loadingText="Đang lưu..."

                        >
                            Lưu
                        </Button>
                    </Flex>
                </Box>
            </Box>
        </ScrollToTop>

    );
};

export default ProblemDetail;
