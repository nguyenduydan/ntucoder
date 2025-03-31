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
    Box,
    Select,
    useColorMode,
    Image,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import FlushedInput from "components/fields/InputField";
import { create } from "config/courseService";
import { getList } from "config/courseCategoryService";
import { getListBagde } from "config/badgeService";

export default function CreateCourse({ fetchData }) {
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
        imageFile: null,
    });
    const [courseCategories, setCourseCategories] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [badge, setBadge] = useState([]);
    const [errors, setErrors] = useState({});
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const { colorMode } = useColorMode();
    const textColor = colorMode === 'light' ? 'black' : 'white';
    const boxColor = colorMode === 'light' ? 'gray.100' : 'whiteAlpha.100';

    useEffect(() => {
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
            imageFile: null,
        });
        setErrors({});
        fetchCategories();
    }, []); // Thêm [] để tránh lặp vô hạn

    const fetchCategories = async () => {
        try {
            const data = await getList({ page: 1, pageSize: 10 });
            const badgeData = await getListBagde({ page: 1, pageSize: 10 });
            setCourseCategories(data?.data || []);
            setBadge(badgeData?.data || []);
        } catch (error) {
            console.error("Lỗi khi lấy danh mục khóa học:", error);
            setCourseCategories([]);
            setBadge([]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourse((prev) => ({
            ...prev,
            [name]: name === "status" ? parseInt(value, 10) : value,
        }));
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setCourse((prev) => ({
                ...prev,
                imageFile: file, // Lưu file ảnh vào state
            }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
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

        // Nếu có file ảnh, thêm vào FormData
        if (course.imageFile) {
            formData.append("imageFile", course.imageFile);
        }

        try {
            console.log("API: ", formData);
            await create(formData); // Gửi FormData lên backend

            toast({
                title: 'Thêm mới khóa học thành công!',
                status: 'success',
                duration: 2000,
                isClosable: true,
                position: 'top',
                variant: "left-accent",
            });

            if (fetchData) await fetchData();
        } catch (error) {
            toast({
                title: "Đã xảy ra lỗi.",
                description: error.message || "Có lỗi xảy ra khi tạo khóa học.",
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
        <Box p={6} bg="white" boxShadow="md" borderRadius="md" maxW="4xl" mx="auto">
            <Text fontSize="25px" fontWeight="bold" textAlign="center" mb={6}>Thêm mới khóa học</Text>
            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
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
                        <FlushedInput bg={boxColor} type="number" placeholder="Nhập học phí gốc" name="originalFee" value={course.originalFee} onChange={handleChange} textColor={textColor} />
                        <FormErrorMessage>{errors.originalFee}</FormErrorMessage>
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel fontWeight="bold">Ảnh khóa học</FormLabel>
                        <FlushedInput type="file" accept="image/*" onChange={handleImageChange} />
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl isInvalid={errors.courseCategoryID} mb={4}>
                        <FormLabel fontWeight="bold">Loại khóa học<Text as="span" color="red.500"> *</Text></FormLabel>
                        <Menu>
                            <MenuButton as={Button} borderWidth={1} w="100%" borderRadius="md" rightIcon={<ChevronDownIcon />} textColor={textColor}>
                                {course.courseCategoryID ?
                                    courseCategories.find(cat => cat.courseCategoryID === course.courseCategoryID)?.name :
                                    "Chọn loại khóa học"}
                            </MenuButton>
                            <MenuList maxH="150px" w="100%" overflowY="auto">
                                {courseCategories.map((category) => (
                                    <MenuItem
                                        key={category.courseCategoryID}
                                        onClick={() => handleChange({ target: { name: "courseCategoryID", value: category.courseCategoryID } })}
                                    >
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </Menu>
                        <FormErrorMessage>{errors.courseCategoryID}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors.badgeID} mb={4}>
                        <FormLabel fontWeight="bold">Loại nhãn<Text as="span" color="red.500"> *</Text></FormLabel>
                        <Menu>
                            <MenuButton as={Button} borderWidth={1} w="100%" borderRadius="md" rightIcon={<ChevronDownIcon />} textColor={textColor}>
                                {course.badgeID
                                    ? badge.find(b => b.badgeID === course.badgeID)?.name
                                    : "Chọn loại nhãn"}
                            </MenuButton>
                            <MenuList maxH="150px" w="100%" overflowY="auto"> {/* Giới hạn chiều cao dropdown */}
                                {badge.map(b => (
                                    <MenuItem
                                        key={b.badgeID}
                                        onClick={() => handleChange({ target: { name: "badgeID", value: b.badgeID } })}
                                    >
                                        {b.name}
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </Menu>
                        <FormErrorMessage>{errors.badgeID}</FormErrorMessage>
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel fontWeight="bold">Trạng thái</FormLabel>
                        <Select bg={boxColor} name="status" value={course.status} onChange={handleChange} textColor={textColor}>
                            <option value="">Chọn trạng thái</option>
                            <option value="1">Online</option>
                            <option value="0">Offline</option>
                        </Select>
                    </FormControl>
                    {imagePreview && (
                        <Image src={imagePreview} alt="Preview" mt={3} w="auto" h={100} objectFit="cover" />
                    )}
                </GridItem>
            </Grid>
            <Box mt={6} textAlign="center">
                <Button colorScheme="green" px={10} isLoading={loading} loadingText="Đang lưu..." onClick={handleSubmit} mr={3}>Thêm</Button>
            </Box>
        </Box>
    );
}
