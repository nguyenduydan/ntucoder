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
    Box,
    Divider,
} from "@chakra-ui/react";
import FlushedInput from "@/components/fields/InputField";
import ImageInput from "@/components/fields/ImageInput";
import JoditEditor from "jodit-react";
import Editor from "@/utils/configEditor";
import { createItem, getList } from "@/config/apiService";

export default function CreateCourseModal({ isOpen, onClose, fetchData }) {
    const editor = useRef(null);
    const [course, setCourse] = useState({
        coderID: "",
        courseName: "",
        courseCategoryID: "",
        fee: "",
        originalFee: "",
        isCombo: false,
        badgeID: "",
        status: 0,
        description: "",
        overview: "",
        imageFile: null,
    });
    const [courseCategories, setCourseCategories] = useState([]);
    const [badge, setBadge] = useState([]);
    const [errors, setErrors] = useState({});
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const { colorMode } = useColorMode();
    const textColor = colorMode === 'light' ? 'black' : 'white';
    const boxColor = colorMode === 'light' ? 'gray.100' : 'whiteAlpha.100';

    useEffect(() => {
        if (isOpen) {
            setCourse({
                coderID: "1",
                courseName: "",
                courseCategoryID: "",
                fee: 0,
                originalFee: 0,
                isCombo: false,
                badgeID: "",
                status: 0,
                description: "",
                overview: "",
                imageFile: null,
            });
            setErrors({});
            fetchCategories(); // Gọi hàm lấy danh mục khóa học khi modal mở
        }
    }, [isOpen]);

    const fetchCategories = async () => {
        try {
            const courseCategory = await getList({ controller: "CourseCategory", page: 1, pageSize: 10 });
            const badge = await getList({ controller: "Badge", page: 1, pageSize: 10 });
            setCourseCategories(courseCategory.data);
            setBadge(badge.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh mục khóa học:", error);
            setCourseCategories([]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourse((prev) => ({
            ...prev,
            [name]: name === "status" ? parseInt(value, 10) : value,
        }));
    };

    const validate = () => {
        let newErrors = {};
        if (!course.courseName) newErrors.courseName = "Tên khóa học không được bỏ trống";
        if (!course.courseCategoryID) newErrors.courseCategoryID = "Vui lòng chọn danh mục khóa học";
        if (course.fee < 0) newErrors.fee = "Học phí phải là số dương";
        if (course.originalFee < 0) newErrors.originalFee = "Học phí gốc phải là số dương";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleEditorChange = (field, content) => {
        setCourse((prev) => ({
            ...prev,
            [field]: content,
        }));
    };
    const handleSubmit = async () => {
        if (!validate()) return;
        setLoading(true);

        // Tạo FormData để gửi dữ liệu
        const formData = new FormData();
        formData.append("coderID", course.coderID);
        formData.append("courseName", course.courseName);
        formData.append("courseCategoryID", course.courseCategoryID);
        formData.append("fee", course.fee);
        formData.append("originalFee", course.originalFee);
        formData.append("isCombo", course.isCombo);
        formData.append("badgeID", course.badgeID);
        formData.append("status", course.status);
        formData.append("description", course.description);
        formData.append("overview", course.overview);

        // Nếu có file ảnh, thêm vào FormData
        if (course.imageFile) {
            formData.append("imageFile", course.imageFile);
        }
        try {
            await createItem({ controller: "Course", data: formData }); // Gửi FormData lên backend

            toast({
                title: 'Thêm mới khóa học thành công!',
                status: 'success',
                duration: 2000,
                isClosable: true,
                position: 'top',
                variant: "left-accent",
            });

            if (fetchData) await fetchData();
            onClose();
        } catch (error) {
            let errorMessage = "Đã xảy ra lỗi. Vui lòng thử lại.";

            // Kiểm tra xem lỗi có phải đến từ API không
            if (error.response && error.response.data) {
                errorMessage = error.response.data.message || "Lỗi không xác định từ server.";
            } else if (error.message) {
                errorMessage = error.message; // Nếu lỗi không phải từ API, lấy message mặc định
            }

            // Hiển thị thông báo lỗi
            toast({
                title: "Đã xảy ra lỗi.",
                description: errorMessage,
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
        <Modal size={'4xl'} isOpen={isOpen} onClose={onClose} scrollBehavior="inside" isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader fontSize={'25px'} textAlign={'center'}>Thêm mới khóa học</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl mb={6}>
                        <FormLabel textAlign="center" fontWeight="bold">Ảnh khóa học</FormLabel>
                        <ImageInput
                            label="chọn ảnh đại diện"
                            previewWidth="40vh"
                            previewHeight="20vh"
                        />
                    </FormControl>
                    <Divider my={3} />
                    <Grid templateColumns="repeat(2, 1fr)" gap="6">
                        <GridItem>
                            <FormControl isInvalid={errors.courseName} mb={4}>
                                <FormLabel fontWeight="bold">Tên khóa học<Text as="span" color="red.500"> *</Text></FormLabel>
                                <FlushedInput bg={boxColor} placeholder="Nhập tên khóa học" name="courseName" value={course.courseName} onChange={handleChange} textColor={textColor} />
                                <FormErrorMessage>{errors.courseName}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.fee} mb={4}>
                                <FormLabel fontWeight="bold">Học phí hiện tại</FormLabel>
                                <FlushedInput bg={boxColor} type="number" placeholder="Nhập học phí" name="fee" value={course.fee} onChange={handleChange} textColor={textColor} />
                                <FormErrorMessage>{errors.fee}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.originalFee} mb={4}>
                                <FormLabel fontWeight="bold">Học phí gốc</FormLabel>
                                <FlushedInput bg={boxColor} type="number" placeholder="Nhập học phí" name="originalFee" value={course.originalFee} onChange={handleChange} textColor={textColor} />
                                <FormErrorMessage>{errors.originalFee}</FormErrorMessage>
                            </FormControl>

                        </GridItem>
                        <GridItem>
                            <FormControl isInvalid={errors.courseCategoryID} mb={4}>
                                <FormLabel fontWeight="bold">Loại khóa học<Text as="span" color="red.500"> *</Text></FormLabel>
                                <Select bg={boxColor} name="courseCategoryID" value={course.courseCategoryID} onChange={handleChange} textColor={textColor}>
                                    <option key="0" value="">Chọn loại khóa học</option>
                                    {courseCategories.map((category) => (
                                        <option key={category.courseCategoryID} value={category.courseCategoryID}>{category.name}</option>
                                    ))}
                                </Select>
                                <FormErrorMessage>{errors.courseCategoryID}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.badgeID} mb={4}>
                                <FormLabel fontWeight="bold">Loại nhãn<Text as="span" color="red.500"> *</Text></FormLabel>
                                <Select bg={boxColor} name="badgeID" value={course.badgeID} onChange={handleChange} textColor={textColor}>
                                    <option key="0" value="">Chọn loại nhãn</option>
                                    {badge.map((badge) => (
                                        <option key={badge.badgeID} value={badge.badgeID}>{badge.name}</option>
                                    ))}
                                </Select>
                                <FormErrorMessage>{errors.badgeID}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.status}>
                                <FormLabel fontWeight="bold">Trạng thái</FormLabel>
                                <Select bg={boxColor} name="status" value={course.status} onChange={handleChange} textColor={textColor}>
                                    <option key="default" value="">Chọn trạng thái</option>
                                    <option key="online" value="1">Online</option>
                                    <option key="offline" value="0">Offline</option>
                                </Select>
                            </FormControl>
                        </GridItem>
                    </Grid>
                    <Divider my={3} />
                    <FormControl isInvalid={errors.description} mb={4}>
                        <FormLabel fontWeight="bold" textAlign="center">Mô tả</FormLabel>
                        <Box>
                            <JoditEditor
                                key={course.courseId + "-explanation"}
                                ref={editor}
                                value={course.description}
                                config={Editor}
                                onChange={(newContent) => handleEditorChange('description', newContent)}
                                onBlur={(newContent) => handleEditorChange('description', newContent)}
                            />
                        </Box>
                        <FormErrorMessage>{errors.description}</FormErrorMessage>
                    </FormControl>
                    <Divider my={3} />
                    <FormControl isInvalid={errors.overview} mb={4}>
                        <FormLabel fontWeight="bold" textAlign="center">Giới thiệu</FormLabel>
                        <JoditEditor
                            key={course.courseId + "-explanation"}
                            ref={editor}
                            value={course.overview}
                            config={Editor}
                            onChange={(newContent) => handleEditorChange('overview', newContent)}
                            onBlur={(newContent) => handleEditorChange('overview', newContent)}
                        />
                        <FormErrorMessage>{errors.overview}</FormErrorMessage>
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="gray" mr={3} onClick={onClose}>Hủy</Button>
                    <Button colorScheme="green" isLoading={loading} loadingText="Đang lưu..." onClick={handleSubmit}>Thêm</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
