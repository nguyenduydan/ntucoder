import React, { use, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, NavLink } from "react-router-dom";
import {
    Box, Text, Flex, Accordion, AccordionItem, AccordionButton, AccordionPanel,
    List, ListItem, SkeletonText, useToast,
    Icon
} from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { FaRegFileCode, FaRegCheckCircle, FaCheckCircle } from "react-icons/fa";

import { getDetail } from "@/config/apiService";
import api from "@/config/apiConfig";

const LessonList = ({ onSelectLesson }) => {
    const { slugId } = useParams();
    const parts = slugId ? slugId.split("-") : [];
    const courseID = parts.length > 0 ? parseInt(parts.pop(), 10) : NaN;
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const [lessonProgress, setLessonProgress] = useState({});

    const fetchData = async () => {
        if (isNaN(courseID)) {
            toast({
                title: "Lỗi",
                description: "ID không hợp lệ!",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            navigate("/course");
            return;
        }

        setLoading(true);
        try {
            const courseRes = await getDetail({ controller: "Course", id: courseID });
            if (!courseRes?.topics) throw new Error("Không có dữ liệu khóa học");

            const topicsWithLessons = await Promise.all(
                courseRes.topics.map(async (topic) => {
                    try {
                        const topicData = await getDetail({ controller: "Topic", id: topic.topicID });
                        return {
                            ...topic,
                            lessons: (topicData.lessons || []).filter(l => Number(l.status) === 1)
                        };
                    } catch {
                        return { ...topic, lessons: [] };
                    }
                })
            );

            setCourse({ ...courseRes, topics: topicsWithLessons });

            let progressMap = {};
            for (const topic of topicsWithLessons) {
                const res = await api.get(`/Progress/lesson-summary?topicId=${topic.topicID}`);
                res.data.forEach(lp => {
                    progressMap[lp.lessonID] = {
                        completed: lp.completedProblems,
                        total: lp.totalProblems
                    };
                });
            }
            setLessonProgress(progressMap);

        } catch (error) {
            toast({
                title: "Lỗi",
                description: error.message || "Không thể tải dữ liệu. Vui lòng thử lại!",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            setCourse(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [courseID, location.pathname]);

    return (
        <Box px={5}>
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
                                                            <Flex alignItems='center' gap={10} fontSize="sm">
                                                                <Flex alignItems='center' gap={1}>
                                                                    <FaRegFileCode color="black" />
                                                                    <Text>Tổng số bài học: {topic?.lessons?.length || 0}</Text>
                                                                </Flex>
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
                                                                    onClick={() => onSelectLesson?.(lesson.lessonID)}
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
                                                                        <Flex alignItems="center" justifyContent="space-between" gap={2} fontSize="md">
                                                                            <Text fontSize="md">
                                                                                📚 {lesson.lessonTitle || "Không có tên bài học"}{" "}
                                                                            </Text>
                                                                            {lessonProgress[lesson.lessonID] ? (
                                                                                lessonProgress[lesson.lessonID].completed === lessonProgress[lesson.lessonID].total && lessonProgress[lesson.lessonID].total > 0 ? (
                                                                                    <Icon as={FaCheckCircle} fontSize="lg" color="green" />
                                                                                ) : (
                                                                                    <Text
                                                                                        as="span"
                                                                                        ml={2}
                                                                                        color="inherit"
                                                                                        fontWeight="bold"
                                                                                    >
                                                                                        {lessonProgress[lesson.lessonID].completed}/{lessonProgress[lesson.lessonID].total}
                                                                                    </Text>
                                                                                )
                                                                            ) : (
                                                                                "0/0"
                                                                            )}
                                                                        </Flex>
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
