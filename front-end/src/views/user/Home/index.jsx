import React, { useCallback, useEffect, useState } from "react";
import {
  Box as ChakraBox,
  Flex as ChakraFlex,
  Heading,
  Text,
  useToast,
  SimpleGrid,
  Box,
  Container,
  Flex,
  Button,
  VStack,
  Badge,
  HStack
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
import api from "@/config/apiConfig";
import { useNavigate } from "react-router-dom";
import BlogTopViews from "../Blog/components/BlogTopViews";
import CoderAvatar from "../Course/components/CoderAvatar";
import MiniCalendar from "@/components/calendar/MiniCalendar";

const MotionBox = motion(ChakraBox);
const MotionFlex = motion(ChakraFlex);


const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};


const Home = () => {
  useTitle("Trang chủ");
  const [coursesEnrolled, setCoursesEnrolled] = useState([]);
  const [courses, setCoursePopular] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const { isAuthenticated, coder } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [codersHighest, setCoderHighest] = useState([]);

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

  const fetchTopViewedBlogs = async (count = 3) => {
    try {
      const res = await api.get(`/Blog/TopViewed?count=${count}`);
      setBlogs(res.data);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchTop3 = async () => {
    setLoading(true);
    try {
      const res = await api.get('/Coder/top-hightest');
      if (res.status === 200) {
        setCoderHighest(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch top 3 coders:', error);
      toast({
        title: 'Failed to fetch data',
        description: error.message,
        status: 'error',
        duration: 2000,
        isClosable: true,
        variant: 'top-accent',
        position: 'top'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTop3();
    fetchTopViewedBlogs();
  }, []);

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
      <ChakraBox maxW="full" minH="100%" overflow="auto" overflowY="hidden">
        <HeroSection />
        <Container maxW="7xl" >
          <MotionBox mt={10} mb={12} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeInUp}>
            <Flex>
              <Heading size="lg" mb={4} color="blue.500">Khóa học đang học</Heading>
              <Button ml="auto" colorScheme="teal" variant="link" onClick={() => navigate("/course")}>Xem thêm</Button>
            </Flex>

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
            gap={10}
            mb={12}
          >
            <ChakraBox
              flex={1}
              minH={{ base: "50vh", md: "76vh" }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Heading size="lg" mb={10} color="blue.500">Bài viết nổi bật</Heading>
              <BlogTopViews blogs={blogs} loading={loading} />
            </ChakraBox>

            <ChakraBox flex={0.7} minH={{ base: "50vh", md: "85vh" }}>
              <Heading size="lg" mb={4} color="blue.500">Hoạt động</Heading>
              <Box>
                {/* Top 3 học viên */}
                <Box
                  mb={5}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                >
                  <Heading size="md" mb={5}>Top 3 Học Viên Xuất Sắc</Heading>
                  <VStack direction="row" spacing={3} justify="flex-start" align="flex-start" >
                    {codersHighest.map((coder, index) => (
                      <HStack
                        key={index}
                        bg="white"
                        w="100%"
                        px={4}
                        py={3}
                        borderRadius="full"
                        boxShadow="md"
                        onClick={() => navigate(`/profile/${coder.coderID}`)}
                        cursor="pointer"
                        _hover={{ bg: "navy.300" }}
                        transition="all 0.2s ease-in-out"
                      >
                        <CoderAvatar src={coder.avatar} size="lg" name={coder.coderName} />
                        <Flex direction="column">
                          <Text fontWeight="bold">{coder.coderName}</Text>
                          <Badge colorScheme="green" width="fit-content">{coder.point || "0"} điểm</Badge>
                        </Flex>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
                <MotionBox
                  initial={{ opacity: 0, scale: 0.4 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  {/* Dòng 2: "Về chúng tôi" và Lịch */}
                  <MiniCalendar maxW="500px" fontSize="sm" maxH="400px" boxShadow="md" />
                </MotionBox>
              </Box>
            </ChakraBox>
          </MotionFlex>
        </Container>
      </ChakraBox>
    </ScrollToTop>
  );
};

export default Home;
