import React from "react";
import { motion } from "framer-motion";
import {
    VStack,
    HStack,
    Heading,
    Text,
    Image
} from "@chakra-ui/react";
import Programing from "@/assets/img/avatars/programing.png";

const MotionHeading = motion(Heading);
const MotionText = motion(Text);
const MotionVStack = motion(VStack);

const heroFeatures = [
    "+ Học lập trình từ 0",
    "+ Khơi dậy đam mê công nghệ",
    "+ Chinh phục thế giới số, khẳng định bản thân",
    "+ Mở ra cơ hội việc làm hấp dẫn trong tương lai"
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
};

const HeroContent = React.memo(() => (
    <HStack
        spacing={{ base: 4, md: 12 }}
        align="center"
        justifyContent="space-between"
        flexWrap="wrap"
        w="100%"
        zIndex={1}
        flexDirection={{ base: "column", md: "row" }}
    >
        <VStack align="start" spacing={6} flex="1" px={{ base: "40px", md: "100px" }}>
            <MotionHeading
                size={{ base: "xl", md: "2xl" }}
                lineHeight={{ base: "1.2", md: "1.2" }}
                color="#fff"
                mb="10px"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                textShadow="0 0 2px #fff, 0 0 2px #00aaff, 0 0 6px #00aaff, 0 0 10px #00aaff"
            >
                Website học lập trình trực tuyến dành cho sinh viên
            </MotionHeading>

            <MotionVStack
                spacing={4}
                align="start"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {heroFeatures.map((text, index) => (
                    <MotionText
                        key={index}
                        color="white"
                        variants={itemVariants}
                        bg="blue.900"
                        opacity={0.8}
                        px={4}
                        py={2}
                        whileHover={{ scale: 1.05, x: 10 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        cursor="default"
                    >
                        {text}
                    </MotionText>
                ))}
            </MotionVStack>
        </VStack>

        <VStack align="start" spacing={0} flex="1">
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            >
                <Image
                    mt={20}
                    src={Programing}
                    alt="Lập trình viên đang code"
                    borderRadius="xl"
                    loading="lazy"
                    maxW={{ base: "100%", sm: "100%" }}
                />
            </motion.div>
        </VStack>
    </HStack>
));

HeroContent.displayName = 'HeroContent';
export default HeroContent;
