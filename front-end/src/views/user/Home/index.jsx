import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  useToast,
  SimpleGrid,
  Image,
  Container,
  useColorModeValue,
} from "@chakra-ui/react";
import SkeletonList from "../Course/components/SkeletonList";
import ntuImage from "assets/img/ntu-coders.png";
import { useTitle } from "contexts/TitleContext";
import CourseGrid from "../Course/components/CourseGrid";
import { getList } from "config/apiService";

const Home = () => {
  useTitle("Trang chủ");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const bg = useColorModeValue("white", "navy.700");

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getList({ controller: "Course", page: 1, pageSize: 10, ascending: true, totalCount: 100 });
      const activeCourses = response.data
        .filter((course) => course.status === 1)
        .slice(0, 4); // Limit to 4 courses for the grid

      setCourses(activeCourses);
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

  const popularCourses = [
    { title: "JavaScript Mastery", description: "Deep dive into JS concepts.", image: "https://via.placeholder.com/300" },
    { title: "Python for Beginners", description: "Start your Python journey here.", image: "https://via.placeholder.com/300" },
    { title: "UI/UX Design", description: "Design modern, user-friendly interfaces.", image: "https://via.placeholder.com/300" },
  ];

  return (
    <Container maxW="7xl" py={5}>
      {/* Introduction Section */}
      <Box
        textAlign="center"
        mb={10}
        bgGradient={"linear(to-r, blue.500, green.500)"}
        p={8}
        borderRadius="lg"
        boxShadow="lg"
        color="white">
        <Heading size="xl">Chào mừng bạn đến với Website NTU-Coder</Heading>
        <Text fontSize="lg" color="gray.300" mt={4}>
          Khám phá hàng trăm khóa học chất lượng từ cơ bản đến nâng cao.
        </Text>
      </Box>

      {/* Ongoing Courses */}
      <Box mb={12}>
        <Heading size="lg" mb={4} color="blue.500">Khóa học đang học</Heading>
        {loading ? <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
          <SkeletonList />
          <SkeletonList />
          <SkeletonList />
          <SkeletonList />
        </SimpleGrid>
          : <CourseGrid courses={courses} />}
      </Box>

      {/* Popular Courses */}
      <Box mb={12}>
        <Heading size="lg" mb={4} color="blue.500">Khóa học phổ biến</Heading>
        {loading ? <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
          <SkeletonList />
          <SkeletonList />
          <SkeletonList />
          <SkeletonList />
        </SimpleGrid>
          : <CourseGrid courses={courses} />}
      </Box>

      {/* About Section */}
      <Flex direction={{ base: "column", md: "row" }} alignItems="center" gap={6}>
        <Box flex={1}>
          <Image src={ntuImage} alt="About us" borderRadius="xl" />
        </Box>
        <Box flex={2} bg="gray.100" px={5} py={3} borderRadius="md" boxShadow="md">
          <Heading size="md" mb={4}>Về chúng tôi</Heading>
          <Text color="gray.700">
            Website Khóa Học là nền tảng học trực tuyến mang lại trải nghiệm học tập linh hoạt, phù hợp với mọi đối tượng người dùng. Với nội dung được biên soạn bởi các chuyên gia, bạn sẽ được học tập một cách hiệu quả và có định hướng rõ ràng.
          </Text>
        </Box>
      </Flex>
    </Container>
  );
};

export default Home;
