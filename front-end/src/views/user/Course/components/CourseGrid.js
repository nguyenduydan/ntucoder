import React from "react";
import { Grid } from "@chakra-ui/react";
import CourseCard from "./CourseCard";

const CourseGrid = ({ courses }) => (
    <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", xl: "repeat(4, 1fr)" }} gap="6">
        {courses.map((course) => (
            <CourseCard key={course.courseID} course={course} />
        ))}
    </Grid>
);

export default CourseGrid;
