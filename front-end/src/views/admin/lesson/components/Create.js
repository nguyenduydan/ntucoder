import React, { useState, useEffect, useRef } from "react";
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
    Box,
    useColorMode,
    Grid,
} from "@chakra-ui/react";
import JoditEditor from "jodit-react";
import FlushedInput from "components/fields/InputField";
import { create } from "config/lessonService";
import { getList } from "config/topicService";
import Editor from "utils/configEditor";

export default function CreateLessonModal({ isOpen, onClose, fetchData }) {
    const [lesson, setLesson] = useState({
        topicID: '',
        topicName: '',
        lessonTitle: '',
        lessonContent: '',
        order: 1,
        status: 0,
    });
    const [topic, setTopic] = useState([]);
    const [errors, setErrors] = useState({});
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const { colorMode } = useColorMode();
    const textColor = colorMode === 'light' ? 'black' : 'white';
    const boxColor = colorMode === 'light' ? 'gray.100' : 'whiteAlpha.100';
    const editor = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setLesson({
                topicID: '',
                topicName: '',
                lessonTitle: '',
                lessonContent: '',
                order: 1,
                status: 0,
            });
            setErrors({});
            fetchLesson();
        }
    }, [isOpen]);

    const fetchLesson = async () => {
        try {
            const topic = await getList({ page: 1, pageSize: 10 });
            setTopic(topic.data);
        } catch (error) {
            console.error("Lỗi khi lấy chủ đề:", error);
            setTopic([]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLesson((prev) => ({
            ...prev,
            [name]: name === "status" ? parseInt(value, 10) : value,
        }));
    };
    const handleEditorChange = (content) => {
        setLesson((prev) => ({
            ...prev,
            lessonContent: content, // ✅ Cập nhật nội dung từ TinyMCE
        }));
    };

    const validate = () => {
        let newErrors = {};
        if (!lesson.lessonTitle) newErrors.lessonTitle = "Tên bài học không được bỏ trống"; // Sửa topicName -> lessonTitle
        if (!lesson.topicID) newErrors.topicID = "Vui lòng chọn chủ đề";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async () => {
        console.log("Dữ liệu gửi đi:", lesson);
        if (!validate()) return;
        setLoading(true);
        try {
            await create(lesson);
            toast({
                title: 'Thêm mới bài học thành công!',
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
        <Modal size={'5xl'} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader fontSize={'25px'} textAlign={'center'}>Thêm mới bài học</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Grid templateColumns="3fr 1fr" gap={4}>
                        <Box flex={1}>
                            <FormControl isInvalid={errors.lessonTitle} mb={4}>
                                <FormLabel fontWeight="bold">Tiêu đề bài học<Text as="span" color="red.500"> *</Text></FormLabel>
                                <FlushedInput bg={boxColor} placeholder="Nhập tiêu đề bài học" name="lessonTitle" value={lesson.lessonTitle} onChange={handleChange} textColor={textColor} />
                                <FormErrorMessage>{errors.lessonTitle}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.topicID} mb={4}>
                                <FormLabel fontWeight="bold">Chọn chủ đề<Text as="span" color="red.500"> *</Text></FormLabel>
                                <Select bg={boxColor} name="topicID" value={lesson.topicID} onChange={handleChange} textColor={textColor}>
                                    <option key="0" value="">Chọn chủ đề</option>
                                    {topic.map((topic) => (
                                        <option key={topic.topicID} value={topic.topicID}>{topic.topicName}</option>
                                    ))}
                                </Select>
                                <FormErrorMessage>{errors.topicID}</FormErrorMessage>
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel fontWeight="bold">Nội dung bài học</FormLabel>
                                <Box maxH="400px" overflowY="auto">
                                    <JoditEditor
                                        key={lesson.lessonID}
                                        ref={editor}
                                        value={lesson.lessonContent}
                                        config={Editor}
                                        onChange={handleEditorChange}
                                        onBlur={(newContent) => handleEditorChange(newContent)}
                                        style={{ width: "100%", minHeight: "300px" }} // Đảm bảo kích thước hợp lý
                                    />
                                </Box>
                            </FormControl>
                        </Box>
                        <Box>
                            <FormControl isInvalid={!!errors.order} mb={4}>
                                <FormLabel fontWeight="bold">
                                    Thứ tự <Text as="span" color="red.500">*</Text>
                                </FormLabel>
                                <Select
                                    bg={boxColor}
                                    name="order"
                                    placeholder="Chọn thứ tự"
                                    value={lesson.order}
                                    onChange={handleChange}
                                    textColor={textColor}
                                >
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </Select>
                                <FormErrorMessage>{errors.order}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.status}>
                                <FormLabel fontWeight="bold">Trạng thái</FormLabel>
                                <Select bg={boxColor} name="status" value={lesson.status} onChange={handleChange} textColor={textColor}>
                                    <option key="default" value="">Chọn trạng thái</option>
                                    <option key="online" value="1">Online</option>
                                    <option key="offline" value="0">Offline</option>
                                </Select>
                            </FormControl>
                        </Box>
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
