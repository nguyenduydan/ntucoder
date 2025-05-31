import React from "react";
import { motion } from "framer-motion";
import {
    Box,
    Container,
    Heading,
    Text,
    Flex,
    Button,
    Image
} from "@chakra-ui/react";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CodingPng from "@/assets/img/codingImg.png";
import AnimateText from "components/animate/AnimateText";

const MotionBox = motion(Box);
const MotionText = motion(Text);
const MotionButton = motion(Button);

const MotivationSection = React.memo(() => {
    const navigate = useNavigate();

    return (
        <Box
            bgGradient="linear(to-br, blue.900,blue.700, blue.400)"
            mt={6}
            h="800px"
            py={20}
            px={6}
            boxShadow="lg"
            clipPath="polygon(0 0, 100% 0, 100% 90%, 0 100%)"
            textColor="white"
        >
            <Container maxW="container.xl">
                <MotionBox
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
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
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
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
                            onClick={() => navigate("/")}
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, amount: 0.6 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            _hover={{ transform: "translateY(-5px)" }}
                        >
                            Bắt đầu học
                        </MotionButton>
                    </Flex>

                    <Box flex="1">
                        <Image
                            src={CodingPng}
                            alt="Lập trình viên đang code"
                            borderRadius="xl"
                            maxW={{ base: "100%", sm: "600px" }}
                            loading="lazy"
                        />
                    </Box>
                </Flex>
            </Container>
        </Box>
    );
});

MotivationSection.displayName = 'MotivationSection';
export default MotivationSection;
