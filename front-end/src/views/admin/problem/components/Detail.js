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
import ScrollToTop from "components/scroll/ScrollToTop";
import ProgressBar from "components/loading/loadingBar";
import JoditEditor from "jodit-react";
import sanitizeHtml from "utils/sanitizedHTML";
import Editor from "utils/configEditor";

import "moment/locale/vi";
//import api
import { getById, update } from "config/problemService";
import { getListCategory } from "config/categoryService";
import { getList } from "config/compilerService";



const ProblemDetail = () => {
    const { id } = useParams();
    const editor = useRef(null);

    const [problem, setProblemDetail] = useState(null);
    const [compiler, setCompiler] = useState([]);
    const [categories, setProblemCategories] = useState([]);

    const [editField, setEditField] = useState(null);
    const [editableValues, setEditableValues] = useState({});
    const testTypeMapping = {
        'Output Matching': 'Output Matching',
        'Validate Output': 'Validate Output',
    };

    const navigate = useNavigate();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const { colorMode } = useColorMode(); // Lấy trạng thái chế độ màu
    const textColor = colorMode === 'light' ? 'black' : 'white';
    const boxColor = colorMode === 'light' ? 'white' : 'whiteAlpha.300';


    const fetchProblemDetail = useCallback(async () => {
        try {
            const data = await getById(id);

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
            const compiler = await getList({ page: 1, pageSize: 10 });
            const category = await getListCategory({ page: 1, pageSize: 10 });
            setProblemCategories(category.data);
            setCompiler(compiler.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh mục khóa học:", error);
            setProblemCategories([]);
            setCompiler([]);
        }
    };
    useEffect(() => {
        if (id) {
            fetchProblemDetail();
            fetchListData();
        }
    }, [id, fetchProblemDetail]);


    const handleEdit = (field) => {
        console.log("Mở edit:", field, editableValues.selectedCategoryIDs);
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
            await update(id, formData);
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
                                onClick={() => navigate(`/admin/problem`)}
                                variant="solid"
                                size="lg"
                                colorScheme="messenger"
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
                                        {editField === 'testType' ? (
                                            <Select
                                                value={
                                                    editableValues.testType || problem.testType || ''
                                                }
                                                onBlur={() => setEditField(null)}
                                                onChange={(e) => handleInputChange("testType", e.target.value)}
                                                autoFocus
                                                width="50%"
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
                                </VStack>
                            </GridItem>

                            {/* Right Column */}
                            <GridItem>
                                <VStack align="stretch" spacing={4}>
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
                                                value={editableValues.testCompilerID || ""}
                                                onBlur={() => setEditField(null)}
                                                onChange={(e) => handleInputChange("testCompilerID", e.target.value)}
                                                autoFocus
                                                width={{ base: "100%", md: "50%" }}
                                            >
                                                {compiler.map((compiler) => (
                                                    <option key={compiler.compilerID} value={compiler.compilerID}>
                                                        {compiler.compilerName}
                                                    </option>
                                                ))}
                                            </Select>
                                        ) : (
                                            <Text fontSize="lg">
                                                <strong>Trình biên dịch:</strong> {compiler.find(c => c.compilerID === Number(problem.testCompilerID))?.compilerName || "Chưa chọn"}
                                            </Text>
                                        )}
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
                                        <Text fontSize="lg" fontWeight="bold">
                                            Code test:
                                        </Text>
                                        <IconButton
                                            aria-label="Edit"
                                            icon={<MdEdit />}
                                            ml={2}
                                            size="sm"
                                            onClick={() => handleEdit('testCode')}
                                        />
                                    </Flex>

                                    {editField === 'testCode' ? (
                                        <JoditEditor
                                            ref={editor}
                                            value={editableValues.testCode}
                                            config={Editor}
                                            onChange={(newContent) => handleInputChange("testCode", newContent)}
                                            autoFocus
                                            style={{ width: "100%", minHeight: "300px" }}
                                        />
                                    ) : (
                                        <Box p={2} bg="gray.200" borderRadius="md" overflowX="auto">
                                            <pre>
                                                <code>{problem.testCode || 'Chưa có'}</code>
                                            </pre>
                                        </Box>
                                    )}
                                </VStack>
                            </GridItem>
                        </Grid>
                    </VStack>
                    <Flex justifyContent="flex-end" mt={6}>
                        <Button
                            variant="solid"
                            size="lg"
                            colorScheme="messenger"
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
                            disabled={editField === null}
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
