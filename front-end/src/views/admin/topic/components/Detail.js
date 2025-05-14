import React, { useEffect, useState, useCallback } from "react";
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
import ScrollToTop from "components/scroll/ScrollToTop";
import ProgressBar from "components/loading/loadingBar";
import "moment/locale/vi";
import { formatDateTime, formatCurrency } from "utils/utils";
//import API
import { getList, getDetail, updateItem } from "config/apiService";


const TopicDetail = () => {
    const { id } = useParams();
    const [course, setCourse] = useState([]);
    const [topic, setTopicDetail] = useState(null);
    const [editField, setEditField] = useState(null);
    const [editableValues, setEditableValues] = useState({});
    const navigate = useNavigate();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const { colorMode } = useColorMode(); // Lấy trạng thái chế độ màu
    const textColor = colorMode === 'light' ? 'black' : 'white';
    const boxColor = colorMode === 'light' ? 'white' : 'whiteAlpha.300';


    const fetchTopicDetail = useCallback(async () => {
        try {
            const data = await getDetail({ controller: "Topic", id: id });
            setTopicDetail(data);
            setEditableValues(data);
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

    const fetchCourse = async () => {
        try {
            const course = await getList({ controller: "Course", page: 1, pageSize: 10 });
            setCourse(course.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh mục khóa học:", error);
            setCourse([]);
        }
    };
    useEffect(() => {
        if (id) {
            fetchTopicDetail();
            fetchCourse();
        }
    }, [id, fetchTopicDetail]);


    const handleEdit = (field) => {
        setEditField(field);
    };

    const handleInputChange = (field, value) => {
        setEditableValues((prev) => {
            const updatedValues = { ...prev, [field]: value };
            setTopicDetail((prevTopicDetail) => ({
                ...prevTopicDetail,
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
                // Kiểm tra để tránh đính kèm TopicID trong formData
                if (field !== "TopicID") {
                    formData.append(field, editableValues[field]);
                }
            });

            // Cập nhật TopicDetail sau khi chỉnh sửa
            setTopicDetail((prev) => ({
                ...prev,
                ...editableValues,
            }));

            // Gọi API PUT để cập nhật dữ liệu
            await updateItem({ controller: "Topic", id: id, data: formData });
            await fetchTopicDetail();
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

    if (!topic) {
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
                                onClick={() => navigate(`/admin/topic`)}
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
                        <Divider />
                        {/* Responsive Grid: 1 column on mobile, 2 columns on md+ */}
                        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
                            {/* Left Column */}
                            <GridItem borderRightWidth={2}>
                                <Text align={'center'} fontSize={25} mb={5} fontWeight={'bold'}>Thông tin chủ đề</Text>
                                <VStack align="stretch" ps={{ base: "0", md: "20px" }} spacing={4}>
                                    {["topicName"].map((field) => (
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
                                                        {field === "topicName"
                                                            ? "Tên chủ đề"
                                                            : field === "fee"
                                                                ? "Giá tiền"
                                                                : "Giá tiền gốc"}:
                                                    </strong>{" "}
                                                    {field === "fee" || field === "originalFee"
                                                        ? formatCurrency(topic[field])
                                                        : topic[field] || "Chưa có thông tin"}
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
                                    {/* Chọn loại khóa học field */}
                                    <Flex align="center">
                                        {editField === "course" ? (
                                            <Select
                                                value={editableValues.courseID || ""}
                                                onBlur={() => setEditField(null)}
                                                autoFocus
                                                onChange={(e) => handleInputChange("courseID", e.target.value)}
                                                placeholder="Chọn loại khóa học"
                                                width={{ base: "100%", md: "50%" }}
                                            >
                                                {course.map((course) => (
                                                    <option key={course.courseID} value={course.courseID}>
                                                        {course.courseName}
                                                    </option>
                                                ))}
                                            </Select>
                                        ) : (
                                            <Text fontSize="lg">
                                                <strong>Chọn khóa học:</strong> {course.find(c => c.courseID === Number(topic.courseID))?.courseName || "Chưa chọn"}
                                            </Text>

                                        )}
                                        <IconButton
                                            aria-label="Edit"
                                            icon={<MdEdit />}
                                            ml={2}
                                            size="sm"
                                            onClick={() => handleEdit("course")}
                                            cursor="pointer"
                                        />
                                    </Flex>
                                    {/* Description field */}
                                    <Flex align="center">
                                        {editField === "topicDescription" ? (
                                            <Input
                                                value={editableValues.topicDescription || ""}
                                                onChange={(e) => handleInputChange("topicDescription", e.target.value)}
                                                placeholder="Chỉnh sửa mô tả"
                                                onBlur={() => setEditField(null)}
                                                autoFocus
                                                textColor={textColor}
                                            />
                                        ) : (
                                            <Text fontSize="lg">
                                                <strong>Mô tả:</strong> {topic.topicDescription || "Chưa có thông tin"}
                                            </Text>
                                        )}
                                        <IconButton
                                            aria-label="Edit"
                                            icon={<MdEdit />}
                                            ml={2}
                                            size="sm"
                                            onClick={() => handleEdit("topicDescription")}
                                            cursor="pointer"
                                        />
                                    </Flex>
                                </VStack>
                            </GridItem>

                            {/* Right Column */}
                            <GridItem>
                                <Text align={'center'} fontSize={25} mb={5} fontWeight={'bold'}>Thông tin khác</Text>
                                <VStack align="stretch" ps={{ base: "0", md: "20px" }} spacing={4}>
                                    <Text fontSize="lg">
                                        <strong>Ngày tạo: </strong>{formatDateTime(topic.createdAt)}
                                    </Text>

                                    {topic.updatedAt && (
                                        <>
                                            <Text fontSize="lg">
                                                <strong>Ngày cập nhật: </strong>{formatDateTime(topic.updatedAt)}
                                            </Text>
                                        </>
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

export default TopicDetail;
