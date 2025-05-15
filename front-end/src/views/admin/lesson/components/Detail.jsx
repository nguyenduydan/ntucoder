import React, { useEffect, useState, useCallback, useRef } from "react";
import {
    Box,
    Text,
    VStack,
    Divider,
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
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { MdOutlineArrowBack, MdEdit } from "react-icons/md";
import ScrollToTop from "@/components/scroll/ScrollToTop";
import ProgressBar from "@/components/loading/loadingBar";
import "moment/locale/vi";
import JoditEditor from "jodit-react";
import sanitizeHtml from "@/utils/sanitizedHTML";
//import API
import { getDetail, updateItem, getList } from "@/config/apiService";
import Editor from "@/utils/configEditor";
import { formatDateTime, formatCurrency } from "@/utils/utils";


const LessonDetail = () => {
    const { id } = useParams();
    const editor = useRef(null);
    const [topic, setTopic] = useState([]);
    const [lesson, setLessonDetail] = useState(null);
    const [editField, setEditField] = useState(null);
    const [editableValues, setEditableValues] = useState({});
    const navigate = useNavigate();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const { colorMode } = useColorMode(); // Lấy trạng thái chế độ màu
    const textColor = colorMode === 'light' ? 'black' : 'white';
    const boxColor = colorMode === 'light' ? 'white' : 'whiteAlpha.300';

    const fetchLessonDetail = useCallback(async () => {
        try {
            const data = await getDetail({ controller: "Lesson", id: id });
            setLessonDetail(data);
            setEditableValues(data);
        } catch (error) {
            console.log("Lỗi:", error);
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

    const fetchTopic = async () => {
        try {
            const topicData = await getList({ controller: "Topic", page: 1, pageSize: 10 });
            setTopic(topicData.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh mục khóa học:", error);
            setTopic([]);
        }
    };
    useEffect(() => {
        if (id) {
            fetchLessonDetail();
            fetchTopic();
        }
    }, [id, fetchLessonDetail]);


    const handleEdit = (field) => {
        setEditField(field);
    };

    const handleInputChange = (field, value) => {
        console.log(`Thay đổi trường ${field}:`, value);
        setEditableValues((prev) => {
            const updatedValues = { ...prev, [field]: value };
            setLessonDetail((prevLessonDetail) => ({
                ...prevLessonDetail,
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
                // Kiểm tra để tránh đính kèm LessonID trong formData
                if (field !== "LessonID") {
                    formData.append(field, editableValues[field]);
                }
            });

            // Cập nhật LessonDetail sau khi chỉnh sửa
            setLessonDetail((prev) => ({
                ...prev,
                ...editableValues,
            }));

            // Gọi API PUT để cập nhật dữ liệu
            await updateItem({ controller: "Lesson", id: id, data: formData });
            await fetchLessonDetail();
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

    if (!lesson) {
        return (
            <ProgressBar />
        );
    }
    return (
        <ScrollToTop>
            <Box pt={{ base: "130px", md: "80px", xl: "80px" }} px="25px">
                <Box
                    bg={boxColor}
                    p={{ base: "4", md: "6" }}  // Padding responsive
                    borderRadius="lg"
                    boxShadow="lg"
                    maxW="1000px"
                    w="100%"
                    mx="auto"
                >
                    <Flex justifyContent="end" align="end" px={{ base: "10px", md: "25px" }}>
                        <Link>
                            <Button
                                onClick={() => navigate(`/admin/lesson`)}
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
                        <Divider />
                        {/* Responsive Grid: 1 column on mobile, 2 columns on md+ */}
                        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
                            {/* Left Column */}
                            <GridItem borderRightWidth={2}>
                                <Text align={'center'} fontSize={25} mb={5} fontWeight={'bold'}>Thông tin bài học</Text>
                                <VStack align="stretch" ps={{ base: "0", md: "20px" }} spacing={4}>
                                    {["lessonTitle"].map((field) => (
                                        <Flex key={field} align="center">
                                            {editField === field ? (
                                                <Input
                                                    textColor={textColor}
                                                    value={editableValues[field] || ""}
                                                    onChange={(e) => handleInputChange(field, e.target.value)}
                                                    placeholder={`Chỉnh sửa ${field}`}
                                                    onBlur={() => setEditField(null)}
                                                    autoFocus
                                                />
                                            ) : (
                                                <Text fontSize="lg" textColor={textColor}>
                                                    <strong>
                                                        {field === "lessonTitle"
                                                            ? "Tên bài học"
                                                            : field === "fee"
                                                                ? "Giá tiền"
                                                                : "Giá tiền gốc"}:
                                                    </strong>{" "}
                                                    {field === "fee" || field === "originalFee"
                                                        ? formatCurrency(lesson[field])
                                                        : lesson[field] || "Chưa có thông tin"}
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
                                    ))}

                                    <Flex align="center">
                                        {editField === "topic" ? (
                                            <Select
                                                value={editableValues.topicID || ""}
                                                onBlur={() => setEditField(null)}
                                                autoFocus
                                                onChange={(e) => handleInputChange("topicID", e.target.value)}
                                                placeholder="Chọn chủ đề"
                                                width="100%"
                                            >
                                                {topic.map((topic) => (
                                                    <option key={topic.topicID} value={topic.topicID}>{topic.topicName}</option>
                                                ))}
                                            </Select>
                                        ) : (
                                            <Text fontSize="lg">
                                                <strong>Chọn chủ đề:</strong> {topic.find(c => c.topicID === Number(editableValues.topicID))?.topicName || "Chưa chọn"}
                                            </Text>
                                        )}
                                        <IconButton
                                            aria-label="Edit"
                                            icon={<MdEdit />}
                                            ml={2}
                                            size="sm"
                                            onClick={() => handleEdit("topic")}
                                            cursor="pointer"
                                        />
                                    </Flex>
                                </VStack>
                            </GridItem>

                            {/* Right Column */}
                            <GridItem>
                                <Text align={'center'} fontSize={25} mb={5} fontWeight={'bold'}>Thông tin khác</Text>
                                <VStack align="stretch" ps={{ base: "0", md: "20px" }} spacing={4}>
                                    <Flex align="center">
                                        {editField === "order" ? (
                                            <Select
                                                value={editableValues.order || ""}
                                                onBlur={() => setEditField(null)}
                                                autoFocus
                                                onChange={(e) => handleInputChange("order", e.target.value)}
                                                placeholder="Chọn cấp"
                                                width={{ base: "100%", md: "50%" }}
                                            >
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                            </Select>
                                        ) : (
                                            <Text fontSize="lg">
                                                <strong>Chọn cấp:</strong> {lesson.order || "0"}
                                            </Text>
                                        )}
                                        <IconButton
                                            aria-label="Edit"
                                            icon={<MdEdit />}
                                            ml={2}
                                            size="sm"
                                            onClick={() => handleEdit("order")}
                                            cursor="pointer"
                                        />
                                    </Flex>
                                    <Text fontSize="lg">
                                        <strong>Ngày tạo: </strong>{formatDateTime(lesson.createdAt)}
                                    </Text>
                                    {lesson.updatedAt && (
                                        <>
                                            <Text fontSize="lg">
                                                <strong>Ngày cập nhật: </strong>{formatDateTime(lesson.updatedAt)}
                                            </Text>
                                        </>
                                    )}
                                </VStack>
                            </GridItem>
                        </Grid>
                        {/* Đặt lessonContent vào một Box riêng biệt */}
                        <Box width="100%" borderTopWidth={2} pt={5} px={5}>
                            <Flex align="center">
                                {editField === "lessonContent" ? (
                                    <Box width="100%" overflowY={"auto"} maxHeight="500px">
                                        <JoditEditor
                                            ref={editor}
                                            value={editableValues.lessonContent}
                                            config={Editor}
                                            onChange={(newContent) => handleInputChange("lessonContent", newContent)}
                                            autoFocus
                                        />
                                    </Box>
                                ) : (
                                    <Box width="max-content">
                                        <Text fontSize="lg">
                                            <strong>Nội dung bài học:</strong>
                                            <Box overflowY={"auto"} maxHeight="300px" sx={{ wordBreak: "break-word" }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(lesson?.lessonContent) }} />
                                        </Text>
                                    </Box>
                                )}
                                <IconButton
                                    aria-label="Edit"
                                    icon={<MdEdit />}
                                    ml={2}
                                    size="sm"
                                    onClick={() => handleEdit("lessonContent")}
                                    cursor="pointer"
                                />
                            </Flex>
                        </Box>
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

export default LessonDetail;
