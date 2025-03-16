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
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Select,
    useColorMode,
    Input,
    Image,
} from "@chakra-ui/react";
import FlushedInput from "components/fields/InputField";
import { create } from "config/courseService";
import { getList } from "config/courseCategoryService";
import { getListBagde } from "config/badgeService";

export default function CreateCourseModal({ isOpen, onClose, fetchData }) {
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
        imageUrl: "",
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
        if (isOpen) {
            setCourse({
                coderID: "1",
                courseName: "",
                courseCategoryID: "",
                fee: "",
                originalFee: "",
                isCombo: false,
                badgeID: "",
                status: 0,
                description: "",
                imageUrl: "",
            });
            setErrors({});
            fetchCategories(); // Gọi hàm lấy danh mục khóa học khi modal mở
        }
    }, [isOpen]);

    const fetchCategories = async () => {
        try {
            const data = await getList({ page: 1, pageSize: 10 });
            const badge = await getListBagde({ page: 1, pageSize: 10 });
            setCourseCategories(data.data);
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

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
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
        if (!course.fee || course.fee < 0) newErrors.fee = "Học phí phải là số dương";
        if (!course.originalFee || course.originalFee < 0) newErrors.originalFee = "Học phí gốc phải là số dương";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            await create(course);
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
        <Modal size={'4xl'} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader fontSize={'25px'} textAlign={'center'}>Thêm mới khóa học</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
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
                            <FormControl mb={4}>
                                <FormLabel fontWeight="bold">Ảnh khóa học</FormLabel>
                                <Input type="file" accept="image/*" onChange={handleImageChange} />

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
                            {imagePreview && (
                                <Image src={imagePreview} alt="Preview" mt={3} boxSize="200px" objectFit="cover" />
                            )}
                        </GridItem>
                    </Grid>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="gray" mr={3} onClick={onClose}>Hủy</Button>
                    <Button colorScheme="green" isLoading={loading} loadingText="Đang lưu..." onClick={handleSubmit}>Thêm</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
