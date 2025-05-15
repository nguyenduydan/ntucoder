import React, { useState, useEffect } from "react";
import {
    Button,
    FormControl,
    FormLabel,
    Text,
    useToast,
    FormErrorMessage,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Select,
    useColorMode,
    Textarea
} from "@chakra-ui/react";
import FlushedInput from "@/components/fields/InputField";
import { createItem, getList } from "@/config/apiService";

export default function CreateTopicModal({ isOpen, onClose, fetchData }) {
    const [topic, setTopic] = useState({
        courseID: '',
        courseName: '',
        topicName: '',
        topicDescription: '',
        status: 0,
    });
    const [course, setCourse] = useState([]);
    const [errors, setErrors] = useState({});
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const { colorMode } = useColorMode();
    const textColor = colorMode === 'light' ? 'black' : 'white';
    const boxColor = colorMode === 'light' ? 'gray.100' : 'whiteAlpha.100';

    useEffect(() => {
        if (isOpen) {
            setTopic({
                courseID: '',
                courseName: '',
                topicName: '',
                topicDescription: '',
                status: 0,
            });
            setErrors({});
            fetchCourse();
        }
    }, [isOpen]);

    const fetchCourse = async () => {
        try {
            const course = await getList({ controller: "Course", page: 1, pageSize: 10 });
            setCourse(course.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh mục khóa học:", error);
            setCourse([]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTopic((prev) => ({
            ...prev,
            [name]: name === "status" ? parseInt(value, 10) : value,
        }));
    };

    const validate = () => {
        let newErrors = {};
        if (!topic.topicName) newErrors.topicName = "Tên chủ đề không được bỏ trống";
        if (!topic.courseID) newErrors.courseID = "Vui lòng chọn khóa học";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("topicName", topic.topicName);
            formData.append("courseID", topic.courseID);
            formData.append("courseName", topic.courseName);
            formData.append("topicDescription", topic.topicDescription);
            formData.append("status", topic.status);
            await createItem({ controller: "Topic", data: formData });
            toast({
                title: 'Thêm mới chủ đề thành công!',
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
        <Modal size={'2xl'} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader fontSize={'25px'} textAlign={'center'}>Thêm mới chủ đề</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl isInvalid={errors.topicName} mb={4}>
                        <FormLabel fontWeight="bold">Tên chủ đề<Text as="span" color="red.500"> *</Text></FormLabel>
                        <FlushedInput bg={boxColor} placeholder="Nhập tên chủ đề" name="topicName" value={topic.topicName} onChange={handleChange} textColor={textColor} />
                        <FormErrorMessage>{errors.topicName}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors.courseID} mb={4}>
                        <FormLabel fontWeight="bold">Loại khóa học<Text as="span" color="red.500"> *</Text></FormLabel>
                        <Select bg={boxColor} name="courseID" value={topic.courseID} onChange={handleChange} textColor={textColor}>
                            <option key="0" value="">Chọn loại khóa học</option>
                            {course.map((course) => (
                                <option key={course.courseID} value={course.courseID}>{course.courseName}</option>
                            ))}
                        </Select>
                        <FormErrorMessage>{errors.courseID}</FormErrorMessage>
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel fontWeight="bold">Mô tả</FormLabel>
                        <Textarea
                            name="topicDescription"
                            bg={boxColor}
                            placeholder="Nhập mô tả"
                            value={topic.topicDescription}
                            onChange={handleChange}
                            textColor={textColor}
                            maxH='100px'
                        />
                    </FormControl>
                    <FormControl isInvalid={errors.status}>
                        <FormLabel fontWeight="bold">Trạng thái</FormLabel>
                        <Select bg={boxColor} name="status" value={topic.status} onChange={handleChange} textColor={textColor}>
                            <option key="default" value="">Chọn trạng thái</option>
                            <option key="online" value="1">Online</option>
                            <option key="offline" value="0">Offline</option>
                        </Select>
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
