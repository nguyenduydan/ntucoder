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
import ntuImage from "assets/img/ntu-coders.png";
import { useTitle } from "contexts/TitleContext";
import CourseGrid from "../Course/components/CourseGrid";
import { getList } from "config/apiService";
import { Background } from "./components/Background";

const MotionBox = motion(ChakraBox);
const MotionFlex = motion(ChakraFlex);

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const Home = () => {
  useTitle("Trang chủ");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getList({ controller: "Course", page: 1, pageSize: 10, ascending: true, totalCount: 100 });
      const activeCourses = response.data.filter(course => course.status === 1).slice(0, 4);
      setCourses(activeCourses);
    } catch (error) {
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
  }, [toast]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return (
    <Container maxW="7xl" py={5}>
      <MotionBox
        textAlign="center"
        mb={10}
        bgGradient="linear(to-r, blue.500, green.500)"
        p={8}
        borderRadius="lg"
        boxShadow="lg"
        color="white"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <Heading size="xl">Chào mừng bạn đến với Website NTU-Coder</Heading>
        <Text fontSize="lg" color="gray.300" mt={4}>
          Khám phá hàng trăm khóa học chất lượng từ cơ bản đến nâng cao.
        </Text>

      </MotionBox>
      <MotionFlex alignItems="center"
        justifyContent="center"  // Căn giữa theo chiều ngang
        direction="column"
        mb={4} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeInUp}>
        <Background />
      </MotionFlex>
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
          <CourseGrid courses={courses} />
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
          <Image src={ntuImage} alt="About us" borderRadius="xl" />
        </ChakraBox>
        <ChakraBox flex={2} bg="gray.100" px={5} py={3} borderRadius="md" boxShadow="md">
          <Heading size="md" mb={4}>Về chúng tôi</Heading>
          <Text color="gray.700">
            Website Khóa Học là nền tảng học trực tuyến mang lại trải nghiệm học tập linh hoạt, phù hợp với mọi đối tượng người dùng. Với nội dung được biên soạn bởi các chuyên gia, bạn sẽ được học tập một cách hiệu quả và có định hướng rõ ràng.
          </Text>
        </ChakraBox>
      </MotionFlex>
    </Container>
  );
};

export default Home;
