import {
    Box,
    Heading,
    Text,
} from "@chakra-ui/react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";

const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const MotionBox = motion(Box);

export default function HeroSection() {
    const ref = useRef(null);
    const [dimensions, measure] = useElementDimensions(ref);
    const { width, height, top, left } = dimensions;

    const gradientX = useMotionValue(0.5);
    const gradientY = useMotionValue(0.5);

    const background = useTransform(() =>
        `conic-gradient(from 0deg at calc(${gradientX.get() * 100}% - ${left}px) calc(${gradientY.get() * 100}% - ${top}px),
         #0cdcf7, #ff0088,rgb(137, 18, 255),rgb(24, 221, 247))`
    );

    return (
        <MotionBox
            ref={ref}
            textAlign="center"
            mb={10}
            p={8}
            borderRadius="lg"
            boxShadow="lg"
            color="white"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeInUp}
            style={{ background }}
            onPointerMove={(e) => {
                gradientX.set(e.clientX / width);
                gradientY.set(e.clientY / height);
            }}
            onPointerEnter={measure}
        >
            <Heading size="xl">Chào mừng bạn đến với Website NTU-LMS</Heading>
            <Text fontSize="lg" color="gray.300" mt={4}>
                Khám phá hàng trăm khóa học chất lượng từ cơ bản đến nâng cao.
            </Text>
        </MotionBox>
    );
}

// ================= Utils =================
function useElementDimensions(ref) {
    const [size, setSize] = useState({ width: 0, height: 0, top: 0, left: 0 });

    const measure = useCallback(() => {
        if (!ref.current) return;
        setSize(ref.current.getBoundingClientRect());
    }, [ref]);

    useEffect(() => {
        measure();
    }, [measure]);

    return [size, measure];
}
