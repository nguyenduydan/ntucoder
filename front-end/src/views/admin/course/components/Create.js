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
} from "@chakra-ui/react";
import FlushedInput from "components/fields/InputField";
import ImageInput from "components/fields/ImageInput";

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
                imageFile: null,
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
                    <FormControl mb={4} mt={4}>
                        <FormLabel textAlign="center" fontWeight="bold">Ảnh khóa học</FormLabel>
                        <ImageInput
                            label="chọn ảnh đại diện"
                            previewWidth="40vh"
                            previewHeight="20vh"
                        />
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
