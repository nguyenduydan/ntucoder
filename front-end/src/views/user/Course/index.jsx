import React, { useEffect, useState, useCallback } from "react";
import {
    Box, Tabs, TabList, TabPanels, Tab, TabPanel, Center,
    useColorModeValue, useToast, TabIndicator, SimpleGrid, Image
} from "@chakra-ui/react";
import NodataPng from "assets/img/nodata.png";
import { getList } from "@/config/apiService";
import SkeletonList from "./components/SkeletonList";
import CourseGrid from "./components/CourseGrid";
import ScrollToTop from "@/components/scroll/ScrollToTop";
import { useTitle } from "@/contexts/TitleContext";
import Banner from "assets/img/bannerCourse.png";

export default function Course() {
    useTitle("Khóa học");
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();
    const bg = useColorModeValue("white", "navy.700");
    const textSelect = useColorModeValue("navy.400", "navy.200");

    const fetchCourses = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getList({ controller: "Course", page: 1, pageSize: 10, ascending: true, totalCount: 100 });
            setCourses(response.data.filter(course => course.status === 1));
            setLoading(false);
        } catch (error) {
            toast({
                title: "Lỗi khi lấy dữ liệu",
                status: "error",
                description: error.message,
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
            <Box pt={{ base: "130px", md: "80px", xl: "0" }} w={{ lg: "calc(100% - 360px)", md: "100%" }} mx='auto' px="6">
                <Box mb={10} borderRadius="md">
                    <Image src={Banner} alt="NO IMG" rounded="md"></Image>
                </Box>
                <Tabs variant="unstyled">
                    <TabList mb="4" borderRadius="md" shadow="lg" bg={bg} gap={5} py={2} px={10}>
                        <Tab px={2} _selected={{ color: textSelect, fontWeight: "bold" }}>Tất cả khóa học</Tab>
                        {categories.map((category, index) => (
                            <Tab px={2} key={index} _selected={{ color: textSelect, fontWeight: "bold" }}>{category}</Tab>
                        ))}
                    </TabList>
                    <TabIndicator mt='-3vh' height='2px' bg='blue.500' borderRadius='full' />
                    <TabPanels>
                        <TabPanel>
                            {loading ? (
                                <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
                                    <SkeletonList />
                                    <SkeletonList />
                                    <SkeletonList />
                                    <SkeletonList />
                                </SimpleGrid>
                            ) : courses.length === 0 ? (
                                <Center>
                                    <Image src={NodataPng} alt="Không có dữ liệu" boxSize="200px" />
                                </Center>
                            ) : (
                                <CourseGrid courses={courses} />
                            )}
                        </TabPanel>

                        {categories.map((category, index) => {
                            const filtered = courses.filter(course => course.courseCategoryName === category);
                            return (
                                <TabPanel key={index}>
                                    {loading ? (
                                        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
                                            <SkeletonList />
                                            <SkeletonList />
                                            <SkeletonList />
                                            <SkeletonList />
                                        </SimpleGrid>
                                    ) : filtered.length === 0 ? (
                                        <Center>
                                            <Image src={NodataPng} alt="Không có dữ liệu" boxSize="200px" />
                                        </Center>
                                    ) : (
                                        <CourseGrid courses={filtered} />
                                    )}
                                </TabPanel>
                            );
                        })}
                    </TabPanels>

                </Tabs>
            </Box>
        </ScrollToTop>
    );
}
