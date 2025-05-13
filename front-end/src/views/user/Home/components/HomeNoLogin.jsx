import React, { useCallback, useEffect, useState } from "react";
import {
    Box,
    Heading,
    Text,
    Button,
    VStack,
    HStack,
    useColorModeValue,
    Image,
    SimpleGrid,
    Container
} from "@chakra-ui/react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import CodingPng from "assets/img/profile/gummy-coding.png";
import { getList } from "config/apiService";
import CourseGrid from "views/user/Course/components/CourseGrid";
import SkeletonList from "views/user/Course/components/SkeletonList";

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);

const fadeInVariant = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.3, ease: "easeInOut" },
    },
};

const slideUpVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: "easeInOut" },
    },
};

const zoomInVariant = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.3, ease: "easeInOut" },
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
    const bg = useColorModeValue("gray.50", "gray.900");
    const cardBg = useColorModeValue("white", "gray.800");
    const [isLoading, setIsLoading] = useState(false);

    const [courses, setCourses] = useState([]);

    const [rotate, setRotate] = useState({ x: 0, y: 0 });

    const { ref: sectionRef, inView } = useInView({
        triggerOnce: true,
        threshold: 0.5, // Tùy chỉnh tỉ lệ phần tử xuất hiện
    });

    const controls = useAnimation();

    // Khi phần tử xuất hiện trong viewport, animation sẽ bắt đầu
    useEffect(() => {
        if (inView) {
            controls.start("visible");
        } else {
            controls.start("hidden");
        }
    }, [inView, controls]);

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

    const fetchCourses = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await getList({ controller: "Course", page: 1, pageSize: 10 });
            setCourses(res.data);
        } catch (error) {
            console.log("Không có dữ liệu bài học");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    return (
        <Box bg={bg} minH="100%">
            {/* Hero Section */}
            <Box
                bgGradient="linear(to-r, rgb(14, 35, 192), rgb(120, 230, 255))"
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
                                        >
                                            {text}
                                        </MotionText>
                                    ))}
                                </MotionVStack>
                            </VStack>
                        </VStack>

                        {/* Cột phải: Nội dung tương ứng */}
                        <VStack align="start" spacing={6} flex="1">
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
                            >
                                <motion.div variants={zoomInVariant}>
                                    <Image
                                        mt={20}
                                        src={CodingPng}
                                        alt="Lập trình viên đang code"
                                        borderRadius="xl"
                                        maxW={{ base: "100%", sm: "500px" }}  // Điều chỉnh chiều rộng ảnh theo màn hình
                                    />
                                </motion.div>
                            </MotionBox>
                        </VStack>
                    </HStack>

                </MotionVStack>
            </Box>
            {/* About Section */}
            <Container maxW="container.xl" overflow="auto" overflowY="hidden">
                <Box mt={10} p={6}>
                    <MotionHeading
                        ref={sectionRef}
                        size="xl"
                        mb={4}
                        align="center"
                        variants={slideUpVariant}
                        initial="hidden"
                        animate={controls}
                    >
                        Khóa học nổi bật
                    </MotionHeading>

                    <MotionBox
                        ref={sectionRef}
                        bg={cardBg}
                        borderRadius="xl"
                        variants={slideUpVariant}
                        initial="hidden"
                        animate={controls}
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

                {/* Skills Section */}
                <MotionBox
                    mt={16}
                    p={6}
                    bg={cardBg}
                    borderRadius="xl"
                    shadow="md"
                    variants={zoomInVariant}
                    initial="hidden"
                    animate={controls}
                >
                    <Heading size="md" mb={4}>
                        Kỹ năng
                    </Heading>
                    <HStack spacing={8} wrap="wrap" justify="center">
                        {["React", "Chakra UI", "TypeScript", "Node.js", "CSS"].map((skill) => (
                            <Box key={skill} p={4} bg="teal.500" color="white" borderRadius="md">
                                {skill}
                            </Box>
                        ))}
                    </HStack>
                </MotionBox>

                {/* Projects Section */}
                <MotionBox
                    mt={16}
                    p={6}
                    bg={cardBg}
                    borderRadius="xl"
                    shadow="md"
                    variants={slideUpVariant}
                    initial="hidden"
                    animate={controls}
                >
                    <Heading size="md" mb={4}>
                        Dự án
                    </Heading>
                    <Text fontSize="lg">
                        Tôi đã tham gia phát triển các ứng dụng web và mobile. Dưới đây là một số dự án tiêu biểu:
                    </Text>
                    <HStack spacing={4} wrap="wrap" justify="center" mt={4}>
                        {["E-commerce", "Blog platform", "Task Manager"].map((project) => (
                            <Box key={project} p={4} bg="blue.500" color="white" borderRadius="md">
                                {project}
                            </Box>
                        ))}
                    </HStack>
                </MotionBox>

                {/* Contact Section */}
                <MotionBox
                    mt={16}
                    p={6}
                    bg={cardBg}
                    borderRadius="xl"
                    shadow="md"
                    variants={slideUpVariant}
                    initial="hidden"
                    animate={controls}
                >
                    <Heading size="md" mb={4}>
                        Liên hệ
                    </Heading>
                    <Text fontSize="lg">
                        Bạn có thể liên hệ với tôi qua các kênh sau:
                    </Text>
                    <HStack spacing={4} mt={4}>
                        <Button colorScheme="teal" variant="outline">
                            Gửi email
                        </Button>
                        <Button colorScheme="blue" variant="outline">
                            LinkedIn
                        </Button>
                    </HStack>
                </MotionBox>
            </Container>
        </Box >
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
