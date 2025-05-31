import React, { useEffect, useState, useCallback, useRef } from "react";
import {
    Box,
    Text,
    VStack,
    Divider,
    Flex,
    Grid,
    GridItem,
    Button,
    Image,
    Input,
    IconButton,
    useToast,
    Select,
    Skeleton,
    useColorMode,
    List, ListItem,
    useDisclosure,
    Spinner,
} from "@chakra-ui/react";
import { NavLink, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { MdOutlineArrowBack, MdEdit } from "react-icons/md";
import ScrollToTop from "@/components/scroll/ScrollToTop";
import JoditEditor from "jodit-react";
import sanitizeHtml from "@/utils/sanitizedHTML";
import Editor from "@/utils/configEditor";
import "moment/locale/vi";
//import api
import { getDetail, updateItem, getList } from "@/config/apiService";
import { formatDateTime, formatCurrency } from "@/utils/utils";
import api from "@/config/apiConfig";
import ReviewList from "./ReviewList";
import ToolDetail from "@/components/navbar/ToolDetail";
import EnrollmentList from "./EnrollmentList";


const CourseDetail = () => {
    const { id } = useParams();
    const editor = useRef(null);
    const [selectedCoder, setSelectedCoder] = useState(null);
    const { isOpen: isReviewOpen, onOpen: onReviewOpen, onClose: onReviewClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const cancelRef = useRef();
    const [isDeleting, setIsDeleting] = useState(false);

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
    const navColor = colorMode === 'light' ? 'white' : 'navy.800';
    const listColor = colorMode === 'light' ? 'gray.200' : 'whiteAlpha.300';

    const fetchCourseDetail = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getDetail({ controller: "Course", id });
            setCourseDetail(data || []);
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
        } finally {
            setLoading(false);
        }
    }, [id, toast]);

    const fetchCategories = async () => {
        setLoading(true);
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
        finally {
            setLoading(false);
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

    const confirmDelete = (coderID) => {
        setSelectedCoder(coderID);
        onDeleteOpen();
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await handleRemoveEnroll(selectedCoder);
            onClose();
        } finally {
            setIsDeleting(false);
        }
    };

    const handleRemoveEnroll = async (coderId) => {
        try {
            const res = await api.delete("/Enrollment", {
                data: {
                    courseID: id,
                    coderID: coderId
                }
            });

            if (res.status === 200) {
                toast({
                    title: "Đã xóa người dùng ra khỏi khóa học",
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                    position: "top",
                    variant: "top-accent",
                });
                await fetchCourseDetail();
            }
        } catch (error) {
            console.error("Lỗi fetch course detail:", error);  // Thêm log lỗi
            toast({
                title: "Lỗi xóa",
                description: error.response?.data?.message || "Có lỗi xảy ra",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top",
                variant: "top-accent",
            });
        }
    };

    if (!course) {
        return (
            <Flex
                h="100vh"
                w="100%"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
            >
                <Spinner thickness='4px' speed='0.55s' color='blue.500' size='xl' />
            </Flex>
        );
    }
    return (
        <ScrollToTop>
            <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }} justify="center" alignItems="center" position="relative">
                <Box pt={{ base: "130px", md: "80px", xl: "80px" }} px="10px">
                    <Box
                        bg={boxColor}
                        p={{ base: "4", md: "6" }}  // Padding responsive
                        borderRadius="lg"
                        boxShadow="lg"
                        w={{ base: "100%", md: "100vh" }}
                        minW="110vh"
                        mx="auto"
                    >
                        <Flex justifyContent="end" align="end" px={{ base: "10px", md: "25px" }}>
                            <ToolDetail offsetTop="15" bg={navColor} borderRadius="lg">
                                <Button
                                    onClick={() => navigate(`/admin/course`)}
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
                                <Button
                                    size="lg"
                                    variant="solid"
                                    colorScheme="blue"
                                    px={5}
                                    onClick={onReviewOpen}
                                    borderRadius="xl"
                                    boxShadow="lg"
                                    transition="all 0.2s ease-in-out"
                                    _hover={{
                                        color: "white",
                                        transform: "scale(1.05)",
                                    }}
                                    _active={{
                                        transform: "scale(0.90)",
                                    }}
                                >
                                    Xem đánh giá
                                </Button>
                                <ReviewList
                                    courseId={id}
                                    isOpen={isReviewOpen}
                                    onClose={onReviewClose}
                                />
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
                            </ToolDetail>
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
                                        </Text>
                                        <Box overflowY={"auto"} maxHeight="300px" sx={{ wordBreak: "break-word" }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(course?.description) }} />
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
                            {/* Overview field */}
                            <Flex align="center" justifyContent="center">
                                {editField === "overview" ? (
                                    <Box width="100%" overflowY={"auto"}>
                                        <JoditEditor
                                            ref={editor}
                                            value={editableValues.overview}
                                            config={Editor}
                                            onChange={(newContent) => handleInputChange("overview", newContent)}
                                            autoFocus
                                            height="1000px"  // Thay đổi giá trị ở đây
                                            style={{ width: "100%", minHeight: "1000px" }}  // Cập nhật style nếu cần
                                        />

                                    </Box>
                                ) : (
                                    <Box width="max-content">
                                        <Text fontSize="lg" textAlign="center">
                                            <strong>Nội dung bài học:</strong>
                                        </Text>
                                        <Box overflowY={"auto"} maxHeight="300px" sx={{ wordBreak: "break-word" }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(course?.overview) }} />
                                    </Box>
                                )}
                                <IconButton
                                    aria-label="Edit"
                                    icon={<MdEdit />}
                                    ml={2}
                                    size="sm"
                                    onClick={() => handleEdit("overview")}
                                    cursor="pointer"
                                />
                            </Flex>
                        </VStack>
                    </Box>
                </Box>
                {/* Thông tin danh sách topic */}
                <Box
                    px="25px"
                    position="fixed"
                    top="14vh"
                    right="2vh"
                    display={{ base: "none", md: "none", xl: "block" }}
                >
                    <Box
                        bg={boxColor}
                        p={{ base: "4", md: "6" }}  // Padding responsive
                        borderRadius="lg"
                        boxShadow="lg"
                        w={{ base: "100%", md: "50vh" }}
                        minH="40vh"
                        mx="auto"
                        overflow="auto"
                        overflowY="auto"
                    >
                        <Text align={'center'} fontSize={25} mb={5} fontWeight={'bold'}>Danh sách chủ đề</Text>
                        <List spacing={4}>
                            {course.topics.map((topic, index) => (
                                <NavLink to={`/admin/topic/detail/${topic.topicID}`} key={topic.topicID}>
                                    <ListItem key={topic.topicID} p={2} bg={listColor} borderRadius="md" my={2}
                                        _hover={{ transform: "translateY(-5px)" }}
                                        transition="transform 0.1s ease-in-out"
                                    >
                                        <Text as="span" fontWeight="bold">Chủ đề {index + 1}:</Text> {topic.topicName}
                                    </ListItem>
                                </NavLink>
                            ))}
                        </List>
                    </Box>
                </Box>
                {/* Thông tin danh sách coder enrolled - Updated */}
                <Box
                    px="25px"
                    position="fixed"
                    bottom="10px"
                    right="2vh"
                    display={{ base: "none", md: "none", xl: "block" }}
                >
                    <Box
                        bg={boxColor}
                        p={{ base: "4", md: "6" }}
                        borderRadius="lg"
                        boxShadow="lg"
                        w={{ base: "100%", md: "50vh" }}
                        minH="40vh"
                        maxH="70vh" // Add max height to prevent overflow
                        mx="auto"
                        overflow="hidden" // Change to hidden since EnrollmentList handles scroll
                    >
                        <Text align="center" fontSize={25} mb={1} fontWeight="bold">
                            Danh sách người đăng ký
                        </Text>

                        {/* Replace the old List with new EnrollmentList component */}
                        <Box
                            maxH="calc(70vh - 100px)" // Calculate height minus header
                            overflowY="auto"
                            pr={2} // Add padding for scrollbar
                        >
                            <EnrollmentList
                                courseID={id}
                                onEnrollmentDeleted={(coderID) => {
                                    // Optional: Trigger any additional updates needed
                                    console.log('Enrollment deleted for coder:', coderID);
                                    // You might want to update course stats or other related data
                                }}
                                pageSize={10}
                                sortField="enrolledAt"
                                ascending={false}
                            />
                        </Box>
                    </Box>
                </Box>
            </Grid>
        </ScrollToTop>

    );
};

export default CourseDetail;
