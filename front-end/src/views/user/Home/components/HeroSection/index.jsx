import React, { Suspense } from "react";
import { motion } from "framer-motion";
import { Box, VStack } from "@chakra-ui/react";
import HeroContent from "./HeroContent";

// Lazy load animated background để giảm initial bundle
const AnimatedBackground = React.lazy(() => import("./AnimatedBackground"));

const MotionVStack = motion(VStack);

const HeroSection = React.memo(() => (
    <Box
        bgGradient="linear(to-b, rgb(1, 6, 56),rgb(10, 22, 159), rgb(9, 53, 175),rgb(63, 153, 202),gray.200)"
        minH="95vh"
    >
        <MotionVStack
            align="center"
            justify="center"
            spacing={8}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } }}
            px={8}
            py={12}
        >
            <Suspense fallback={null}>
                <AnimatedBackground />
            </Suspense>
            <HeroContent />
        </MotionVStack>
    </Box>
));

HeroSection.displayName = 'HeroSection';
export default HeroSection;
