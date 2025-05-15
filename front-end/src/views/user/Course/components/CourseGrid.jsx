import React from "react";
import { Grid } from "@chakra-ui/react";
import CourseCard from "./CourseCard";

const CourseGrid = ({ courses }) => (
    <Grid bg="gray.200" templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", xl: "repeat(4, 1fr)" }} gap="6">
        {[...courses, ...Array.from({ length: 4 - courses.length })].map((course, idx) =>
            course ? (
                <CourseCard key={course.courseID} course={course} />
            ) : (
                <CourseCard key={`placeholder-${idx}`} isPlaceholder />
            )
        )}
    </Grid>

);

export default CourseGrid;
