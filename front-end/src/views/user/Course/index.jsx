import React,{ useEffect, useState, useCallback } from "react";
import {
    Box, Text, Grid, Image, Badge, Flex, Skeleton, SkeletonText, useToast,
    Tabs, TabList, TabPanels, Tab, TabPanel,TabIndicator,useColorModeValue
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { darken, lighten } from "@chakra-ui/theme-tools";
//import data
import { getList } from "config/courseService";
const formatCurrency = (amount) => {
    return amount ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount) : "0 VND";
};

const getLuminance = (hex) => {
    hex = hex.replace(/^#/, "");
    if (hex.length === 3) {
        hex = hex.split("").map((c) => c + c).join("");
    }
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const getTextColor = (bgColor) => {
    return getLuminance(bgColor) > 0.5 ? darken(bgColor, 30) : lighten(bgColor, 50);
};


const CourseCard = ({ course }) => {
    const textColor = getTextColor(course.badgeColor);
    const bgCard = useColorModeValue("white", "navy.900");

    return (
        <Box minW={{md:"20vh", base:"100%"}} _hover={{ transform: "scale(1.02)" }} transition="all .2s ease-in-out"
         borderWidth="1px" bg={bgCard} borderRadius="lg" overflow="hidden" boxShadow="md">
            <Image src={course.imageUrl || "/avatarSimmmple.png"} alt={course.title} objectFit="cover" h="160px" w="full" />
            <Box p="4">
                <Badge bg={course.badgeColor} textColor={textColor} px="2" borderRadius="md">
                    {course.badgeName}
                </Badge>
                <Text fontSize="lg" fontWeight="bold" mt="2">
                    {course.courseName}
                </Text>
                <Flex align="center" mt="2">
                    <Text ml="1" fontSize="sm" color="gray.400">
                       {course.creatorName}
                    </Text>
                </Flex>
                <Flex align="center" mt="2">
                    <StarIcon color="yellow.400" />
                    <Text ml="1" fontSize="sm" fontWeight="medium">
                        {course.rating}
                    </Text>
                </Flex>
                <Flex mt="3" align="center" justify="space-between">
                    {course.fee === 0 ? (
                        <Text fontSize="lg" fontWeight="bold" color="green.500">
                            Miễn phí
                        </Text>
                    ) : (
                        <Text fontSize="lg" fontWeight="bold" color="red.500">
                            {formatCurrency(course.fee)}
                        </Text>
                    )}
                    {course.originalFee > 0 && (
                        <Flex alignItems="center">
                            <Text ml="2" fontSize="sm" textDecoration="line-through" color="gray.400">
                                {formatCurrency(course.originalFee)}
                            </Text>
                            <Badge colorScheme="red" ml="2" px="1">
                                {course.discountPercent}%
                            </Badge>
                        </Flex>
                    )}
                </Flex>
            </Box>
        </Box>
    );
};



export default function Course() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();
    const bg = useColorModeValue("white", "navy.700");
    const textSelect = useColorModeValue("navy.400", "navy.200");

    const fetchCourses = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getList({
                page: 1,
                pageSize: 10,
                ascending: true,
                totalCount: 100,
            });

            const filteredCourses = response.data.filter(course => course.status === 1);

            setCourses(filteredCourses);
        } catch (error) {
            toast({
                title: "Lỗi khi lấy dữ liệu",
                description: "Không thể tải danh sách khóa học. Vui lòng thử lại sau.",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);




    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    const categories = [...new Set(courses.map(course => course.courseCategoryName))];

    return (
        <Box pt={{ base: "130px", md: "80px", xl: "80px" }} px="6">
            <Text fontSize="2xl" fontWeight="bold" mb="4">
                Danh sách khóa học
            </Text>

            <Tabs variant='unstyled'position='relative' colorScheme="blue">
                <TabList mb="4" shadow="lg" bg={bg}  gap={10} py={2} px={10}>
                    <Tab px={1} fontWeight="bold" _selected={{ color: textSelect }}>Tất cả</Tab>
                    {categories.map((category, index) => (
                        <Tab px={1} fontWeight="bold" key={index} _selected={{ color: textSelect }}>
                            {category}
                        </Tab>
                    ))}
                </TabList>
                <TabIndicator mt='-3vh' height='2px' bg='blue.500' borderRadius='1px' />
                <TabPanels>
                    <TabPanel>
                        {loading ? (
                            <SkeletonList />
                        ) : (
                            <CourseGrid courses={courses} />
                        )}
                    </TabPanel>
                    {categories.map((category, index) => (
                        <TabPanel key={index}>
                            {loading ? (
                                <SkeletonList />
                            ) : (
                                <CourseGrid courses={courses.filter(course => course.courseCategoryName === category)}  />
                            )}
                        </TabPanel>
                    ))}
                </TabPanels>

            </Tabs>
        </Box>
    );
}


const SkeletonList = () => (
    <Box p="4">
        <Skeleton height="20px" width="150px" mb="4" />
        <Skeleton height="160px" width="100%" mb="4" />
        <SkeletonText mt="4" noOfLines={3} spacing="4" />
    </Box>
);

const CourseGrid = ({ courses }) => (
    <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", xl: "repeat(4, 1fr)" }}  gap="6">
        {courses.map((course) => (
            <CourseCard key={course.courseID} course={course}  />
        ))}
    </Grid>
);
