import React, { useState, useEffect } from 'react';
import { Box, Progress, VStack } from '@chakra-ui/react';

const ProgressBar = () => {
    const [progress, setProgress] = useState(0);

    // Hàm giả lập tiến trình tải
    useEffect(() => {
        if (progress === 100) return;

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev < 100) {
                    return Math.min(prev + 1, 100);
                }
                clearInterval(interval);
                return prev;
            });
        }, 5); // Tốc độ tăng tiến trình

        return () => clearInterval(interval);
    }, [progress]);

    return (
        <VStack>
            <Box position="fixed" top={0} left={0} width="100%" zIndex="9999">
                <Progress
                    value={progress}
                    size="sm"
                    colorScheme="blue"  // Màu của indicator
                    width="100%"
                    borderRadius="0"
                    height="4px"
                />
            </Box>
        </VStack>
    );
};

export default ProgressBar;
