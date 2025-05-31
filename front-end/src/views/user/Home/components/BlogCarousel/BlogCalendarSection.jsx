import React, { Suspense } from "react";
import { motion } from "framer-motion";
import {
    Container,
    Grid,
    GridItem,
    Heading,
    Flex,
    Button,
    Box,
    Spinner
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

// Lazy load components
const BlogCarousel = React.lazy(() => import("../BlogCarousel"));
const MiniCalendar = React.lazy(() => import("components/calendar/MiniCalendar"));

const MotionHeading = motion(Heading);
const MotionBox = motion(Box);

const BlogCalendarSection = React.memo(({ blogs }) => (
    <Container maxW="container.xl" mt={10} px={5}>
        <Grid
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
            gap="10"
            alignItems="stretch"
            h="600px"
        >
            <GridItem colSpan={1} h="100%" maxW="600px" w="100%">
                <Flex alignItems="center" justifyContent="space-between">
                    <MotionHeading
                        size="xl"
                        mb={7}
                        align="start"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        color="blue.500"
                    >
                        Bài viết
                    </MotionHeading>
                    <NavLink to="/blogs">
                        <Button variant="link">Xem tất cả</Button>
                    </NavLink>
                </Flex>
                <MotionBox
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    bg="white"
                    py={5}
                    px={4}
                    borderRadius="md"
                    shadow="md"
                    w="100%"
                    position="relative"
                    overflow="hidden"
                >
                    <Suspense fallback={<Spinner color="blue.500" />}>
                        <BlogCarousel blogs={blogs} />
                    </Suspense>
                </MotionBox>
            </GridItem>

            <GridItem colSpan={1} w="100%" h="100%">
                <MotionHeading
                    size="xl"
                    align="start"
                    mb={7}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    color="blue.500"
                >
                    Hoạt động
                </MotionHeading>
                <MotionBox
                    mt={5}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                    <Suspense fallback={<div>Loading calendar...</div>}>
                        <MiniCalendar
                            borderRadius="md"
                            maxW="100%"
                            minH="466px"
                            textAlign="center"
                            boxShadow="md"
                        />
                    </Suspense>
                </MotionBox>
            </GridItem>
        </Grid>
    </Container>
));

export default BlogCalendarSection;
