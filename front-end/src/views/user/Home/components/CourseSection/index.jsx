import React, { Suspense } from "react";
import { motion } from "framer-motion";
import {
    Box,
    Container,
    Heading,
    Flex,
    Button,
    SimpleGrid
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

// Lazy load components
const CourseGrid = React.lazy(() => import("@/views/user/Course/components/CourseGrid"));
const SkeletonList = React.lazy(() => import("@/views/user/Course/components/SkeletonList"));

const MotionHeading = motion(Heading);
const MotionBox = motion(Box);

const CourseSection = React.memo(({ courses, isLoading }) => (
    <Box overflow="auto" overflowY="hidden" py={5}>
        <Container maxW="container.xl">
            <Box mt={5} p={6}>
                <Flex align="center" justify="space-between">
                    <MotionHeading
                        size="xl"
                        mb={7}
                        align="center"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        color="blue.500"
                    >
                        Khóa học nổi bật
                    </MotionHeading>
                    <NavLink to="/course">
                        <Button variant="link">Xem tất cả</Button>
                    </NavLink>
                </Flex>
                <MotionBox
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                    <Suspense fallback={
                        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
                            {[...Array(4)].map((_, i) => (
                                <div key={i}>Loading...</div>
                            ))}
                        </SimpleGrid>
                    }>
                        {isLoading ? (
                            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
                                <SkeletonList />
                                <SkeletonList />
                                <SkeletonList />
                                <SkeletonList />
                            </SimpleGrid>
                        ) : (
                            <CourseGrid courses={courses} />
                        )}
                    </Suspense>
                </MotionBox>
            </Box>
        </Container>
    </Box>
));

CourseSection.displayName = 'CourseSection';
export default CourseSection;
