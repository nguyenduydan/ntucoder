import React, { useCallback, useEffect, useState } from 'react';
import api from "@/config/apiConfig";
import {
    Box, Grid, Text, Divider, Flex, Tabs, Tab, TabList, TabPanels, TabPanel
} from '@chakra-ui/react';
import CourseCard from 'views/user/Profile/components/CourseCard';
import { getList } from '@/config/apiService';
import MiniCalendar from 'components/calendar/MiniCalendar';

const CourseLearning = ({ coderID }) => {
    const [courseAll, setCourseAll] = useState([]);
    const [courseList, setCourseList] = useState([]);
    const [courseCompleted, setCourseCompleted] = useState([]);

    const fetchCourseEnrolled = useCallback(async () => {
        try {
            const res = await api.get(`/Enrollment/list-enroll/${coderID}`);
            const enrolledCourses = res.data.map(e => e.courseID);

            const response = await getList({
                controller: "Course",
                page: 1,
                pageSize: 100,
                ascending: true,
                totalCount: 100
            });

            const activeCourses = response.data
                .filter(course => course.status === 1 && enrolledCourses.includes(course.courseID))
                .slice(0, 4);

            setCourseList(activeCourses);
        } catch (err) {
            console.log(err);
        }
    }, [coderID]);

    const fetchCourseCompleted = useCallback(async () => {
        try {
            const response = await getList({
                controller: "Course",
                page: 1,
                pageSize: 100,
                ascending: true,
                totalCount: 100,
            });

            const courses = response.data;

            // Lấy progress cho từng course
            const coursesWithProgress = await Promise.all(
                courses.map(async (course) => {
                    try {
                        const progressRes = await api.get(`/Progress/course?courseId=${course.courseID}?coderId=${coderID}`);
                        return {
                            ...course,
                            progress: progressRes.data.percent ?? 0,
                        };
                    } catch (error) {
                        console.error(`Lỗi lấy progress courseId=${course.courseID}`, error);
                        return {
                            ...course,
                            progress: 0,
                        };
                    }
                })
            );

            // Lọc course đã hoàn thành (progress 100%)
            const completedCourses = coursesWithProgress
                .filter(c => c.progress === 100 && c.coderID === coderID)
                .slice(0, 4);

            setCourseCompleted(completedCourses);
        } catch (err) {
            console.error(err);
        }
    }, [coderID]);

    const fetchCourseAll = useCallback(async () => {
        try {
            // Lấy danh sách course enrolled (trả về array courseID)
            const enrolledRes = await api.get(`/Enrollment/list-enroll/${coderID}`);
            const enrolledCourseIDs = enrolledRes.data.map(e => e.courseID);

            // Lấy tất cả course (để lọc enrolled và completed)
            const response = await getList({
                controller: "Course",
                page: 1,
                pageSize: 100,
                ascending: true,
                totalCount: 100,
            });
            const courses = response.data;

            // Lấy progress cho từng course
            const coursesWithProgress = await Promise.all(
                courses.map(async (course) => {
                    try {
                        const progressRes = await api.get(`/Progress/course?courseId=${course.objectID}`);
                        return {
                            ...course,
                            progress: progressRes.data.percent ?? 0,
                        };
                    } catch (error) {
                        console.error(`Lỗi lấy progress courseId=${course.objectID}`, error);
                        return {
                            ...course,
                            progress: 0,
                        };
                    }
                })
            );

            // Lọc course enrolled theo courseID và status 1 (active)
            const enrolledCourses = coursesWithProgress.filter(
                c => enrolledCourseIDs.includes(c.courseID) && c.status === 1
            );

            // Lọc course completed progress 100% và coderID đúng
            const completedCourses = coursesWithProgress.filter(
                c => c.progress === 100 && c.coderID === coderID
            );

            // Gộp 2 danh sách và loại bỏ trùng
            const allCoursesMap = new Map();
            enrolledCourses.forEach(c => allCoursesMap.set(c.courseID, c));
            completedCourses.forEach(c => allCoursesMap.set(c.courseID, c)); // ghi đè nếu trùng

            const allCourses = Array.from(allCoursesMap.values());

            setCourseAll(allCourses);
        } catch (error) {
            console.error(error);
        }
    }, [coderID]);


    useEffect(() => {
        fetchCourseAll();
        fetchCourseEnrolled();
        fetchCourseCompleted();
    }, [fetchCourseEnrolled, fetchCourseCompleted]);

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
