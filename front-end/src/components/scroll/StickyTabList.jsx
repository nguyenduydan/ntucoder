import { useEffect, useRef, useState } from "react";
import { Box, TabList } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const slideVariant = {
    hidden: { opacity: 0, y: -50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: "easeOut" },
    },
    normal: {
        opacity: 1,
        y: 0,
    },
};

const StickyTabList = ({ children, offsetTop = 64, ...props }) => {
    const containerRef = useRef(null);
    const [isSticky, setIsSticky] = useState(false);
    const [placeholderHeight, setPlaceholderHeight] = useState(0);
    const [animateKey, setAnimateKey] = useState(0); // key để ép framer-motion animate lại

    useEffect(() => {
        const node = containerRef.current;
        if (!node) return;

        const offsetY = node.getBoundingClientRect().top + window.scrollY;
        setPlaceholderHeight(node.offsetHeight);

        const onScroll = () => {
            const scrollY = window.scrollY;
            const shouldBeSticky = scrollY + offsetTop >= offsetY;

            if (shouldBeSticky && !isSticky) {
                setIsSticky(true);
                setAnimateKey(prev => prev + 1); // Tăng key để force remount
            } else if (!shouldBeSticky && isSticky) {
                setIsSticky(false);
            }
        };

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, [isSticky, offsetTop]);

    return (
        <Box>
            {isSticky && <Box height={`${placeholderHeight}px`} />}

            <MotionBox
                key={animateKey} // ép Framer Motion chạy lại
                ref={containerRef}
                position={isSticky ? "fixed" : "static"}
                top={isSticky ? `${offsetTop}px` : "auto"}
                left={0}
                zIndex="100"
                width="100%"
                bg="white"
                boxShadow={isSticky ? "md" : "none"}
                borderBottom="1px solid"
                borderColor="gray.200"
                variants={slideVariant}
                initial={isSticky ? "hidden" : "normal"}
                animate={isSticky ? "visible" : "normal"}
                {...props}
            >
                <TabList
                    height={isSticky ? "75px" : "auto"}
                    justifyContent={isSticky ? "center" : "flex-start"}
                >
                    {children}
                </TabList>
            </MotionBox>
        </Box>
    );
};

export default StickyTabList;
