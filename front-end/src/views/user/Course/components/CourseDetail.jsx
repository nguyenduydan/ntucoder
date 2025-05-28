import React, { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useParams, useNavigate, useLocation, NavLink } from "react-router-dom";
import {
    Box, Text, Image, Flex, Badge, Icon, Button,
    Tabs, TabPanels, Tab, TabPanel, useToast,
    VStack, HStack, Skeleton, SkeletonText,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Spinner,
    Center,
} from "@chakra-ui/react";
import { FaCheckCircle, FaTrophy, FaUsers, FaStar, FaArrowRight, FaClipboardList, FaFingerprint, FaBookOpen } from "react-icons/fa";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { formatCurrency } from "@/utils/utils";
import sanitizeHtml from "@/utils/sanitizedHTML";
import { useTitle } from "@/contexts/TitleContext";
import { getDetail } from "@/config/apiService";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/config/apiConfig";
import StickyTabList from "@/components/scroll/StickyTabList";
import Comment from "./Comment";
import TopicList from "./TopicList";

const Review = React.lazy(() => import("./Review"));


const CourseDetail = () => {
    const { slugId } = useParams();
    const parts = slugId ? slugId.split("-") : [];
    const courseID = parts.length > 0 ? parseInt(parts.pop(), 10) : NaN; // Lấy phần cuối làm ID
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [problems, setProblems] = useState([]);
    const isAuthenticated = useAuth();
    const { coder } = useAuth();

    const [tabIndex, setTabIndex] = useState(0);
    const [hasViewed, setHasViewed] = useState([true, false, false, false]);

    const handleTabChange = (index) => {
        setTabIndex(index);
        setHasViewed((prev) => {
            const updated = [...prev];
            updated[index] = true;
            return updated;
        });
    };

    const fetchCourse = useCallback(async () => {
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

            const problemsCount = await api.get(`/Course/problem-count?courseId=${courseID}`);

            setProblems(problemsCount.data);
            setCourse({ ...response, topics: topicsWithLessons });

            if (coder?.coderID) {
                const isEnrolledRes = await api.get(`/Enrollment/CheckEnrollment`, {
                    params: {
                        courseId: courseID || '',
                        coderID: coder.coderID || ''
                    }
                });
                setIsEnrolled(isEnrolledRes.data.isEnrolled);
            }

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
    }, [courseID, coder?.coderID, navigate, toast]);

    useEffect(() => {
        fetchCourse();
    }, [fetchCourse]);



    // ✅ Tính tổng số topic và tổng số bài học
    const totalTopics = course?.topics ? course.topics.length : 0;
    const totalLessons = course?.topics
        ? course.topics.reduce((sum, topic) => sum + (topic.lessons ? topic.lessons.length : 0), 0)
        : 0;


    useTitle(course?.courseName || "Khóa học");

    // ✅ Đăng ký khóa học
    const handleEnroll = async () => {
        if (isAuthenticated.isAuthenticated === false) {
            toast({
                title: "Bạn cần phải đăng nhập.",
                status: "warning",
                duration: 2000,
                isClosable: true,
                position: "top",
                variant: "top-accent",
            });
        } else {
            const data = {
                courseID: courseID,
            };

            try {
                const res = await api.post("/Enrollment", data);
                if (res.status === 200 || res.status === 201) {
                    setIsEnrolled(true);
                    toast({
                        title: "Đăng ký khóa học thành công",
                        status: "success",
                        duration: 2000,
                        isClosable: true,
                        position: "top",
                        variant: "top-accent",
                    });
                } else {
                    toast({
                        title: "Lỗi đăng ký khóa học",
                        description: res.data.message,
                        status: "error",
                        duration: 2000,
                        isClosable: true,
                        position: "top",
                        variant: "top-accent",
                    });
                }
                fetchCourse();
            } catch (error) {
                console.error("Lỗi đăng ký: ", error.response ? error.response.data : error.message);
                toast({
                    title: error.response ? error.response.data.message : error.message,
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                    position: "top",
                    variant: "top-accent",
                });
            }
        }
    };

    // ✅ Hủy đăng ký
    const cancelRef = useRef();
    const [isOpen, setIsOpen] = useState(false);

    const openDialog = () => setIsOpen(true);
    const closeDialog = () => setIsOpen(false);

    const handleUnenroll = async () => {
        try {
            const res = await api.delete("/Enrollment", {
                data: {
                    courseID: courseID,
                    coderID: coder.coderID
                }
            });

            if (res.status === 200) {
                setIsEnrolled(false);
                toast({
                    title: "Đã hủy đăng ký khóa học.",
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                    position: "top",
                    variant: "top-accent",
                });
                fetchCourse();
            }
        } catch (error) {
            toast({
                title: "Lỗi hủy đăng ký",
                description: error.response?.data?.message || "Có lỗi xảy ra",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top",
                variant: "top-accent",
            });
        }
    };

    return (
        <Box p={6} maxW="100%" minH="100vh" mx="auto" w={{ lg: "calc(100% - 360px)", md: "100%" }}>
            <Button
                leftIcon={<ArrowBackIcon />}
                mb={2}
                colorScheme='blue' variant='ghost'
                onClick={() => navigate('/course')}
            >
                Trở về trước
            </Button>
            <Flex direction={{ base: "column", md: "row" }} gap={5}>
                {/* Left Content */}
                <Box flex={3} minH={570} overflowY="auto" position="static">
                    <Flex
                        direction={{ base: "column", md: "row" }}
                        gap={6}
                        bgGradient="linear(to-r, blue.900, blue.700)"
                        p={8}
                        borderRadius="md"
                        boxShadow="lg"
                    >
                        {/* Course Image */}
                        <Box flex={3}>
                            {loading ? (
                                <Skeleton height="250px" borderRadius="md" />
                            ) : (
                                <Image
                                    alt="Course Avatar"
                                    w="100%"
                                    h={{ base: "200px", md: "250px" }}
                                    borderRadius="md"
                                    objectFit="cover"
                                    boxShadow="lg"
                                    src={course?.imageUrl || "/avatarSimmmple.png"}
                                />
                            )}
                        </Box>
                        {/* Course Details */}
                        <Box flex={3} color="white" borderRadius="lg">
                            {loading ? (
                                <SkeletonText noOfLines={3} spacing={4} />
                            ) : (
                                <Box>
                                    <Text fontSize="3xl" letterSpacing={1.2} fontWeight="bold">{course?.courseName}</Text>
                                    <Text mt={2}> <Box sx={{ wordBreak: "break-word" }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(course?.description) }} /></Text>
                                    <HStack mt={4} spacing={4}>
                                        <Text>Tác giả: <Text as="span" color="blue.300">{course?.creatorName}</Text></Text>
                                        <Icon as={FaUsers} /><Text>{course?.enrollCount || "0"} Học viên</Text>
                                        <Icon as={FaStar} color="yellow.400" /> <Text> {course.rating ? course.rating.toFixed(1) : "0"}</Text>
                                    </HStack>
                                </Box>
                            )}
                        </Box>
                        {/* Right Sidebar */}
                        <Box
                            w={{ base: "100%", md: "300px" }}
                            display={{ base: "block", lg: "none" }}
                        >
                            <Box
                                color="white"
                                borderRadius="lg"
                                w="full"
                            >
                                <Flex mt="1" pb={3} align="center" justify="space-between" borderBottomWidth={2} borderBottomColor="gray.600">
                                    {course?.fee >= 0 && (
                                        <Flex alignItems="left" direction="column">
                                            <Text fontSize="4xl" fontWeight="bold">
                                                {course?.fee === 0 ? "Miễn phí" : formatCurrency(course?.fee || 0)}
                                            </Text>
                                            <Text ml="2" fontSize="md" textDecoration="line-through" color="gray.400">
                                                {course?.originalFee === 0 ? "" : formatCurrency(course?.originalFee || 0)}
                                            </Text>
                                        </Flex>
                                    )}
                                    {course?.originalFee > 0 && (
                                        <Badge colorScheme="red"
                                            ml="2"
                                            px="2"
                                            py="1"
                                            mb={10}
                                            fontSize="sm"
                                            bg="red.500"
                                            color="white"
                                            borderRadius="md">
                                            -{course?.discountPercent || 0}%
                                        </Badge>
                                    )}
                                </Flex>

                                <VStack align="start" mt={4} spacing={3}>
                                    <HStack><Icon as={FaCheckCircle} /><Text>{totalTopics} chủ đề</Text></HStack>
                                    <HStack><Icon as={FaBookOpen} /><Text>{totalLessons} bài học</Text></HStack>
                                    <HStack><Icon as={FaClipboardList} /><Text>{problems} bài tập</Text></HStack>
                                    <HStack><Icon as={FaFingerprint} /><Text>Truy cập trọn đời</Text></HStack>
                                    <HStack><Icon as={FaTrophy} /><Text>Chứng chỉ khi hoàn thành</Text></HStack>
                                </VStack>
                                {isEnrolled === true && course?.topics?.[0]?.lessons?.[0]?.lessonID ? (
                                    <Flex direction="column" gap={4}>
                                        <NavLink to={`${location.pathname}/${course.topics[0].lessons[0].lessonID}`}>
                                            <Button
                                                colorScheme="blue"
                                                mt={4}
                                                w="full"
                                                fontSize="18px"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                _hover={{
                                                    transform: "translateY(-3px)",
                                                    boxShadow: "0px 4px 10px rgb(39, 87, 246)",
                                                    transition: "transform 0.3s ease",
                                                }}
                                            >
                                                Vào học <Icon as={FaArrowRight} ml={2} />
                                            </Button>

                                        </NavLink>
                                        <Button colorScheme="red" w="full" fontSize="18px" onClick={openDialog}>
                                            Hủy đăng ký
                                        </Button>
                                    </Flex>


                                ) : (
                                    // Ngược lại, hiển thị nút Đăng ký hoặc Mua ngay
                                    <Button
                                        colorScheme={course?.fee === 0 ? "green" : "red"}
                                        mt={4}
                                        w="full"
                                        fontSize="18px"
                                        onClick={handleEnroll}
                                    >
                                        {course?.fee === 0 ? "Đăng ký miễn phí" : "Mua ngay"}
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Flex>

                    {/* Tabs */}
                    <Tabs
                        index={tabIndex}
                        onChange={handleTabChange}
                        mt={6}
                        colorScheme="blue"
                        bg="white"
                        borderRadius="md"
                    >
                        <StickyTabList offsetTop={0}>
                            <Tab>Giới thiệu</Tab>
                            <Tab>Giáo trình</Tab>
                            <Tab>Đánh giá</Tab>
                            <Tab>Bình luận</Tab>
                        </StickyTabList>

                        <TabPanels>
                            <TabPanel>
                                {hasViewed[0] && (loading ? (
                                    <Center><Spinner color="blue.500" size="md" /></Center>
                                ) : (
                                    <Box
                                        px={5}
                                        py={2}
                                        sx={{ wordBreak: 'break-word' }}
                                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(course?.overview) }}
                                    />
                                ))}
                            </TabPanel>

                            <TabPanel>
                                {hasViewed[1] && (loading ? (
                                    <Center>
                                        <Spinner color="blue.500" size="md" />
                                    </Center>
                                ) : (
                                    <TopicList
                                        course={course}
                                        isAuthenticated={isAuthenticated}
                                        isEnrolled={isEnrolled}
                                        toast={toast}

                                    />
                                ))}
                            </TabPanel>

                            <TabPanel>
                                {hasViewed[2] && (loading ? (
                                    <Center>
                                        <Spinner color="blue.500" size="md" />
                                    </Center>
                                ) : (
                                    <Suspense fallback={<Spinner color="blue.500" size="md" />}>
                                        <Review courseId={courseID} />
                                    </Suspense>
                                ))}
                            </TabPanel>

                            <TabPanel>
                                {hasViewed[3] && (
                                    <Comment courseId={courseID} />
                                )}
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
                {/* Right Sidebar */}
                <Box display={{ base: "none", lg: "block" }} position="relative" w="300px">
                    <Box
                        bg="blue.900"
                        color="white"
                        p={4}
                        borderRadius="lg"
                        w="300px"
                        maxH="max-content"
                        position={{ base: "static", md: "fixed" }}
                        right="200px"
                        top="135px"
                        boxShadow="lg"
                    >
                        <Flex mt="1" pb={3} align="center" justify="space-between" borderBottomWidth={2} borderBottomColor="gray.600">
                            {course?.fee >= 0 && (
                                <Flex alignItems="left" direction="column">
                                    <Text fontSize="4xl" fontWeight="bold">
                                        {course?.fee === 0 ? "Miễn phí" : formatCurrency(course?.fee || 0)}
                                    </Text>
                                    <Text ml="2" fontSize="md" textDecoration="line-through" color="gray.400">
                                        {course?.originalFee === 0 ? "" : formatCurrency(course?.originalFee || 0)}
                                    </Text>

                                </Flex>
                            )}
                            {course?.originalFee > 0 && (
                                <Badge colorScheme="red"
                                    ml="2"
                                    px="2"
                                    py="1"
                                    mb={10}
                                    fontSize="sm"
                                    bg="red.500"
                                    color="white"
                                    borderRadius="md">
                                    -{course?.discountPercent || 0}%
                                </Badge>
                            )}
                        </Flex>
                        <VStack align="start" mt={4} spacing={3}>
                            <HStack><Icon as={FaCheckCircle} /><Text>{totalTopics} chủ đề</Text></HStack>
                            <HStack><Icon as={FaBookOpen} /><Text>{totalLessons} bài học</Text></HStack>
                            <HStack><Icon as={FaClipboardList} /><Text>{problems} bài tập</Text></HStack>
                            <HStack><Icon as={FaFingerprint} /><Text>Truy cập trọn đời</Text></HStack>
                            <HStack><Icon as={FaTrophy} /><Text>Chứng chỉ khi hoàn thành</Text></HStack>
                        </VStack>
                        {isEnrolled === true && course?.topics?.[0]?.lessons?.[0]?.lessonID ? (
                            <Flex direction="column" gap={4}>
                                <NavLink to={`${location.pathname}/${course.topics[0].lessons[0].lessonID}`}>
                                    <Button
                                        colorScheme="blue"
                                        mt={4}
                                        w="full"
                                        fontSize="18px"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        _hover={{
                                            transform: "translateY(-3px)",
                                            boxShadow: "0px 4px 10px rgb(39, 87, 246)",
                                            transition: "transform 0.3s ease",
                                        }}
                                    >
                                        Vào học <Icon as={FaArrowRight} ml={2} />
                                    </Button>
                                </NavLink>
                                <Button colorScheme="red" w="full" fontSize="18px" onClick={openDialog}>
                                    Hủy đăng ký
                                </Button>
                            </Flex>
                        ) : (
                            // Ngược lại, hiển thị nút Đăng ký hoặc Mua ngay
                            <Button
                                colorScheme={course?.fee === 0 ? "green" : "red"}
                                mt={4}
                                w="full"
                                fontSize="18px"
                                onClick={handleEnroll}
                            >
                                {course?.fee === 0 ? "Đăng ký miễn phí" : "Mua ngay"}
                            </Button>
                        )}
                    </Box>
                </Box>
            </Flex>
            {/* Dialog hủy đăng ký */}
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={closeDialog}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Xác nhận hủy đăng ký
                        </AlertDialogHeader>

                        <AlertDialogBody textAlign="center" fontSize="xl">
                            Bạn có chắc chắn muốn hủy đăng ký khóa học này? Hành động này không thể hoàn tác.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={closeDialog}>
                                Hủy
                            </Button>
                            <Button colorScheme="red" onClick={() => {
                                closeDialog();
                                handleUnenroll();
                            }} ml={3}>
                                Xác nhận
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
};

export default CourseDetail;
