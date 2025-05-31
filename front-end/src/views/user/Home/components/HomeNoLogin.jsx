import React, { Suspense } from "react";
import { Box, Spinner } from "@chakra-ui/react";
import { useHomeData } from "hooks/useHomeData";

// Lazy load các components để giảm initial bundle size
const HeroSection = React.lazy(() => import("./HeroSection/index"));
const CourseSection = React.lazy(() => import("./CourseSection/index"));
const MotivationSection = React.lazy(() => import("./MainContent/index"));
const StatsSection = React.lazy(() => import("./StatSection/index"));
const BlogCalendarSection = React.lazy(() => import("./BlogCarousel/BlogCalendarSection"));

// Loading component tái sử dụng
const SectionLoader = React.memo(({ height = "400px" }) => (
    <Box
        height={height}
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontSize="lg"
        color="gray.500"
    >
        <Spinner thickness="4px" speed="0.65s" color="blue.500" size="xl" />
    </Box>
));

const HomeNoLogin = () => {
    const { courses, blogs, isLoading } = useHomeData();

    return (
        <Box bg="gray.200" minH="100%" pb={10}>
            {/* Hero Section */}
            <Suspense fallback={<SectionLoader height="95vh" />}>
                <HeroSection />
            </Suspense>

            {/* Course Section */}
            <Suspense fallback={<SectionLoader />}>
                <CourseSection courses={courses} isLoading={isLoading} />
            </Suspense>

            {/* Motivation Section */}
            <Suspense fallback={<SectionLoader height="800px" />}>
                <MotivationSection />
            </Suspense>

            {/* Stats Section */}
            <Suspense fallback={<SectionLoader height="200px" />}>
                <StatsSection />
            </Suspense>

            {/* Blog & Calendar Section */}
            <Suspense fallback={<SectionLoader height="600px" />}>
                <BlogCalendarSection blogs={blogs} />
            </Suspense>
        </Box>
    );
};

export default HomeNoLogin;
