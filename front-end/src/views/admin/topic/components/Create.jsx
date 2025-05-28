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
    Textarea,
    IconButton,
    VStack,
    HStack,
    Flex,
    Menu,
    MenuItem,
    MenuList,
    MenuButton,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, ChevronDownIcon } from "@chakra-ui/icons";
import FlushedInput from "@/components/fields/InputField";
import { createItem, getList } from "@/config/apiService";

export default function CreateMultipleTopicsModal({ isOpen, onClose, fetchData }) {
    const [selectedCourse, setSelectedCourse] = useState({
        courseID: '',
        courseName: ''
    });
    const [topics, setTopics] = useState([{
        id: 1,
        topicName: '',
        topicDescription: '',
        status: 1,
    }]);
    const [course, setCourse] = useState([]);
    const [errors, setErrors] = useState({});
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const { colorMode } = useColorMode();
    const textColor = colorMode === 'light' ? 'black' : 'white';
    const boxColor = colorMode === 'light' ? 'gray.100' : 'whiteAlpha.100';

    useEffect(() => {
        if (isOpen) {
            setSelectedCourse({
                courseID: '',
                courseName: ''
            });
            setTopics([{
                id: 1,
                topicName: '',
                topicDescription: '',
                status: 1,
            }]);
            setErrors({});
            fetchCourse();
        }
    }, [isOpen]);

    const fetchCourse = async () => {
        try {
            const course = await getList({ controller: "Course", page: 1, pageSize: 100 });
            setCourse(course.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh mục khóa học:", error);
            setCourse([]);
        }
    };

    const handleCourseChange = (e) => {
        const courseID = e.target.value;
        const selectedCourseData = course.find(c => c.courseID === courseID);
        setSelectedCourse({
            courseID: courseID,
            courseName: selectedCourseData ? selectedCourseData.courseName : ''
        });
    };

    const handleTopicChange = (topicId, field, value) => {
        setTopics(prev => prev.map(topic =>
            topic.id === topicId
                ? { ...topic, [field]: field === "status" ? parseInt(value, 10) : value }
                : topic
        ));
    };

    const addTopic = () => {
        const newId = Math.max(...topics.map(t => t.id)) + 1;
        setTopics(prev => [{
            id: newId,
            topicName: '',
            topicDescription: '',
            status: 1,
        }, ...prev]);
    };

    const removeTopic = (topicId) => {
        if (topics.length > 1) {
            setTopics(prev => prev.filter(topic => topic.id !== topicId));
        }
    };

    const validate = () => {
        let newErrors = {};

        // Validate course selection
        if (!selectedCourse.courseID) {
            newErrors.courseID = "Vui lòng chọn khóa học";
        }

        // Validate each topic
        topics.forEach((topic, index) => {
            if (!topic.topicName.trim()) {
                newErrors[`topic_${topic.id}_name`] = "Tên chủ đề không được bỏ trống";
            }
        });

        // Check for duplicate topic names
        const topicNames = topics.map(t => t.topicName.trim().toLowerCase()).filter(name => name);
        const duplicateNames = topicNames.filter((name, index) => topicNames.indexOf(name) !== index);
        if (duplicateNames.length > 0) {
            topics.forEach(topic => {
                if (duplicateNames.includes(topic.topicName.trim().toLowerCase())) {
                    newErrors[`topic_${topic.id}_name`] = "Tên chủ đề bị trùng lặp";
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
            const promises = topics.map(async (topic) => {
                const formData = new FormData();
                formData.append("topicName", topic.topicName.trim());
                formData.append("courseID", selectedCourse.courseID);
                formData.append("courseName", selectedCourse.courseName);
                formData.append("topicDescription", topic.topicDescription.trim());
                formData.append("status", topic.status);

                return createItem({ controller: "Topic", data: formData });
            });

            await Promise.all(promises);

            toast({
                title: `Thêm mới ${topics.length} chủ đề thành công!`,
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top',
                variant: "left-accent",
            });

            if (fetchData) await fetchData();
            onClose();
        } catch (error) {
            toast({
                title: "Đã xảy ra lỗi.",
                description: error.message || "Có lỗi xảy ra khi tạo chủ đề.",
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
        <Modal size={'4xl'} isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent maxH="90vh">
                <ModalHeader fontSize={'25px'} textAlign={'center'}>
                    Thêm mới chủ đề
                    <Button
                        leftIcon={<AddIcon />}
                        colorScheme="blue"
                        size="sm"
                        ml={3}
                        onClick={addTopic}
                        isDisabled={!selectedCourse.courseID}
                    >
                        Thêm chủ đề
                    </Button>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {/* Topics Section */}
                    <VStack spacing={4} align="stretch">
                        <HStack justify="space-between" align="center">
                            <Text fontSize="lg" fontWeight="bold">
                                Danh sách chủ đề
                            </Text>
                        </HStack>

                        <Accordion allowMultiple allowToggle defaultIndex={[0]}>
                            {topics.map((topic, index) => (
                                <AccordionItem key={topic.id} border="1px" borderColor="gray.200" borderRadius="md" bg={boxColor} mb={3}>
                                    <AccordionButton p={4}>
                                        <HStack justify="space-between" align="center" w="100%">
                                            <Text fontWeight="semibold" color="blue.500">
                                                Chủ đề #{index + 1}: {topic.topicName || "Chưa có tên"}
                                            </Text>
                                            <HStack>
                                                {topics.length > 1 && (
                                                    <IconButton
                                                        icon={<DeleteIcon />}
                                                        size="sm"
                                                        colorScheme="red"
                                                        variant="ghost"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Ngăn accordion toggle khi click delete
                                                            removeTopic(topic.id);
                                                        }}
                                                        aria-label="Xóa chủ đề"
                                                    />
                                                )}
                                                <AccordionIcon />
                                            </HStack>
                                        </HStack>
                                    </AccordionButton>

                                    <AccordionPanel pb={4}>
                                        <VStack spacing={3} align="stretch">
                                            <FormControl isInvalid={errors[`topic_${topic.id}_name`]}>
                                                <FormLabel fontWeight="bold">
                                                    Tên chủ đề<Text as="span" color="red.500"> *</Text>
                                                </FormLabel>
                                                <FlushedInput
                                                    bg="transparent"
                                                    placeholder="Nhập tên chủ đề"
                                                    value={topic.topicName}
                                                    onChange={(e) => handleTopicChange(topic.id, 'topicName', e.target.value)}
                                                    textColor={textColor}
                                                />
                                                <FormErrorMessage>{errors[`topic_${topic.id}_name`]}</FormErrorMessage>
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel fontWeight="bold">Mô tả</FormLabel>
                                                <Textarea
                                                    bg="transparent"
                                                    placeholder="Nhập mô tả"
                                                    value={topic.topicDescription}
                                                    onChange={(e) => handleTopicChange(topic.id, 'topicDescription', e.target.value)}
                                                    textColor={textColor}
                                                    maxH='80px'
                                                    resize="vertical"
                                                />
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel fontWeight="bold">Trạng thái</FormLabel>
                                                <Select
                                                    bg="transparent"
                                                    value={topic.status}
                                                    onChange={(e) => handleTopicChange(topic.id, 'status', e.target.value)}
                                                    textColor={textColor}
                                                >
                                                    <option value="1">Online</option>
                                                    <option value="0">Offline</option>
                                                </Select>
                                            </FormControl>
                                        </VStack>
                                    </AccordionPanel>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Flex justify="space-between" align="center" alignItems="center" alignContent="center" w="100%" gap={10}>
                        {/* Course Selection */}
                        <FormControl isInvalid={errors.courseID} w="50%">
                            <Menu>
                                <MenuButton
                                    as={Button}
                                    rightIcon={<ChevronDownIcon />}
                                    bg={boxColor}
                                    color={textColor}
                                    size="lg"
                                    w="100%"
                                    textAlign="left"
                                    justifyContent="space-between"
                                    fontWeight="normal"
                                    border={errors.courseID ? "2px solid" : "1px solid"}
                                    borderColor={errors.courseID ? "red.500" : "gray.200"}
                                    _hover={{
                                        borderColor: errors.courseID ? "red.500" : "gray.300"
                                    }}
                                    _focus={{
                                        borderColor: errors.courseID ? "red.500" : "blue.500",
                                        boxShadow: errors.courseID ? "0 0 0 1px red.500" : "0 0 0 1px blue.500"
                                    }}
                                >
                                    {selectedCourse.courseName || (
                                        <Text as="span">
                                            Chọn khóa học<Text as="span" color="red.500"> *</Text>
                                        </Text>
                                    )}
                                </MenuButton>
                                <MenuList
                                    maxH="200px"
                                    overflowY="auto"
                                    bg={boxColor}
                                    borderColor="gray.200"
                                >
                                    {course.map((courseItem) => (
                                        <MenuItem
                                            key={courseItem.courseID}
                                            onClick={() => handleCourseChange({
                                                target: {
                                                    name: 'courseID',
                                                    value: courseItem.courseID
                                                }
                                            })}
                                            color={textColor}
                                            _hover={{
                                                bg: "gray.300"
                                            }}
                                        >
                                            {courseItem.courseName}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </Menu>
                            <FormErrorMessage>{errors.courseID}</FormErrorMessage>
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
                                isDisabled={!selectedCourse.courseID}
                            >
                                Lưu {topics.length} chủ đề
                            </Button>
                        </Flex>
                    </Flex>

                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
