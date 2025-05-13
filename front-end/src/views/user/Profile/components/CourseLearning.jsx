import React, { useCallback, useEffect, useState } from 'react';
import api from "config/apiConfig";
import {
    Box, Grid
} from '@chakra-ui/react';
import CourseCard from 'views/user/Profile/components/CourseCard';
import { getList } from 'config/apiService';

const CourseLearning = ({ coderID }) => {
    const [courseList, setCourseList] = useState([]);

    const fetchListData = useCallback(async () => {
        try {
            const res = await api.get(`/Enrollment/list-enroll/${coderID}`);
            const enrolledCourses = res.data.map(e => e.courseID);

            const response = await getList({
                controller: "Course",
                page: 1,
                pageSize: 100, // để đảm bảo lấy hết nếu chỉ có phân trang
                ascending: true,
                totalCount: 100
            });
            const activeCourses = response.data
                .filter(course => course.status === 1 && enrolledCourses.includes(course.courseID))
                .slice(0, 4); // chỉ lấy tối đa 4 khóa học

            setCourseList(activeCourses);
        } catch (err) {
            console.log(err);
        }
    }, [coderID]);

    useEffect(() => {
        fetchListData();
    }, [fetchListData]);

    return (
        <Box mt={5}>
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" }} gap="6">
                {courseList.map((course, idx) =>
                    course ? (
                        <CourseCard key={course.courseID} course={course} />
                    ) : (
                        <CourseCard key={`placeholder-${idx}`} isPlaceholder />
                    )
                )}
            </Grid>
        </Box>
    );
};

export default CourseLearning;
