import React, { useCallback, useEffect, useState } from 'react';
import api from "@/config/apiConfig";
import {
    Box, Grid, Text, Divider, Flex, Tabs, Tab, TabList, TabPanels, TabPanel
} from '@chakra-ui/react';
import CourseCard from 'views/user/Profile/components/CourseCard';
import { getList } from '@/config/apiService';
import MiniCalendar from 'components/calendar/MiniCalendar';

const CourseLearning = ({ coderID }) => {
    const [courseList, setCourseList] = useState([]);
    const fetchListData = useCallback(async () => {
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

    useEffect(() => {
        fetchListData();
    }, [fetchListData]);

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
                    <TabPanel>
                        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" }} gap="6">
                            {courseList.map((course, idx) =>
                                course ? (
                                    <CourseCard key={course.courseID} course={course} />
                                ) : (
                                    <CourseCard key={`placeholder-${idx}`} isPlaceholder />
                                )
                            )}
                        </Grid>
                    </TabPanel>
                    <TabPanel>
                        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" }} gap="6">
                            {courseList.map((course, idx) =>
                                course ? (
                                    <CourseCard key={course.courseID} course={course} />
                                ) : (
                                    <CourseCard key={`placeholder-${idx}`} isPlaceholder />
                                )
                            )}
                        </Grid>
                    </TabPanel>
                    <TabPanel>
                        <MiniCalendar />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
};

export default CourseLearning;
