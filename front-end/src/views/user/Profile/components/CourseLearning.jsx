import React, { useCallback, useEffect, useState } from 'react';
import api from "@/config/apiConfig";
import {
    Box, Text, Divider, Flex, Tabs, Tab, TabList, TabPanels, TabPanel,
    Skeleton,
    HStack
} from '@chakra-ui/react';
import { getList } from '@/config/apiService';
import CourseCarousel from './CourseCarousel';

const CourseLearning = ({ coderID }) => {
    const [courseAll, setCourseAll] = useState([]);
    const [courseList, setCourseList] = useState([]);
    const [courseCompleted, setCourseCompleted] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabIndex, setTabIndex] = useState(0);

    const fetchCourseData = useCallback(async () => {
        try {
            // 1. Lấy danh sách courseID đã enroll
            const enrolledRes = await api.get(`/Enrollment/list-enroll/${coderID}`);
            const enrolledCourseIDs = enrolledRes.data.map(e => e.courseID);

            // 2. Lấy tất cả courses (vẫn lấy hết để hiển thị "tất cả khóa học")
            const response = await getList({
                controller: "Course",
                page: 1,
                pageSize: 100,
                ascending: true,
                totalCount: 100
            });
            const allCourses = response.data || [];

            // Lấy progress hàng loạt
            const progressRes = await api.get('/Progress/courses', {
                params: { courseIds: enrolledCourseIDs, coderId: coderID },
                paramsSerializer: params => {
                    return params.courseIds.map(id => `courseIds=${id}`).join('&') + `&coderId=${params.coderId}`;
                }
            });

            const progresses = progressRes.data;

            // Gắn progress vào toàn bộ allCourses
            const allCoursesWithProgress = allCourses.map(course => {
                const progressObj = progresses.find(p => p.objectID === course.courseID);
                return { ...course, progress: progressObj?.percent ?? 0 };
            });

            // Danh sách khóa học đã enroll (có progress)
            const coursesWithProgress = allCoursesWithProgress.filter(c =>
                enrolledCourseIDs.includes(c.courseID) && c.status === 1
            );

            const incompleteCourses = coursesWithProgress.filter(c => c.progress < 100);

            // Danh sách khóa học đã hoàn thành
            const completedCourses = coursesWithProgress.filter(c => c.progress === 100);

            // Cập nhật state
            setCourseAll(coursesWithProgress);
            setCourseList(incompleteCourses);
            setCourseCompleted(completedCourses);


        } catch (error) {
            console.error("Lỗi fetch course:", error);
        } finally {
            setLoading(false);
        }
    }, [coderID]);


    useEffect(() => {
        fetchCourseData();
    }, [fetchCourseData]);

    return (
        <Box px={6} py={5} minH="50vh" bg="white" borderRadius="md" shadow="md">
            <Tabs variant='soft-rounded' colorScheme='blue' onChange={index => setTabIndex(index)} isLazy>
                <Flex justifyContent="space-between">
                    <Box>
                        <Text fontSize="xl" color="blue.600" fontWeight="bold">
                            Khóa học ({courseList.length})
                        </Text>
                        <Divider w="60px" h="3px" bg="blue.600" borderRadius="md" mt={1} />
                    </Box>

                    <TabList>
                        <Tab>Tất cả khóa học</Tab>
                        <Tab>Đã đăng ký</Tab>
                        <Tab>Đã hoàn tất</Tab>
                    </TabList>
                </Flex>
                <TabPanels>
                    {/* Tab 1: Tất cả khóa học */}
                    <TabPanel>
                        {loading ? (
                            <HStack gap={4}>
                                <Skeleton height="200px" w="100%" />
                                <Skeleton height="200px" w="100%" />
                                <Skeleton height="200px" w="100%" />
                            </HStack>
                        ) : (
                            <CourseCarousel courses={courseAll} activeTabIndex={tabIndex} />
                        )}
                    </TabPanel>
                    {/* Tab 2: Đã đăng ký */}
                    <TabPanel>
                        {loading ? (
                            <HStack gap={4}>
                                <Skeleton height="200px" w="100%" />
                                <Skeleton height="200px" w="100%" />
                                <Skeleton height="200px" w="100%" />
                            </HStack>
                        ) : (
                            <CourseCarousel courses={courseList} activeTabIndex={tabIndex} />
                        )}
                    </TabPanel>
                    {/* Tab 3: Đã hoàn tất */}
                    <TabPanel>
                        {loading ? (
                            <HStack gap={4}>
                                <Skeleton height="200px" w="100%" />
                                <Skeleton height="200px" w="100%" />
                                <Skeleton height="200px" w="100%" />
                            </HStack>
                        ) : (
                            <CourseCarousel courses={courseCompleted} activeTabIndex={tabIndex} />
                        )}
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
};

export default CourseLearning;
