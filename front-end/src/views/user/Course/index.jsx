import React, { useEffect, useState, useCallback } from "react";
import { Box, Text, Tabs, TabList, TabPanels, Tab, TabPanel,
    useColorModeValue, useToast,TabIndicator,SimpleGrid } from "@chakra-ui/react";
import { getList } from "config/courseService";
import SkeletonList from "./components/SkeletonList";
import CourseGrid from "./components/CourseGrid";
import ScrollToTop from "components/scroll/ScrollToTop";


export default function Course() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();
    const bg = useColorModeValue("white", "navy.700");
    const textSelect = useColorModeValue("navy.400", "navy.200");

    const fetchCourses = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getList({ page: 1, pageSize: 10, ascending: true, totalCount: 100 });
            setCourses(response.data.filter(course => course.status === 1));
            setLoading(false);
        } catch (error) {
            toast({
                title: "Lỗi khi lấy dữ liệu",
                status: "error",
                duration: 1000,
                isClosable: true,
                position: "top-right",
                variant: "top-accent"
            });
            setLoading(false);
        }
    }, [toast]);


    useEffect(() => { fetchCourses(); }, [fetchCourses]);

    const categories = [...new Set(courses.map(course => course.courseCategoryName))];

    return (
        <ScrollToTop>
        <Box pt={{ base: "130px", md: "80px", xl: "80px" }} w={{ lg: "calc(100% - 360px)", md: "100%" }} mx='auto' px="6">
            <Text fontSize="2xl" fontWeight="bold" mb="4">Danh sách khóa học</Text>
            <Tabs variant="unstyled">
                <TabList mb="4" borderRadius="md" shadow="lg" bg={bg} gap={5} py={2} px={10}>
                    <Tab px={2} _selected={{ color: textSelect, fontWeight:"bold" }}>Tất cả khóa học</Tab>
                    {categories.map((category, index) => (
                        <Tab px={2} key={index} _selected={{ color: textSelect, fontWeight:"bold" }}>{category}</Tab>
                    ))}
                </TabList>
                <TabIndicator mt='-3vh' height='2px' bg='blue.500' borderRadius='full' />
                <TabPanels>
                    <TabPanel>
                        {loading ? <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
                            <SkeletonList />
                            <SkeletonList />
                            <SkeletonList />
                            <SkeletonList />
                        </SimpleGrid>
                        : <CourseGrid courses={courses} />}
                    </TabPanel>
                    {categories.map((category, index) => (
                        <TabPanel key={index}>
                            {loading ? <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
                            <SkeletonList />
                            <SkeletonList />
                            <SkeletonList />
                            <SkeletonList />
                        </SimpleGrid> : (
                                <CourseGrid courses={courses.filter(course => course.courseCategoryName === category)} />
                            )}
                        </TabPanel>
                    ))}
                </TabPanels>
            </Tabs>
        </Box>
        </ScrollToTop>
    );
}
