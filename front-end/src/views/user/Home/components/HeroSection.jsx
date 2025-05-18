import { useState, useEffect } from "react";
import {
    Box,
    Heading,
    Text,
    Button,
    Stack,
    Image,
    Container,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import HeroImg from "@/assets/img/codingImg.png";
import { useAuth } from "@/contexts/AuthContext";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import { useNavigate } from "react-router-dom";
import NeonButton from "@/components/animate/ButtonNeon";
import ButtonDraw from "@/components/animate/ButtonDraw";

const MotionBox = motion(Box);

const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

export default function HeroSection() {
    const { coder } = useAuth();
    const [text] = useTypewriter({
        words: [coder.coderName],
        loop: true,
        delaySpeed: 2000, // Thời gian dừng sau khi gõ xong mỗi câu
    });
    const navigate = useNavigate();

    return (
        <Box
            bgGradient="linear(to-tr,rgb(8, 23, 156),rgb(10, 14, 75),rgb(1, 2, 40))"
            py={[10, 20]}
            color="white"
            mb={5}
            h={{ base: "auto", md: "100vh" }}
            display="flex"
            justifyContent="center"
            alignItems="center">
            <Container maxW="8xl" centerContent >
                <Stack
                    direction={["column", "row"]}
                    spacing={10}
                    align="center"
                    justify="space-between"
                >
                    {/* Left content */}
                    <MotionBox
                        flex="1"
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <Heading as="h1" size="2xl" mb={4} letterSpacing="2px" lineHeight="1.4">
                            Chào mừng <Text color="blue.300" textDecoration="underline">{text}<Cursor cursorStyle="|" /></Text>
                            đến với{" "}
                            <Box as="span" color="teal.300" display="inline-block" textShadow="0 0 10px rgba(0, 255, 255, 0.7)">
                                NTU-LMS
                            </Box>
                        </Heading>
                        <Text fontSize="xl" color="gray.300" mb={6}>
                            Nền tảng học tập trực tuyến dành riêng cho sinh viên
                            NTU. Khám phá hàng trăm khóa học từ cơ bản đến nâng
                            cao.
                        </Text>
                        <Stack direction="row" spacing={10}>
                            <NeonButton onClick={() => navigate("/")}>Bắt đầu học</NeonButton>
                            <ButtonDraw onClick={() => navigate("/course")} >Xem khóa học</ButtonDraw>
                        </Stack>
                    </MotionBox>

                    {/* Right image */}
                    <MotionBox
                        flex="1"
                        initial={{ opacity: 0, scale: 0.4 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <Image
                            src={HeroImg}
                            alt="Online learning"
                            width="100%"
                            height="100vh"
                            objectFit="contain"
                        />
                    </MotionBox>
                </Stack>
            </Container>
        </Box>
    );
}
