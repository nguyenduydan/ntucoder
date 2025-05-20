import React, { useCallback, useEffect, useState } from "react";
import {
    Box,
    Heading,
    Text,
    VStack,
    HStack,
    Image,
    SimpleGrid,
    Container,
    Flex,
    Button,
    Grid,
    GridItem,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import CodingPng from "assets/img/profile/gummy-coding.png";

import { getList } from "@/config/apiService";
import CourseGrid from "@/views/user/Course/components/CourseGrid";
import SkeletonList from "@/views/user/Course/components/SkeletonList";

import AnimateText from "components/animate/AnimateText";
import Counter from "components/animate/Count";

import { FaArrowRight } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import MiniCalendar from "components/calendar/MiniCalendar";
import ScrollToTop from "@/components/scroll/ScrollToTop";
import api from "@/config/apiConfig";
import BlogCaurosel from "./BlogCaurosel";


const MotionBox = motion(Box);
const MotionVStack = motion(VStack);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);
const MotionButton = motion(Button);

const fadeInVariant = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.5, ease: "easeInOut" },
    },
};

const slideUpVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeInOut" },
    },
};

const zoomInVariant = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, ease: "easeInOut" },
    },
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
};

const draw = {
    hidden: {
        pathLength: 0,
        opacity: 0,
        transition: {
            pathLength: {
                duration: 1.5,
                ease: "easeInOut"
            },
            opacity: {
                duration: 1.5,
                ease: "easeInOut"
            }
        }
    },

    visible: (i) => {
        const delay = i * 0.5;
        return {
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: { delay, type: "spring", duration: 1.5, bounce: 0 },
                opacity: { delay, duration: 0.01 }
            }
        };
    }
};


const HomeNoLogin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [rotate, setRotate] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = -(y - centerY) / 10;
        const rotateY = (x - centerX) / 10;

        setRotate({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setRotate({ x: 0, y: 0 });
    };

    // Show list course popular
    const fetchCourses = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await getList({ controller: "Course", page: 1, pageSize: 10 });

            const sortedCourses = res.data
                .filter(c => c.totalReviews >= 0)
                .sort((a, b) => b.totalReviews - a.totalReviews);

            const coursePopular = sortedCourses.slice(0, 4);

            setCourses(coursePopular);
        } catch (error) {
            console.log("Không có dữ liệu bài học");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchBlogs = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await api.get(`/Blog`);
            if (res.status === 200) {
                setBlogs(Array.isArray(res.data.data) ? res.data.data : []);
            }

        } catch (error) {
            console.log("Không có dữ liệu bài học");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);


    // Dùng useMemo để lọc & sắp xếp blog có pinHome và viewCount cao
    const topPinnedBlogs = React.useMemo(() => {
        if (!Array.isArray(blogs)) return [];

        return blogs
            .filter(b => b.pinHome === 1 && typeof b.viewCount === 'number')
            .sort((a, b) => b.viewCount - a.viewCount)
            .slice(0, 5);
    }, [blogs]);


    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <ScrollToTop>
            <Box bg="gray.200" minH="100%" pb={10}>
                {/* Hero Section */}
                <Box
                    bgGradient="linear(to-b, rgb(1, 6, 56),rgb(10, 22, 159), rgb(9, 112, 175),rgb(63, 153, 202),gray.200)"
                    minH="95vh"
                >
                    <MotionVStack
                        align="center"
                        justify="center"
                        spacing={8}
                        variants={fadeInVariant}
                        initial="hidden"
                        animate={"visible"}
                        px={8}
                        py={12}
                    >
                        {/* background  */}
                        <motion.svg
                            width="600"
                            height="600"
                            viewBox="0 0 600 600"
                            initial="hidden"
                            animate="visible"
                            style={image}
                        >
                            <motion.circle
                                className="circle-path"
                                cx="100"
                                cy="100"
                                r="80"
                                stroke="#ff0088"
                                variants={draw}
                                custom={1}
                                style={shape}
                            />
                            <motion.line
                                x1="220"
                                y1="30"
                                x2="360"
                                y2="170"
                                stroke="#8df0cc"
                                variants={draw}
                                custom={2}
                                style={shape}
                            />
                            <motion.line
                                x1="220"
                                y1="170"
                                x2="360"
                                y2="30"
                                stroke="#8df0cc"
                                variants={draw}
                                custom={2.5}
                                style={shape}
                            />
                            <motion.rect
                                width="140"
                                height="140"
                                x="410"
                                y="30"
                                rx="20"
                                stroke="#0d63f8"
                                variants={draw}
                                custom={3}
                                style={shape}
                            />
                            <motion.circle
                                cx="100"
                                cy="300"
                                r="80"
                                stroke="#0d63f8"
                                variants={draw}
                                custom={2}
                                style={shape}
                            />
                            <motion.line
                                x1="220"
                                y1="230"
                                x2="360"
                                y2="370"
                                stroke="#ff0088"
                                custom={3}
                                variants={draw}
                                style={shape}
                            />
                            <motion.line
                                x1="220"
                                y1="370"
                                x2="360"
                                y2="230"
                                stroke="#ff0088"
                                custom={3.5}
                                variants={draw}
                                style={shape}
                            />
                            <motion.rect
                                width="140"
                                height="140"
                                x="410"
                                y="230"
                                rx="20"
                                stroke="#8df0cc"
                                custom={4}
                                variants={draw}
                                style={shape}
                            />
                            <motion.circle
                                cx="100"
                                cy="500"
                                r="80"
                                stroke="#8df0cc"
                                variants={draw}
                                custom={3}
                                style={shape}
                            />
                            <motion.line
                                x1="220"
                                y1="430"
                                x2="360"
                                y2="570"
                                stroke="#0d63f8"
                                variants={draw}
                                custom={4}
                                style={shape}
                            />
                            <motion.line
                                x1="220"
                                y1="570"
                                x2="360"
                                y2="430"
                                stroke="#0d63f8"
                                variants={draw}
                                custom={4.5}
                                style={shape}
                            />
                            <motion.rect
                                width="140"
                                height="140"
                                x="410"
                                y="430"
                                rx="20"
                                stroke="#ff0088"
                                variants={draw}
                                custom={5}
                                style={shape}
                            />
                        </motion.svg>
                        <HStack
                            spacing={{ base: 4, md: 12 }}  // Điều chỉnh khoảng cách giữa các phần tử khi màn hình nhỏ
                            align="center"
                            justifyContent="space-between"
                            flexWrap="wrap"
                            w="100%"
                            zIndex={1}
                            flexDirection={{ base: "column", md: "row" }}
                        >
                            {/* Cột trái: Danh sách tiêu đề */}
                            <VStack align="start" spacing={6} flex="1" px={{ base: "40px", md: "240px" }}>
                                <MotionHeading
                                    size={{ base: "xl", md: "2xl" }}
                                    lineHeight={{ base: "1.2", md: "1.2" }}
                                    color="#fff"
                                    mb="10px"
                                    variants={zoomInVariant}
                                    initial="hidden"
                                    animate="visible"
                                    textShadow="
                                    0 0 2px #fff,
                                    0 0 2px #00aaff,
                                    0 0 6px #00aaff,
                                    0 0 10px #00aaff"
                                >
                                    Website học lập trình trực tuyến dành cho sinh viên
                                </MotionHeading>
                                <VStack spacing={4} align="start">
                                    <MotionVStack
                                        spacing={4}
                                        align="start"
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"

                                    >
                                        {[
                                            "+ Học lập trình từ 0",
                                            "+ Khơi dậy đam mê công nghệ",
                                            "+ Chinh phục thế giới số, khẳng định bản thân",
                                            "+ Mở ra cơ hội việc làm hấp dẫn trong tương lai",
                                        ].map((text, index) => (
                                            <MotionText
                                                key={index}
                                                color="white"
                                                variants={itemVariants}
                                                bg="blue.900"
                                                opacity={0.8}
                                                px={4}
                                                py={2}
                                                whileHover={{
                                                    scale: 1.05,
                                                    x: 10,
                                                }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                                cursor="default"
                                            >
                                                {text}
                                            </MotionText>
                                        ))}
                                    </MotionVStack>
                                </VStack>
                            </VStack>

                            {/* Cột phải: Nội dung tương ứng */}
                            <VStack align="start" spacing={6} flex="1" >
                                <MotionBox
                                    flex="1"
                                    onMouseMove={handleMouseMove}
                                    onMouseLeave={handleMouseLeave}
                                    style={{
                                        perspective: 1000,
                                        transformStyle: "preserve-3d",
                                    }}
                                    animate={{
                                        rotateX: rotate.x,
                                        rotateY: rotate.y,
                                        scale: 1.05,
                                    }}
                                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                    flexWrap="wrap"
                                >
                                    <motion.div variants={zoomInVariant}>
                                        <Image
                                            mt={20}
                                            src={CodingPng}
                                            alt="Lập trình viên đang code"
                                            borderRadius="xl"
                                            maxW={{ base: "100%", sm: "100%" }}  // Điều chỉnh chiều rộng ảnh theo màn hình
                                        />
                                    </motion.div>
                                </MotionBox>
                            </VStack>
                        </HStack>

                    </MotionVStack>
                </Box>
                {/* About Section */}
                <Box overflow="auto" overflowY="hidden" py={5}>
                    <Container maxW="container.xl" >
                        <Box mt={5} p={6}>
                            <Flex align="center" justify="space-between">
                                <MotionHeading
                                    size="xl"
                                    mb={7}
                                    align="center"
                                    variants={slideUpVariant}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.4 }}
                                    color="blue.500"
                                >
                                    Khóa học nổi bật
                                </MotionHeading>
                                <NavLink to="/course">
                                    <Button variant="link">
                                        Xem tất cả
                                    </Button>
                                </NavLink>
                            </Flex>
                            <MotionBox
                                variants={zoomInVariant}
                                whileInView="visible"
                                initial="hidden"
                                viewport={{ once: true, amount: 0.5 }}
                            >
                                {isLoading ? (
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
                        </Box>
                    </Container>
                    <Box
                        bgGradient="linear(to-br, blue.900,blue.700, blue.400)"
                        mt={6}
                        h="max-content"
                        py={20}
                        px={6}
                        boxShadow="lg"
                        clipPath="polygon(0 0, 100% 0, 100% 90%, 0 100%)"
                        textColor="white"
                    >
                        <Container maxW="container.xl">
                            <MotionBox
                                variants={slideUpVariant}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.3 }}
                            >
                                <Heading fontSize={{ base: "2xl", md: "4xl" }} maxW="85vh">
                                    "Lập trình không chỉ là ngôn ngữ của máy tính, mà còn là
                                    <AnimateText text="chìa khóa" />
                                    mở ra tương lai của bạn!"
                                </Heading>
                            </MotionBox>

                            <Flex alignItems="center" flexDirection={{ base: "column", md: "row" }} gap={5}>
                                <Flex flexDirection="column">
                                    <MotionText
                                        fontSize={{ base: "xl", md: "1xl" }}
                                        mb={4}
                                        align="start"
                                        variants={zoomInVariant}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, amount: 0.3 }}
                                        flex="1"
                                    >
                                        Hệ thống bài giảng bám sát chương trình lập trình quốc tế
                                        Đa dạng các khóa học lập trình: Python, Java Script, C++,...
                                        Học viên được lập trình và chấm điểm trực tiếp trên web, đánh giá chính xác khả năng hiện tại của mình.
                                    </MotionText>
                                    <MotionButton
                                        rightIcon={<FaArrowRight />}
                                        bg="blue.300"
                                        size="lg"
                                        w="50%"
                                        mt={4}
                                        ml={4}
                                        onClick={() => handleNavigate("/")}
                                        variants={zoomInVariant}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, amount: 0.6 }}
                                        _hover={{ transform: "translateY(-5px)" }}
                                    >
                                        Bắt đầu học
                                    </MotionButton>
                                </Flex>

                                <Box flex="1">
                                    <Image src={CodingPng} alt="Lập trình viên đang code" borderRadius="xl" maxW={{ base: "100%", sm: "500px" }} />
                                </Box>
                            </Flex>
                        </Container>
                    </Box>
                    <SimpleGrid
                        columns={{ base: 2, md: 4 }}
                        spacing={2}
                        mt={10}
                        py={10}
                        mb={10}
                        mx="auto"
                        maxW={"container.xl"}
                        alignItems="center"
                        align="center"
                        justifyContent="center"
                    >
                        <Box textAlign="center">
                            <Heading fontSize="3rem" color="blue.500"><Counter to={10000} />+</Heading>
                            <Text fontSize="xl">Học viên</Text>
                        </Box>
                        <Box textAlign="center">
                            <Heading fontSize="3rem" color="blue.500"><Counter to={300} />+</Heading>
                            <Text fontSize="xl">Khóa học</Text>
                        </Box>
                        <Box textAlign="center">
                            <Heading fontSize="3rem" color="blue.500"><Counter to={95} />%</Heading>
                            <Text fontSize="xl">Hài lòng</Text>
                        </Box>
                        <Box textAlign="center">
                            <Heading fontSize="3rem" color="blue.500"><Counter to={50} />+</Heading>
                            <Text fontSize="xl">Giảng viên</Text>
                        </Box>
                    </SimpleGrid>
                    <Container maxW="container.xl" mt={10} px={5} >
                        <Grid
                            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                            gap="10"
                            alignItems="stretch"   // <- quan trọng để 2 cột cùng cao
                            h="600px" >
                            {/* Blog Section */}
                            <GridItem colSpan={1} h="100%" maxW="600px" colStart={1} rowStart={1} w="100%">
                                <Flex alignItems="center" justifyContent="space-between">
                                    <MotionHeading
                                        size="xl"
                                        mb={7}
                                        align="start"
                                        variants={slideUpVariant}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, amount: 0.4 }}
                                        color="blue.500"
                                    >
                                        Bài viết
                                    </MotionHeading>
                                    <NavLink to="/blogs">
                                        <Button variant="link">Xem tất cả</Button>
                                    </NavLink>
                                </Flex>
                                <MotionBox
                                    variants={zoomInVariant}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.3 }}
                                    bg="white"
                                    py={5}
                                    px={4}
                                    borderRadius="md"
                                    shadow="md"
                                    w="100%"      // Thay maxWidth thành width 100%
                                    position="relative"
                                    overflow="hidden"
                                >
                                    <BlogCaurosel blogs={topPinnedBlogs} />
                                </MotionBox>
                            </GridItem>

                            {/* Time action Section */}
                            <GridItem colSpan={1} w="100%" h="100%" colStart={2} rowStart={1}>
                                <MotionHeading
                                    size="xl"
                                    align="start"
                                    mb={7}
                                    variants={slideUpVariant}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.4 }}
                                    color="blue.500"
                                >
                                    Hoạt động
                                </MotionHeading>
                                <MotionBox
                                    mt={5}
                                    variants={zoomInVariant}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.3 }}
                                >

                                    <MiniCalendar borderRadius="md" maxW="100%" minH="466px" textAlign="center" boxShadow="md" />
                                </MotionBox>
                            </GridItem>
                        </Grid>

                    </Container>
                </Box>
            </Box >
        </ScrollToTop>
    );
};

/**
 * ==============   Styles   ================
 */

const image = {
    maxWidth: "50vw",
    zIndex: 0,
    right: "100px",
    position: 'absolute',
    opacity: 0.9
};

const shape = {
    strokeWidth: 10,
    strokeLinecap: "round",
    fill: "transparent",
};

export default HomeNoLogin;
