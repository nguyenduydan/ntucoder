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
    Box,
    Divider,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useColorMode,
    Select
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
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

    // ColorMode
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
            fetchCategories();
        }
    }, [isOpen]);

    const fetchCategories = async () => {
        try {
            const courseCategory = await getList({ controller: "CourseCategory", page: 1, pageSize: 100 });
            const badge = await getList({ controller: "Badge", page: 1, pageSize: 100 });
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

    // Handler cho menu chọn CourseCategoryID
    const handleCategoryMenuChange = (value) => {
        setCourse((prev) => ({
            ...prev,
            courseCategoryID: value,
        }));
        setErrors((prev) => ({
            ...prev,
            courseCategoryID: undefined,
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

        if (course.imageFile) {
            formData.append("imageFile", course.imageFile);
        }
        try {
            await createItem({ controller: "Course", data: formData });
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
            if (error.response && error.response.data) {
                errorMessage = error.response.data.message || "Lỗi không xác định từ server.";
            } else if (error.message) {
                errorMessage = error.message;
            }
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

    // Tạo options cho menu
    const courseCategoryOptions = [
        { value: "", label: "Chọn loại khóa học" },
        ...courseCategories.map(category => ({
            value: category.courseCategoryID,
            label: category.name
        }))
    ];
    const selectedCategory = courseCategoryOptions.find(opt => opt.value === course.courseCategoryID);

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
                            onImageChange={file => setCourse(prev => ({ ...prev, imageFile: file }))}
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
                            {/* Menu chọn loại khóa học */}
                            <FormControl isInvalid={errors.courseCategoryID} mb={4}>
                                <FormLabel fontWeight="bold">Loại khóa học<Text as="span" color="red.500"> *</Text></FormLabel>
                                <Menu>
                                    <MenuButton
                                        as={Button}
                                        width="100%"
                                        height="40px"
                                        bg={boxColor}
                                        color={textColor}
                                        rightIcon={<ChevronDownIcon />}
                                        textAlign="left"
                                        borderWidth={errors.courseCategoryID ? '2px' : '1px'}
                                        borderColor={errors.courseCategoryID ? 'red.500' : 'gray.200'}
                                        _hover={{ borderColor: errors.courseCategoryID ? 'red.500' : 'blue.400' }}
                                    >
                                        {selectedCategory ? selectedCategory.label : "Chọn loại khóa học"}
                                    </MenuButton>
                                    <MenuList maxHeight="160px" overflowY="auto" width="100%">
                                        {courseCategoryOptions.map(opt => (
                                            <MenuItem
                                                key={opt.value}
                                                onClick={() => handleCategoryMenuChange(opt.value)}
                                                background={opt.value === course.courseCategoryID ? "blue.50" : undefined}
                                            >
                                                {opt.label}
                                            </MenuItem>
                                        ))}
                                    </MenuList>
                                </Menu>
                                <FormErrorMessage>{errors.courseCategoryID}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.badgeID} mb={4}>
                                <FormLabel fontWeight="bold">Loại nhãn<Text as="span" color="red.500"> *</Text></FormLabel>
                                <Menu>
                                    <MenuButton
                                        as={Button}
                                        width="100%"
                                        height="40px"
                                        bg={boxColor}
                                        color={textColor}
                                        rightIcon={<ChevronDownIcon />}
                                        textAlign="left"
                                        borderWidth={errors.badgeID ? '2px' : '1px'}
                                        borderColor={errors.badgeID ? 'red.500' : 'gray.200'}
                                        _hover={{ borderColor: errors.badgeID ? 'red.500' : 'blue.400' }}
                                    >
                                        {badge.find(b => b.badgeID === course.badgeID)?.name || "Chọn loại nhãn"}
                                    </MenuButton>
                                    <MenuList maxHeight="160px" overflowY="auto" width="100%">
                                        <MenuItem
                                            key="0"
                                            onClick={() =>
                                                handleChange({
                                                    target: { name: "badgeID", value: "" }
                                                })
                                            }
                                            background={course.badgeID === "" ? "blue.50" : undefined}
                                        >
                                            Chọn loại nhãn
                                        </MenuItem>
                                        {badge.map(b => (
                                            <MenuItem
                                                key={b.badgeID}
                                                onClick={() =>
                                                    handleChange({
                                                        target: { name: "badgeID", value: b.badgeID }
                                                    })
                                                }
                                                background={b.badgeID === course.badgeID ? "blue.50" : undefined}
                                            >
                                                {b.name}
                                            </MenuItem>
                                        ))}
                                    </MenuList>
                                </Menu>
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
