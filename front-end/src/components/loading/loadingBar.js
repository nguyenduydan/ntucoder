import React from "react";
import { Box, Progress, VStack } from "@chakra-ui/react";

const ProgressBar = ({ progress }) => {
    return (
        <VStack>
            <Box position="fixed" top={0} left={0} width="100%" zIndex="9999">
                <Progress
                    value={progress}
                    size="sm"
                    colorScheme="blue"
                    width="100%"
                    height="4px"
                />
            </Box>
        </VStack>
    );
};

export default ProgressBar;
