import React, { useCallback, useEffect, useState, useMemo, Suspense } from "react";
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
  HStack,
  Spinner
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import SkeletonList from "../Course/components/SkeletonList";
import { useTitle } from "@/contexts/TitleContext";
import { getList } from "@/config/apiService";
import HeroSection from "./components/HeroSection";
import { useAuth } from "@/contexts/AuthContext";
import HomeNoLogin from "./components/HomeNoLogin";
import api from "@/config/apiConfig";
import { useNavigate } from "react-router-dom";
import CoderAvatar from "../Course/components/CoderAvatar";
import { formatNumber } from "@/utils/utils";

const CourseGrid = React.lazy(() => import("../Course/components/CourseGrid"));
const BlogTopViews = React.lazy(() => import("../Blog/components/BlogTopViews"));
const MiniCalendar = React.lazy(() => import("@/components/calendar/MiniCalendar"));

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
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const { isAuthenticated, coder } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [codersHighest, setCoderHighest] = useState([]);

  const coursePopular = useMemo(() => {
    if (!Array.isArray(courses)) return [];
    return courses
      .filter(course => course.status === 1 && course.enrollCount > 0)
      .sort((a, b) => b.enrollCount - a.enrollCount)
      .slice(0, 4);
  }, [courses]);

  const fetchCourses = useCallback(async () => {
    if (!coder?.coderID) return;
    setLoading(true);
    try {
      const enrolledRes = await api.get(`/Enrollment/list-enroll/${coder.coderID}`);
      const enrolledCourses = Array.isArray(enrolledRes.data)
        ? enrolledRes.data.map(e => e.courseID)
        : [];

      const response = await getList({
        controller: "Course",
        page: 1,
        pageSize: 100,
        ascending: true,
        totalCount: 100
      });

      const allCourses = Array.isArray(response.data) ? response.data : [];
      const activeCourses = allCourses
        .filter(course => course.status === 1 && enrolledCourses.includes(course.courseID))
        .slice(0, 4);

      setCoursesEnrolled(activeCourses);
      setCourses(allCourses); // Save all for useMemo
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
      setCourses([]); // Defensive: ensure state is never undefined
      setCoursesEnrolled([]);
    } finally {
      setLoading(false);
    }
  }, [toast, coder?.coderID]);

  const fetchTopViewedBlogs = async (count = 3) => {
    try {
      const res = await api.get(`/Blog/TopViewed?count=${count}`);
      const blogData = res.data.filter(blog => blog.pinHome === 1);
      setBlogs(blogData);
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

        <MotionBox mb={12} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeInUp} loading="lazy">
          <Heading size="lg" mb={4} color="blue.500">Khóa học phổ biến</Heading>
          {loading ? (
            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
              <SkeletonList />
              <SkeletonList />
              <SkeletonList />
              <SkeletonList />
            </SimpleGrid>
          ) : (
            <Suspense fallback={<Spinner size="xl" color="blue.500" />}>
              <CourseGrid courses={coursePopular} />
            </Suspense>
          )}
        </MotionBox>

        <Flex direction={{ base: "column", md: "row" }} gap={6} align="stretch">
          {/* Bên trái: Bài viết nổi bật */}
          <MotionFlex
            flex={1}
            minH={{ base: "60vh", md: "90vh" }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeInUp}
            flexDirection="column"
          >
            <Heading size="lg" mb={10} color="blue.500">Bài viết nổi bật</Heading>
            <Suspense fallback={<Spinner size="xl" color="blue.500" />}>
              <BlogTopViews blogs={blogs} loading={loading} />
            </Suspense>
          </MotionFlex>

          {/* Bên phải: Hoạt động */}
          <MotionFlex
            flex={1}
            minH={{ base: "60vh", md: "90vh" }}
            display="flex"
            flexDirection="column"
          >
            <Heading size="lg" mb={4} color="blue.500">Hoạt động</Heading>
            <Box flex={1}>
              {/* Top 3 học viên */}
              <MotionBox
                mb={4}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <Heading size="md" mb={5}>Top 3 Học Viên Xuất Sắc</Heading>
                <VStack spacing={3} align="flex-start">
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
                        <Badge colorScheme="green" width="fit-content">{formatNumber(coder.totalPoint) || "0"} điểm</Badge>
                      </Flex>
                    </HStack>
                  ))}
                </VStack>
              </MotionBox>

              <Box mt="auto" transform="scale(0.85)" transformOrigin="top center" w="100%">
                <MotionBox
                  initial={{ opacity: 0, scale: 0.4 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <MiniCalendar
                    maxW="600px"
                    fontSize="lg"
                    boxShadow="md"
                  />
                </MotionBox>
              </Box>
            </Box>
          </MotionFlex>
        </Flex>
      </Container>
    </ChakraBox>
  );
};

export default Home;
