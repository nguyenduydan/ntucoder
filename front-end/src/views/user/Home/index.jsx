import React, { useCallback, useEffect, useState } from "react";
import {
  Box as ChakraBox,
  Flex as ChakraFlex,
  Heading,
  Text,
  useToast,
  SimpleGrid,
  Image,
  Container,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import SkeletonList from "../Course/components/SkeletonList";
import { useTitle } from "@/contexts/TitleContext";
import CourseGrid from "../Course/components/CourseGrid";
import { getList } from "@/config/apiService";
import HeroSection from "./components/HeroSection";
import { useAuth } from "@/contexts/AuthContext";
import HomeNoLogin from "./components/HomeNoLogin";
import ScrollToTop from "@/components/scroll/ScrollToTop";
import Logo from "assets/img/logo.png";
import api from "@/config/apiConfig";

const MotionBox = motion(ChakraBox);
const MotionFlex = motion(ChakraFlex);


const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const Home = () => {
  useTitle("Trang chủ");
  const [coursesEnrolled, setCoursesEnrolled] = useState([]);
  const [courses, setCoursePopular] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const { isAuthenticated, coder } = useAuth();


  const fetchCourses = useCallback(async () => {
    if (!coder?.coderID) return;
    setLoading(true);
    try {
      const enrolledRes = await api.get(`/Enrollment/list-enroll/${coder.coderID}`);
      const enrolledCourses = enrolledRes.data.map(e => e.courseID); // Lấy danh sách courseID

      // Lấy danh sách tất cả course
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

      const coursePopular = response.data
        .filter(course => course.totalReviews >= 0)
        .sort((a, b) => b.totalReviews - a.totalReviews)
        .slice(0, 4);

      setCoursesEnrolled(activeCourses);
      setCoursePopular(coursePopular);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast({
        title: "Lỗi khi lấy dữ liệu",
        status: "error",
        duration: 1000,
        isClosable: true,
        position: "top-right",
        variant: "top-accent"
      });
    } finally {
      setLoading(false);
    }
  }, [toast, coder?.coderID]);

  useEffect(() => {
    if (isAuthenticated && coder?.coderID) {
      fetchCourses();
    }
  }, [isAuthenticated, coder?.coderID, fetchCourses]);

  if (!isAuthenticated) {
    return (
      <HomeNoLogin />
    );
  }

  return (
    <ScrollToTop>
      <Container maxW="7xl" py={5} minH="100%" overflow="auto" overflowY="hidden">
        <HeroSection />
        <MotionBox mb={12} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeInUp}>
          <Heading size="lg" mb={4} color="blue.500">Khóa học đang học</Heading>
          {loading ? (
            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
              <SkeletonList />
              <SkeletonList />
              <SkeletonList />
              <SkeletonList />
            </SimpleGrid>
          ) : (
            <CourseGrid courses={coursesEnrolled} />
          )}
        </MotionBox>

        <MotionBox mb={12} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeInUp}>
          <Heading size="lg" mb={4} color="blue.500">Khóa học phổ biến</Heading>
          {loading ? (
            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
              <SkeletonList />
              <SkeletonList />
              <SkeletonList />
              <SkeletonList />
            </SimpleGrid>
          ) : (
            <CourseGrid courses={courses} />
          )}
        </MotionBox>

        <MotionFlex
          direction={{ base: "column", md: "row" }}
          alignItems="center"
          gap={6}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <ChakraBox flex={1}>
            <Image src={Logo} alt="About us" borderRadius="xl" />
          </ChakraBox>
          <ChakraBox flex={2} bg="gray.100" px={5} py={3} borderRadius="md" boxShadow="md">
            <Heading size="md" mb={4}>Về chúng tôi</Heading>
            <Text color="gray.700">
              Website Khóa Học là nền tảng học trực tuyến mang lại trải nghiệm học tập linh hoạt, phù hợp với mọi đối tượng người dùng. Với nội dung được biên soạn bởi các chuyên gia, bạn sẽ được học tập một cách hiệu quả và có định hướng rõ ràng.
            </Text>
          </ChakraBox>
        </MotionFlex>
      </Container>
    </ScrollToTop>
  );
};

export default Home;
