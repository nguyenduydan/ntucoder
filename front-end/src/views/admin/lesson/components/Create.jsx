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
    IconButton,
    VStack,
    HStack,
    Divider,
    Menu,
    MenuItem,
    MenuList,
    MenuButton,
    Flex,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, ChevronDownIcon } from "@chakra-ui/icons";
import JoditEditor from "jodit-react";
import FlushedInput from "@/components/fields/InputField";
import { createItem, getList } from "@/config/apiService";
import Editor from "@/utils/configEditor";

export default function CreateMultipleLessonsModal({ isOpen, onClose, fetchData }) {
    const [selectedTopic, setSelectedTopic] = useState({
        topicID: '',
        topicName: ''
    });
    const [lessons, setLessons] = useState([{
        id: 1,
        lessonTitle: '',
        lessonContent: '',
        order: 1,
        status: 1,
    }]);
    const [topic, setTopic] = useState([]);
    const [errors, setErrors] = useState({});
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const { colorMode } = useColorMode();
    const textColor = colorMode === 'light' ? 'black' : 'white';
    const boxColor = colorMode === 'light' ? 'gray.100' : 'whiteAlpha.100';
    const editorRefs = useRef({});

    useEffect(() => {
        if (isOpen) {
            setSelectedTopic({
                topicID: '',
                topicName: ''
            });
            setLessons([{
                id: 1,
                lessonTitle: '',
                lessonContent: '',
                order: 1,
                status: 1,
            }]);
            setErrors({});
            fetchTopic();
        }
    }, [isOpen]);

    const fetchTopic = async () => {
        try {
            const topic = await getList({ controller: "Topic", page: 1, pageSize: 100 });
            setTopic(topic.data);
        } catch (error) {
            console.error("Lỗi khi lấy chủ đề:", error);
            setTopic([]);
        }
    };

    const handleTopicChange = (e) => {
        const topicID = e.target.value;
        const selectedTopicData = topic.find(t => t.topicID === topicID);
        setSelectedTopic({
            topicID: topicID,
            topicName: selectedTopicData ? selectedTopicData.topicName : ''
        });
    };

    const handleLessonChange = (lessonId, field, value) => {
        setLessons(prev => prev.map(lesson =>
            lesson.id === lessonId
                ? { ...lesson, [field]: field === "status" || field === "order" ? parseInt(value, 10) : value }
                : lesson
        ));
    };

    const handleEditorChange = (lessonId, content) => {
        setLessons(prev => prev.map(lesson =>
            lesson.id === lessonId
                ? { ...lesson, lessonContent: content }
                : lesson
        ));
    };

    const addLesson = () => {
        const newId = Math.max(...lessons.map(l => l.id)) + 1;
        const newOrder = Math.max(...lessons.map(l => l.order)) + 1;

        // Thêm lesson mới lên đầu danh sách
        setLessons(prev => [{
            id: newId,
            lessonTitle: '',
            lessonContent: '',
            order: newOrder,
            status: 1,
        }, ...prev]);
    };

    const removeLesson = (lessonId) => {
        if (lessons.length > 1) {
            setLessons(prev => prev.filter(lesson => lesson.id !== lessonId));
            // Xóa editor ref
            delete editorRefs.current[lessonId];
        }
    };

    const validate = () => {
        let newErrors = {};

        // Validate topic selection
        if (!selectedTopic.topicID) {
            newErrors.topicID = "Vui lòng chọn chủ đề";
        }

        // Validate each lesson
        lessons.forEach((lesson) => {
            if (!lesson.lessonTitle.trim()) {
                newErrors[`lesson_${lesson.id}_title`] = "Tiêu đề bài học không được bỏ trống";
            }
        });

        // Check for duplicate lesson titles
        const lessonTitles = lessons.map(l => l.lessonTitle.trim().toLowerCase()).filter(title => title);
        const duplicateTitles = lessonTitles.filter((title, index) => lessonTitles.indexOf(title) !== index);
        if (duplicateTitles.length > 0) {
            lessons.forEach(lesson => {
                if (duplicateTitles.includes(lesson.lessonTitle.trim().toLowerCase())) {
                    newErrors[`lesson_${lesson.id}_title`] = "Tiêu đề bài học bị trùng lặp";
                }
            });
        }

        // Check for duplicate order numbers
        const orders = lessons.map(l => l.order).filter(order => order > 0);
        const duplicateOrders = orders.filter((order, index) => orders.indexOf(order) !== index);
        if (duplicateOrders.length > 0) {
            lessons.forEach(lesson => {
                if (duplicateOrders.includes(lesson.order)) {
                    newErrors[`lesson_${lesson.id}_order`] = "Thứ tự bị trùng lặp";
                }
            });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            const promises = lessons.map(async (lesson) => {
                const lessonData = {
                    topicID: selectedTopic.topicID,
                    topicName: selectedTopic.topicName,
                    lessonTitle: lesson.lessonTitle.trim(),
                    lessonContent: lesson.lessonContent,
                    order: lesson.order,
                    status: lesson.status,
                };

                return createItem({ controller: "Lesson", data: lessonData });
            });

            await Promise.all(promises);

            toast({
                title: `Thêm mới ${lessons.length} bài học thành công!`,
                status: 'success',
                duration: 3000,
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
                duration: 3000,
                isClosable: true,
                position: "top",
                variant: "left-accent",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal size={'5xl'} isOpen={isOpen} onClose={onClose} scrollBehavior="inside" isCentered>
            <ModalOverlay />
            <ModalContent maxH="95vh">
                <ModalHeader fontSize={'25px'} textAlign={'center'}>
                    Thêm mới bài học
                    <Button
                        leftIcon={<AddIcon />}
                        colorScheme="blue"
                        size="sm"
                        onClick={addLesson}
                        ml={3}
                        isDisabled={!selectedTopic.topicID}
                    >
                        Thêm bài học
                    </Button>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Divider mb={4} />

                    {/* Lessons Section */}
                    <VStack spacing={4} align="stretch">
                        <HStack justify="space-between" align="center">
                            <Text fontSize="lg" fontWeight="bold">
                                Danh sách bài học
                            </Text>
                        </HStack>

                        <Accordion allowMultiple defaultIndex={[0]}>
                            {lessons.map((lesson, index) => (
                                <AccordionItem key={lesson.id} border="1px" borderColor="gray.200" borderRadius="md" mb={3}>
                                    <AccordionButton bg={boxColor} _hover={{ bg: colorMode === 'light' ? 'gray.200' : 'whiteAlpha.200' }}>
                                        <Box flex="1" textAlign="left">
                                            <HStack justify="space-between" align="center" w="100%">
                                                <Text fontWeight="semibold" color="blue.500">
                                                    Bài học #{lesson.order} - {lesson.lessonTitle || 'Chưa có tiêu đề'}
                                                </Text>
                                                <HStack>
                                                    {lessons.length > 1 && (
                                                        <IconButton
                                                            icon={<DeleteIcon />}
                                                            size="sm"
                                                            colorScheme="red"
                                                            variant="ghost"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeLesson(lesson.id);
                                                            }}
                                                            aria-label="Xóa bài học"
                                                        />
                                                    )}
                                                    <AccordionIcon />
                                                </HStack>
                                            </HStack>
                                        </Box>
                                    </AccordionButton>
                                    <AccordionPanel pb={4}>
                                        <Grid templateColumns="3fr 1fr" gap={4} mb={4}>
                                            <Box>
                                                <FormControl isInvalid={errors[`lesson_${lesson.id}_title`]} mb={4}>
                                                    <FormLabel fontWeight="bold">
                                                        Tiêu đề bài học<Text as="span" color="red.500"> *</Text>
                                                    </FormLabel>
                                                    <FlushedInput
                                                        bg="transparent"
                                                        placeholder="Nhập tiêu đề bài học"
                                                        value={lesson.lessonTitle}
                                                        onChange={(e) => handleLessonChange(lesson.id, 'lessonTitle', e.target.value)}
                                                        textColor={textColor}
                                                    />
                                                    <FormErrorMessage>{errors[`lesson_${lesson.id}_title`]}</FormErrorMessage>
                                                </FormControl>
                                            </Box>
                                            <Box>
                                                <FormControl isInvalid={errors[`lesson_${lesson.id}_order`]} mb={4}>
                                                    <FormLabel fontWeight="bold">
                                                        Thứ tự <Text as="span" color="red.500">*</Text>
                                                    </FormLabel>
                                                    <FlushedInput
                                                        bg="transparent"
                                                        type="number"
                                                        min="1"
                                                        placeholder="Nhập thứ tự"
                                                        value={lesson.order}
                                                        onChange={(e) => handleLessonChange(lesson.id, 'order', e.target.value)}
                                                        textColor={textColor}
                                                    />
                                                    <FormErrorMessage>{errors[`lesson_${lesson.id}_order`]}</FormErrorMessage>
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel fontWeight="bold">Trạng thái</FormLabel>
                                                    <Select
                                                        bg="transparent"
                                                        value={lesson.status}
                                                        onChange={(e) => handleLessonChange(lesson.id, 'status', e.target.value)}
                                                        textColor={textColor}
                                                    >
                                                        <option value="1">Online</option>
                                                        <option value="0">Offline</option>
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                        </Grid>

                                        <FormControl mb={4}>
                                            <FormLabel fontWeight="bold">Nội dung bài học</FormLabel>
                                            <Box maxHeight="350px" overflow="auto" w="100%">
                                                <JoditEditor
                                                    key={lesson.id}
                                                    ref={(el) => {
                                                        if (el) editorRefs.current[lesson.id] = el;
                                                    }}
                                                    value={lesson.lessonContent}
                                                    config={Editor}
                                                    onChange={(content) => handleEditorChange(lesson.id, content)}
                                                    onBlur={(newContent) => handleEditorChange(lesson.id, newContent)}
                                                />
                                            </Box>
                                        </FormControl>
                                    </AccordionPanel>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Flex justifyContent="space-between" alignItems="center" w="100%">
                        {/* Topic Selection */}
                        <FormControl isInvalid={errors.topicID} w="50%">
                            <Menu >
                                <MenuButton
                                    as={Button}
                                    rightIcon={<ChevronDownIcon />}
                                    bg={boxColor}
                                    color={textColor}
                                    size="lg"
                                    border="1px solid blue"
                                    w="100%"
                                    textAlign="left"
                                >
                                    {selectedTopic.topicName || "Chọn chủ đề"}<Text as="span" color="red.500"> *</Text>
                                </MenuButton>
                                <MenuList maxH="200px" minW="100%" overflowY="auto" boxShadow="md">
                                    {topic.map((topic) => (
                                        <MenuItem
                                            key={topic.topicID}
                                            onClick={() => handleTopicChange({ target: { value: topic.topicID } })}
                                        >
                                            {topic.topicName}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </Menu>
                            <FormErrorMessage>{errors.topicID}</FormErrorMessage>
                        </FormControl>
                        <Flex>
                            <Button colorScheme="gray" mr={3} onClick={onClose}>
                                Hủy
                            </Button>
                            <Button
                                colorScheme="green"
                                isLoading={loading}
                                loadingText="Đang lưu..."
                                onClick={handleSubmit}
                                isDisabled={!selectedTopic.topicID}
                            >
                                Thêm {lessons.length} bài học
                            </Button>
                        </Flex>
                    </Flex>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
