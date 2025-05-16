import React, { useEffect, useRef, useState } from 'react';
import { Box, Divider, Flex } from '@chakra-ui/react';

const ToolDetail = ({ children, offsetTop = 64, ...props }) => {
    const containerRef = useRef(null);
    const [isSticky, setIsSticky] = useState(false);
    const [placeholderHeight, setPlaceholderHeight] = useState(0);

    useEffect(() => {
        const node = containerRef.current;
        if (!node) return;

        const updateHeight = () => setPlaceholderHeight(node.offsetHeight);
        updateHeight();

        let resizeObserver;

        if (typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver(() => updateHeight());
            resizeObserver.observe(node);
        }

        const offsetY = node.getBoundingClientRect().top + window.scrollY;

        const handleScroll = () => {
            const scrollY = window.scrollY;
            setIsSticky(scrollY + offsetTop >= offsetY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            if (resizeObserver) resizeObserver.disconnect();
            window.removeEventListener('scroll', handleScroll);
        };
    }, [offsetTop]);

    return (
        <Box w="100%">
            {isSticky && <Box height={`${placeholderHeight}px`} />}
            <Box
                ref={containerRef}
                position={isSticky ? 'fixed' : 'static'}
                top={isSticky ? `${offsetTop}px` : 'auto'}
                left={0}
                right={0}
                zIndex={999}
                bg={isSticky ? "navy.800" : "transparent"}
                p={5}
                {...props}
            >
                <Flex
                    justifyContent={isSticky ? "center" : "space-between"}
                    alignItems="center"
                    maxW="1200px"
                    mx="auto"
                    px={4}
                    gap={10}
                >
                    {children}
                </Flex>
            </Box>
        </Box>
    );
};

export default ToolDetail;
