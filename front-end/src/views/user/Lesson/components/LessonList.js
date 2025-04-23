import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, NavLink } from "react-router-dom";
import {
    Box, Text, Flex, Accordion, AccordionItem, AccordionButton, AccordionPanel,
    List, ListItem, SkeletonText, useToast
} from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { FaRegFileCode } from "react-icons/fa";

import { getDetail } from "config/apiService";

const LessonList = () => {
    const { slugId } = useParams();
    const parts = slugId ? slugId.split("-") : [];
    const courseID = parts.length > 0 ? parseInt(parts.pop(), 10) : NaN;
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (isNaN(courseID)) {
            toast({
                title: "Lỗi",
                description: "ID không hợp lệ!",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            setLoading(false);
            navigate("/course");
            return;
        }

        const fetchCourse = async () => {
            try {
                const response = await getDetail({ controller: "Course", id: courseID });

                if (!response || Object.keys(response).length === 0) {
                    toast({
                        title: "Cảnh báo",
                        description: "Không có dữ liệu cho khóa học này.",
                        status: "warning",
                        duration: 3000,
                        isClosable: true,
                    });
                    setCourse(null);
                    return;
                }

                const topics = response.topics || [];

                const topicsWithLessons = await Promise.all(
                    topics.map(async (topic) => {
                        try {
                            const topicData = await getDetail({ controller: "Topic", id: topic.topicID });
                            const filteredLessons = (topicData.lessons || []).filter(lesson => Number(lesson.status) === 1);

                            return { ...topic, lessons: filteredLessons };
                        } catch (error) {
                            console.log("Error fetching lessons:", error);
                            return { ...topic, lessons: [] };
                        }
                    })
                );

                setCourse({ ...response, topics: topicsWithLessons });
            } catch (error) {
                toast({
                    title: "Lỗi",
                    description: "Không thể tải dữ liệu. Vui lòng thử lại!",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
                setCourse(null);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseID, toast, navigate]);

    return (
        <Box>
            {loading ? (
                <SkeletonText noOfLines={5} spacing={4} />
            ) : (
                <List spacing={0}>
                    {Array.isArray(course?.topics) && course.topics.length > 0 ? (
                        <Accordion allowToggle defaultIndex={[0]}> {/* Chỉ mở chủ đề đầu tiên */}
                            {course.topics.map((topic, index) => (
                                <ListItem key={topic?.topicID || index} bg="gray.100" borderRadius="md">
                                    <AccordionItem key={topic?.topicID} border="none">
                                        {({ isExpanded }) => (
                                            <>
                                                <h2>
                                                    <AccordionButton _expanded={{ bg: "gray.200" }} borderRadius="sm">
                                                        <Box flex="1" textAlign="left" borderBottomWidth={2} borderStyle="dashed" py={2}>
                                                            <Text fontSize="lg">
                                                                <Text as="span" fontWeight="bold">Chủ đề {index + 1}:</Text> {topic?.topicName || "Không có tên"}
                                                            </Text>
                                                            <Flex alignItems='center' gap={2} fontSize="sm">
                                                                <Text as='span'><FaRegFileCode /></Text>Tổng số bài học: {topic?.lessons?.length || 0}
                                                            </Flex>
                                                        </Box>
                                                        {isExpanded ? <MinusIcon boxSize={4} /> : <AddIcon boxSize={4} />}
                                                    </AccordionButton>
                                                </h2>
                                                <AccordionPanel pb={4}>
                                                    {topic.lessons?.length ? (
                                                        <List spacing={2}>
                                                            {topic.lessons?.map((lesson) => (
                                                                <NavLink
                                                                    to={`${location.pathname.replace(/\/\d+$/, '')}/${lesson.lessonID}`}
                                                                    style={({ isActive }) => ({
                                                                        textDecoration: 'none',
                                                                        color: isActive ? 'blue.500' : 'inherit',
                                                                    })}
                                                                >
                                                                    <ListItem
                                                                        cursor="pointer"
                                                                        _hover={{ bg: "gray.300", transform: "scale(1.01)" }}
                                                                        transition="all .2s ease-in-out"
                                                                        key={lesson.lessonID || Math.random()}
                                                                        pl={2}
                                                                        bg="gray.50" borderRadius="sm"
                                                                        p={2}
                                                                    >
                                                                        <Text fontSize="md">📚 {lesson.lessonTitle || "Không có tên bài học"}</Text>
                                                                    </ListItem>
                                                                </NavLink>
                                                            ))}
                                                        </List>
                                                    ) : (
                                                        <Text fontSize="md" color="gray.500">Không có bài học nào.</Text>
                                                    )}
                                                </AccordionPanel>
                                            </>
                                        )}
                                    </AccordionItem>
                                </ListItem>
                            ))}
                        </Accordion>
                    ) : (
                        <Text fontSize="md" color="gray.500">Không có chủ đề nào.</Text>
                    )}
                </List>
            )}
        </Box>
    );
};

export default LessonList;
