import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Box, Text, Image, Flex, Badge, Icon, Button,
    Tabs, TabList, List, ListItem, TabPanels, Tab, TabPanel, useToast,
    VStack, HStack, Skeleton, SkeletonText,
} from "@chakra-ui/react";
import ScrollToTop from "components/scroll/ScrollToTop";
import { FaClock, FaCheckCircle, FaTrophy, FaUsers, FaStar } from "react-icons/fa";
import { getById } from "config/courseService";
const formatCurrency = (amount) => amount ?
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount) : "0 VND";

const CourseDetail = () => {
    const { slug } = useParams();
    const courseID = parseInt(slug.split("-").pop(), 10);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

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
            return;
        }

        const fetchCourse = async () => {
            try {
                const response = await getById(courseID);
                console.log(response);
                setCourse(response && Object.keys(response).length > 0 ? response : null);
                if (!response || Object.keys(response).length === 0) {
                    toast({
                        title: "Cảnh báo",
                        description: "Không có dữ liệu cho khóa học này.",
                        status: "warning",
                        duration: 3000,
                        isClosable: true,
                    });
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
        };

        fetchCourse();
    }, [courseID, toast]);

    return (
        <ScrollToTop>
            <Box p={6} maxW="100%" mx="auto">
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
                                    <>
                                        <Text fontSize="3xl" letterSpacing={1.2} fontWeight="bold">{course?.courseName}</Text>
                                        <Text mt={2}>{course?.description ?? "Không có mô tả"}</Text>
                                        <HStack mt={4} spacing={4}>
                                            <Text>Tác giả: <Text as="span" color="blue.300">{course?.creatorName}</Text></Text>
                                            <Icon as={FaUsers} /> <Text>{course?.students} Học viên</Text>
                                            <Icon as={FaStar} color="yellow.400" /> <Text>{course?.rating}</Text>
                                        </HStack>
                                    </>
                                )}
                            </Box>
                            {/* Right Sidebar */}
                            <Box
                                w={{ base: "100%", md: "300px" }}
                                display={{ base: "block", md: "none" }}
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
                                        <HStack><Icon as={FaClock} /><Text>20 giờ học</Text></HStack>
                                        <HStack><Icon as={FaCheckCircle} /><Text>18 bài kiểm tra</Text></HStack>
                                        <HStack><Icon as={FaCheckCircle} /><Text>80 bài lập trình</Text></HStack>
                                        <HStack><Icon as={FaCheckCircle} /><Text>Truy cập trọn đời</Text></HStack>
                                        <HStack><Icon as={FaTrophy} /><Text>Chứng chỉ khi hoàn thành</Text></HStack>
                                    </VStack>
                                    <Button colorScheme="green" mt={4} w="full">Đăng ký miễn phí</Button>
                                </Box>
                            </Box>
                        </Flex>

                        {/* Tabs */}
                        <Tabs mt={6} colorScheme="blue" bg="white" borderRadius="md">
                            <TabList>
                                <Tab>Giới thiệu</Tab>
                                <Tab>Giáo trình</Tab>
                                <Tab>Đánh giá</Tab>
                                <Tab>Bình luận</Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    {loading ? <SkeletonText noOfLines={4} spacing={3} /> : <Text>Giới thiệu nội dung khóa học...</Text>}
                                </TabPanel>
                                <TabPanel>
                                    {loading ? (
                                        <SkeletonText noOfLines={5} spacing={4} />
                                    ) : (
                                        <List spacing={3}>
                                            {course?.topics?.map((topic, index) => (
                                                <ListItem
                                                    key={topic.topicID}
                                                    bg="gray.100"
                                                    borderRadius="md"
                                                    p={3}
                                                    transition="all 0.3s"
                                                    _hover={{ bg: "gray.300", transform: "scale(1.02)" }}
                                                >
                                                    <Text fontSize="lg">
                                                        <Text as="span" fontWeight="bold">Chủ đề {index + 1}:</Text> {topic.topicName}
                                                    </Text>
                                                </ListItem>
                                            ))}
                                        </List>
                                    )}
                                </TabPanel>
                                <TabPanel>{loading ? <SkeletonText noOfLines={4} spacing={3} /> : <Text>Đánh giá từ học viên...</Text>}</TabPanel>
                                <TabPanel>{loading ? <SkeletonText noOfLines={4} spacing={3} /> : <Text>Bình luận từ người học...</Text>}</TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Box>
                    {/* Right Sidebar */}
                    <Box display={{ base: "none", md: "block" }} position="relative" w="300px">
                        <Box
                            bg="blue.900"
                            color="white"
                            p={4}
                            borderRadius="lg"
                            w="300px"
                            maxH="max-content"
                            position={{ base: "static", md: "fixed" }}
                            right="220px"
                            top="115px"
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
                                <HStack><Icon as={FaClock} /><Text>20 giờ học</Text></HStack>
                                <HStack><Icon as={FaCheckCircle} /><Text>18 bài kiểm tra</Text></HStack>
                                <HStack><Icon as={FaCheckCircle} /><Text>80 bài lập trình</Text></HStack>
                                <HStack><Icon as={FaCheckCircle} /><Text>Truy cập trọn đời</Text></HStack>
                                <HStack><Icon as={FaTrophy} /><Text>Chứng chỉ khi hoàn thành</Text></HStack>
                            </VStack>
                            <Button colorScheme="green" mt={4} w="full">Đăng ký miễn phí</Button>
                        </Box>
                    </Box>
                </Flex>
            </Box>
        </ScrollToTop>
    );
};

export default CourseDetail;
