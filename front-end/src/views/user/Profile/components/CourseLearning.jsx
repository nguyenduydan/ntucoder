import React, { useCallback, useEffect, useState } from 'react';
import api from "@/config/apiConfig";
import {
    Box, Grid, Text, Divider, Flex, Tabs, Tab, TabList, TabPanels, TabPanel
} from '@chakra-ui/react';
import CourseCard from 'views/user/Profile/components/CourseCard';
import { getList } from '@/config/apiService';

const CourseLearning = ({ coderID }) => {
    const [courseAll, setCourseAll] = useState([]);
    const [courseList, setCourseList] = useState([]);
    const [courseCompleted, setCourseCompleted] = useState([]);

    const fetchCourseData = useCallback(async () => {
        try {
            // Lấy danh sách courseID đã enroll
            const enrolledRes = await api.get(`/Enrollment/list-enroll/${coderID}`);
            const enrolledCourseIDs = enrolledRes.data.map(e => e.courseID);

            // Lấy tất cả courses
            const response = await getList({
                controller: "Course",
                page: 1,
                pageSize: 100,
                ascending: true,
                totalCount: 100
            });
            const allCourses = response.data || [];

            const coursesWithProgress = await Promise.all(
                allCourses.map(async (course) => {
                    const courseID = course?.courseID;
                    if (!courseID) return { ...course, progress: 0 };

                    try {
                        const res = await api.get(`/Progress/course?courseId=${courseID}&coderId=${coderID}`);
                        return { ...course, progress: res.data?.percent ?? 0 };
                    } catch {
                        // Không log lỗi nữa nếu courseID không hợp lệ
                        return { ...course, progress: 0 };
                    }
                })
            );

            // Phân loại
            const enrolledCourses = coursesWithProgress
                .filter(c => enrolledCourseIDs.includes(c.courseID) && c.status === 1)
                .slice(0, 4);

            const completedCourses = coursesWithProgress
                .filter(c => c.progress === 100 && c.coderID === coderID)
                .slice(0, 4);

            const allCoursesMap = new Map();
            enrolledCourses.forEach(c => allCoursesMap.set(c.courseID, c));
            completedCourses.forEach(c => allCoursesMap.set(c.courseID, c));

            setCourseAll(Array.from(allCoursesMap.values()));
            setCourseList(enrolledCourses);
            setCourseCompleted(completedCourses);
        } catch (error) {
            console.error("Lỗi fetch course:", error);
        }
    }, [coderID]);

    useEffect(() => {
        fetchCourseData();
    }, [fetchCourseData]);

    return (
        <Box mt={5} px={6} py={2}>
            <Tabs variant='soft-rounded' colorScheme='blue' isManual >
                <Flex justifyContent="space-between">
                    <Text fontSize="xl" color="blue.600" fontWeight="bold">
                        Khóa học ({courseList.length})
                    </Text>

                    <TabList>
                        <Tab>Tất cả khóa học</Tab>
                        <Tab>Đã đăng ký</Tab>
                        <Tab>Đã hoàn tất</Tab>
                    </TabList>
                </Flex>
                <Divider w="50px" h="3px" bg="blue" />
                <TabPanels>
                    {/* Tab 1: Tất cả khóa học */}
                    <TabPanel>
                        {courseAll.length === 0 ? (
                            <Text align="center" fontSize="xl" my={5}>Không có khóa học nào.</Text>
                        ) : (
                            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" }} gap="6">
                                {courseAll.map((course, idx) =>
                                    course ? (
                                        <CourseCard key={course.courseID} course={course} />
                                    ) : (
                                        <CourseCard key={`placeholder-${idx}`} isPlaceholder />
                                    )
                                )}
                            </Grid>
                        )}
                    </TabPanel>
                    {/* Tab 2: Đã đăng ký */}
                    <TabPanel>
                        {courseList.length === 0 ? (
                            <Text align="center" fontSize="xl" my={5}>Không có khóa học nào.</Text>
                        ) : (
                            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" }} gap="6">
                                {courseList.map((course, idx) =>
                                    course ? (
                                        <CourseCard key={course.courseID} course={course} />
                                    ) : (
                                        <CourseCard key={`placeholder-${idx}`} isPlaceholder />
                                    )
                                )}
                            </Grid>
                        )}
                    </TabPanel>
                    {/* Tab 3: Đã hoàn tất */}
                    <TabPanel>
                        {courseCompleted.length === 0 ? (
                            <Text align="center" fontSize="xl" my={5}>Không có khóa học nào.</Text>
                        ) : (
                            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" }} gap="6">
                                {courseCompleted.map((course, idx) =>
                                    course ? (
                                        <CourseCard key={course.courseID} course={course} />
                                    ) : (
                                        <CourseCard key={`placeholder-${idx}`} isPlaceholder />
                                    )
                                )}
                            </Grid>
                        )}
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
};

export default CourseLearning;
