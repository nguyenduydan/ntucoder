import React from "react";
import {
    Box,
    Heading,
    Text,
    Button,
    VStack,
    HStack,
    useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);

const fadeInVariant = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.8, ease: "easeInOut" },
    },
};

const slideUpVariant = {
    hidden: { opacity: 0, y: 100 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: "easeInOut" },
    },
};

const zoomInVariant = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, ease: "easeInOut" },
    },
};

const HomeNoLogin = () => {
    const bg = useColorModeValue("gray.50", "gray.900");
    const cardBg = useColorModeValue("white", "gray.800");

    const { ref: sectionRef, inView } = useInView({
        triggerOnce: true, // Trigger only once when the section comes into view
        threshold: 0.5, // Section must be 50% visible before triggering the effect
    });

    return (
        <Box bg={bg} minH="200vh" px={{ base: 4, md: 12 }} py={10}>
            {/* Hero Section */}
            <MotionVStack
                align="center"
                justify="center"
                spacing={8}
                mt="20vh"
                variants={fadeInVariant}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
            >
                <MotionHeading
                    size="2xl"
                    bgGradient="linear(to-r, teal.400, blue.500)"
                    bgClip="text"
                >
                    Chào bạn, tôi là Nguyễn Văn A
                </MotionHeading>
                <MotionText fontSize="lg" maxW="700px" textAlign="center">
                    Lập trình viên Frontend với đam mê phát triển web mượt mà, responsive, và tối ưu. Chuyên sâu về ReactJS, Chakra UI và các công nghệ liên quan.
                </MotionText>
                <Button colorScheme="teal" size="lg" variant="solid">
                    Xem thêm
                </Button>
            </MotionVStack>

            {/* About Section */}
            <MotionBox
                ref={sectionRef}
                mt={16}
                p={6}
                bg={cardBg}
                borderRadius="xl"
                shadow="md"
                variants={slideUpVariant}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
            >
                <Heading size="md" mb={4}>
                    Về tôi
                </Heading>
                <Text fontSize="lg">
                    Tôi là một lập trình viên đam mê công nghệ và thích học hỏi các công cụ mới. Hãy cùng nhau xây dựng những sản phẩm đột phá, cải thiện trải nghiệm người dùng.
                </Text>
            </MotionBox>

            {/* Skills Section */}
            <MotionBox
                mt={16}
                p={6}
                bg={cardBg}
                borderRadius="xl"
                shadow="md"
                variants={zoomInVariant}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
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
                animate={inView ? "visible" : "hidden"}
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
                animate={inView ? "visible" : "hidden"}
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
        </Box>
    );
};

export default HomeNoLogin;
