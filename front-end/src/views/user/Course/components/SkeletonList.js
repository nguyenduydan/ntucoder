import React from "react";
import { Box, Skeleton, SkeletonText, Flex, useColorModeValue } from "@chakra-ui/react";

const SkeletonList = () => {
    const bgCard = useColorModeValue("white", "navy.900");

    return (
        <Box minW={{ md: "20vh", base: "100%" }} borderWidth="1px" bg={bgCard}
            borderRadius="lg" overflow="hidden" boxShadow="md">
            <Skeleton height="160px" width="full" />
            <Box p="4">
                <Skeleton height="20px" width="100px" borderRadius="md" />
                <SkeletonText mt="2" noOfLines={2} spacing="2" skeletonHeight="4" />
                <Flex align="center" mt="2">
                    <Skeleton height="16px" width="40px" borderRadius="md" />
                </Flex>
                <Flex align="center" mt="2">
                    <Skeleton height="16px" width="20px" />
                    <Skeleton height="16px" width="40px" ml="2" />
                </Flex>
                <Flex mt="3" align="center" justify="space-between">
                    <Skeleton height="24px" width="80px" borderRadius="md" />
                    <Skeleton height="20px" width="50px" borderRadius="md" />
                </Flex>
            </Box>
        </Box>
    );
};

export default SkeletonList;
