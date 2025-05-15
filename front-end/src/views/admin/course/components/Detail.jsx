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
    Image,
    Input,
    IconButton,
    useToast,
    Select,
    Skeleton,
    useColorMode,
    List, ListItem
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { MdOutlineArrowBack, MdEdit } from "react-icons/md";
import ScrollToTop from "@/components/scroll/ScrollToTop";
import ProgressBar from "@/components/loading/loadingBar";
import JoditEditor from "jodit-react";
import sanitizeHtml from "@/utils/sanitizedHTML";
import Editor from "@/utils/configEditor";
import "moment/locale/vi";
//import api
import { getDetail, updateItem, getList } from "@/config/apiService";
import { formatDateTime, formatCurrency } from "@/utils/utils";



const CourseDetail = () => {
    const { id } = useParams();
    const editor = useRef(null);
    const [courseCategories, setCourseCategories] = useState([]);
    const [badge, setBadge] = useState([]);
    const [course, setCourseDetail] = useState(null);
    const [editField, setEditField] = useState(null);
    const [editableValues, setEditableValues] = useState({});
    const [avatarFile, setAvatarFile] = useState(null);
    const navigate = useNavigate();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [avatarLoaded, setAvatarLoaded] = useState(false);
    const { colorMode } = useColorMode(); // Lấy trạng thái chế độ màu
    const textColor = colorMode === 'light' ? 'black' : 'white';
    const boxColor = colorMode === 'light' ? 'white' : 'whiteAlpha.300';


    const fetchCourseDetail = useCallback(async () => {
        try {
            const data = await getDetail({ controller: "Course", id });
            setCourseDetail(data);
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

    const fetchCategories = async () => {
        try {
            const courseCategory = await getList({ controller: "CourseCategory", page: 1, pageSize: 10 });
            const badge = await getList({ controller: "Badge", page: 1, pageSize: 10 });
            setCourseCategories(courseCategory.data);
            setBadge(badge.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh mục khóa học:", error);
            setCourseCategories([]);
            setBadge([]);
        }
    };
    useEffect(() => {
        if (id) {
            fetchCourseDetail();
            fetchCategories();
        }
    }, [id, fetchCourseDetail]);


    const handleEdit = (field) => {
        setEditField(field);
    };

    const handleInputChange = (field, value) => {
        setEditableValues((prev) => {
            const updatedValues = { ...prev, [field]: value };
            setCourseDetail((prevCourseDetail) => ({
                ...prevCourseDetail,
                [field]: value,
            }));
            return updatedValues;
        });
    };

    const handleImgChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                setEditableValues((prev) => ({ ...prev, avatar: reader.result }));

                const formData = new FormData();
                formData.append("CourseID", id);
                formData.append("ImageFile", file);

                // ✅ Thêm CourseName nếu có
                if (editableValues.courseName) {
                    formData.append("CourseName", editableValues.courseName);
                }

                try {
                    await updateItem({ controller: "Course", id: id, data: formData });
                    await fetchCourseDetail();
                    toast({
                        title: "Cập nhật avatar thành công!",
                        status: "success",
                        duration: 2000,
                        isClosable: true,
                        position: "top",
                        variant: "left-accent",
                    });
                } catch (error) {
                    console.error("Đã xảy ra lỗi khi cập nhật avatar", error);
                    toast({
                        title: "Đã xảy ra lỗi khi cập nhật avatar.",
                        status: "error",
                        duration: 2000,
                        isClosable: true,
                        position: "top",
                        variant: "left-accent",
                    });
                }
            };
            reader.readAsDataURL(file);
            setAvatarFile(file);
        }
    };


    const handleSave = async () => {
        setLoading(true);  // Bật trạng thái loading khi gửi yêu cầu
        try {
            const formData = new FormData();

            // Lưu tất cả các trường đã chỉnh sửa.
            Object.keys(editableValues).forEach((field) => {
                // Kiểm tra để tránh đính kèm CourseID trong formData
                if (field !== "CourseID") {
                    formData.append(field, editableValues[field]);
                }
            });

            // Nếu có file avatar, đính kèm vào formData
            if (avatarFile) {
                formData.append("ImageFile", avatarFile);
            }

            // Cập nhật CourseDetail sau khi chỉnh sửa
            setCourseDetail((prev) => ({
                ...prev,
                ...editableValues,
            }));

            // Gọi API PUT để cập nhật dữ liệu
            await updateItem({ controller: "Course", id: id, data: formData });
            await fetchCourseDetail();
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

    if (!course) {
        return (
            <ProgressBar />
        );
    }
    return (
        <ScrollToTop>
            <Flex direction={{ base: "column", md: "row" }} justify="center" alignItems="center">
                <Box pt={{ base: "130px", md: "80px", xl: "80px" }} px="10px">
                    <Box
                        bg={boxColor}
                        p={{ base: "4", md: "6" }}  // Padding responsive
                        borderRadius="lg"
                        boxShadow="lg"
                        w={{ base: "100%", md: "100vh" }}
                        maxW="500vh"
                        mx="auto"
                    >
                        <Flex justifyContent="end" align="end" px={{ base: "10px", md: "25px" }}>
                            <Link>
                                <Button
                                    onClick={() => navigate(`/admin/course`)}
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
                            {/* Avatar Section */}
                            <Flex direction="column" align="center">
                                <Skeleton
                                    isLoaded={avatarLoaded}
                                    borderRadius="md"
                                    w="50%"
                                    h="150px"
                                    mb={4}
                                >
                                    <Image
                                        src={editableValues.imageUrl || course.imageUrl || "/avatarSimmmple.png"}
                                        alt="Course Avatar"
                                        w="100%"
                                        h="150px"
                                        borderRadius="md"
                                        objectFit="cover"
                                        transition="all 0.2s ease-in-out"
                                        _hover={{ transform: "scale(1.05)" }}
                                        onClick={() => document.getElementById("avatarInput").click()}
                                        onLoad={() => setAvatarLoaded(true)}
                                        cursor="pointer"
                                    />
                                </Skeleton>
                                <Input
                                    id="avatarInput"
                                    type="file"
                                    onChange={handleImgChange}
                                    display="none"
                                />
                            </Flex>
                            <Divider />
                            {/* Responsive Grid: 1 column on mobile, 2 columns on md+ */}
                            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
                                {/* Left Column */}
                                <GridItem borderRightWidth={2}>
                                    <Text align={'center'} fontSize={25} mb={5} fontWeight={'bold'}>Thông tin khóa học</Text>
                                    <VStack align="stretch" ps={{ base: "0", md: "20px" }} spacing={4}>
                                        {["courseName", "fee", "originalFee"].map((field) => (
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
                                                            {field === "courseName"
                                                                ? "Tên khóa học"
                                                                : field === "fee"
                                                                    ? "Giá tiền"
                                                                    : "Giá tiền gốc"}:
                                                        </strong>{" "}
                                                        {field === "fee" || field === "originalFee"
                                                            ? formatCurrency(course[field])
                                                            : course[field] || "Chưa có thông tin"}
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
                                        <Text fontSize="lg">
                                            <strong>Phần trăm giảm: </strong><Text as={'span'} fontWeight={'bold'} color={'red'} >{course.discountPercent} %</Text>
                                        </Text>
                                        {/* Chọn loại khóa học field */}
                                        <Flex align="center">
                                            {editField === "courseCategory" ? (
                                                <Select
                                                    value={editableValues.courseCategoryID || ""}
                                                    onBlur={() => setEditField(null)}
                                                    autoFocus
                                                    onChange={(e) => handleInputChange("courseCategoryID", e.target.value)}
                                                    placeholder="Chọn loại khóa học"
                                                    width={{ base: "100%", md: "50%" }}
                                                >
                                                    {courseCategories.map((category) => (
                                                        <option key={category.courseCategoryID} value={category.courseCategoryID}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </Select>
                                            ) : (
                                                <Text fontSize="lg">
                                                    <strong>Loại khóa học:</strong> {courseCategories.find(c => c.courseCategoryID === Number(course.courseCategoryID))?.name || "Chưa chọn"}
                                                </Text>

                                            )}
                                            <IconButton
                                                aria-label="Edit"
                                                icon={<MdEdit />}
                                                ml={2}
                                                size="sm"
                                                onClick={() => handleEdit("courseCategory")}
                                                cursor="pointer"
                                            />
                                        </Flex>
                                        {/* Chọn badge field */}
                                        <Flex align="center">
                                            {editField === "badge" ? (
                                                <Select
                                                    value={editableValues.badgeID || ""}
                                                    onBlur={() => setEditField(null)}
                                                    autoFocus
                                                    onChange={(e) => handleInputChange("badgeID", e.target.value)}
                                                    placeholder="Chọn nhãn"
                                                    width={{ base: "100%", md: "50%" }}
                                                >
                                                    {badge.map((badge) => (
                                                        <option key={badge.badgeID} value={badge.badgeID}>
                                                            {badge.name}
                                                        </option>
                                                    ))}
                                                </Select>
                                            ) : (
                                                <Text fontSize="lg">
                                                    <strong>Nhãn:</strong> {badge.find(c => c.badgeID === Number(course.badgeID))?.name || "Chưa chọn"}
                                                </Text>
                                            )}
                                            <IconButton
                                                aria-label="Edit"
                                                icon={<MdEdit />}
                                                ml={2}
                                                size="sm"
                                                onClick={() => handleEdit("badge")}
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
                                            <strong>Ngày tạo: </strong>{formatDateTime(course.createdAt)}
                                        </Text>
                                        <Text fontSize="lg">
                                            <strong>Người tạo: </strong> {course.creatorName}
                                        </Text>
                                        {course.updatedAt && (
                                            <>
                                                <Text fontSize="lg">
                                                    <strong>Ngày cập nhật: </strong>{formatDateTime(course.updatedAt)}
                                                </Text>
                                                <Text fontSize="lg">
                                                    <strong>Người cập nhật: </strong> {course.creatorName}
                                                </Text>
                                            </>
                                        )}
                                    </VStack>
                                </GridItem>
                            </Grid>
                            <Divider />
                            {/* Description field */}
                            <Flex align="center" justifyContent="center">
                                {editField === "description" ? (
                                    <Box width="100%" overflowY={"auto"}>
                                        <JoditEditor
                                            ref={editor}
                                            value={editableValues.description}
                                            config={Editor}
                                            onChange={(newContent) => handleInputChange("description", newContent)}
                                            autoFocus
                                            height="1000px"  // Thay đổi giá trị ở đây
                                            style={{ width: "100%", minHeight: "1000px" }}  // Cập nhật style nếu cần
                                        />

                                    </Box>
                                ) : (
                                    <Box width="max-content">
                                        <Text fontSize="lg">
                                            <strong>Nội dung bài học:</strong>
                                            <Box overflowY={"auto"} maxHeight="300px" sx={{ wordBreak: "break-word" }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(course?.description) }} />
                                        </Text>
                                    </Box>
                                )}
                                <IconButton
                                    aria-label="Edit"
                                    icon={<MdEdit />}
                                    ml={2}
                                    size="sm"
                                    onClick={() => handleEdit("description")}
                                    cursor="pointer"
                                />
                            </Flex>
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
                {/* Thông tin danh sách topic */}
                <Box pt={{ base: "130px", md: "80px", xl: "80px" }} px="25px">
                    <Box
                        bg={boxColor}
                        p={{ base: "4", md: "6" }}  // Padding responsive
                        borderRadius="lg"
                        boxShadow="lg"
                        w={{ base: "100%", md: "50vh" }}
                        maxH="60vh"
                        mx="auto"
                    >
                        <Text align={'center'} fontSize={25} mb={5} fontWeight={'bold'}>Danh sách chủ đề</Text>
                        <List spacing={3}>
                            {course.topics.map((topic, index) => (
                                <ListItem key={topic.topicID} p={2} bg="gray.100" borderRadius="md">
                                    <Text as="span" fontWeight="bold">Chủ đề {index + 1}:</Text> {topic.topicName}
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Box>
            </Flex>
        </ScrollToTop>

    );
};

export default CourseDetail;
