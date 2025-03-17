import React, { useState, useEffect } from "react";
import { Box, Progress } from "@chakra-ui/react";

const ProgressBar = ({ isLoading, minLoadingTime = 1000, onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [startTime, setStartTime] = useState(null);

    useEffect(() => {
        if (isLoading) {
            setProgress(0);
            setStartTime(performance.now());

            const interval = setInterval(() => {
                setProgress((prev) => (prev < 90 ? prev + 5 : prev)); // Tăng dần đến 90%
            }, 100);

            return () => clearInterval(interval);
        }
    }, [isLoading]);

    useEffect(() => {
        if (!isLoading && startTime) {
            const elapsedTime = performance.now() - startTime;
            const remainingTime = Math.max(minLoadingTime - elapsedTime, 0);

            setTimeout(() => {
                setProgress(100);
                setTimeout(() => {
                    setProgress(0);
                    if (onComplete) onComplete(); // Gọi callback khi hoàn thành
                }, 300);
            }, remainingTime);
        }
    }, [isLoading, startTime, minLoadingTime, onComplete]);

    return isLoading || progress > 0 ? (
        <Box position="fixed" top={0} left={0} width="100%" zIndex="9999">
            <Progress value={progress} size="sm" colorScheme="blue" width="100%" height="4px" />
        </Box>
    ) : null;
};

export default ProgressBar;
