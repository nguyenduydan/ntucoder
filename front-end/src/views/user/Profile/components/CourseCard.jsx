import React, { useEffect } from "react";
import { Box, Text, Image, Flex, Progress, useColorModeValue, HStack, Tooltip } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { toSlug, formatNumber } from "@/utils/utils";
import { FaUsers } from "react-icons/fa";
import api from "@/config/apiConfig";

const CourseCard = ({ course, isPlaceholder = false }) => {
    const bgCard = useColorModeValue("white", "navy.900");
    const navigate = useNavigate();


    // Nếu là placeholder thì trả về thẻ Skeleton
    if (isPlaceholder) {
        return (
            <Box
                minW={{ md: "20vh", base: "100%" }}
                borderWidth="1px"
                bg={bgCard}
                borderRadius="lg"
                overflow="hidden"
                boxShadow="md"
                transition="all .2s ease-in-out"
            >
                <Image src={"/avatarSimmmple.png"} alt={"no image"} objectFit="cover" h="160px" w="full" />
                <Box p="4">
                    <Box bg="gray.300" h="20px" w="100px" mb="3" borderRadius="md" />
                    <Box bg="gray.300" h="24px" w="80%" mb="2" borderRadius="md" />
                    <Box bg="gray.200" h="16px" w="50%" mb="2" borderRadius="md" />
                    <Flex align="center" mt="2">
                        <Box bg="gray.200" h="16px" w="40px" borderRadius="md" />
                    </Flex>
                    <Flex mt="3" align="center" justify="space-between">
                        <Box h="20px" w="60px" bg="gray.300" borderRadius="md" />
                        <Flex alignItems="center">
                            <Box h="16px" w="50px" bg="gray.300" borderRadius="md" mr="2" />
                            <Box h="20px" w="30px" bg="gray.200" borderRadius="md" />
                        </Flex>
                    </Flex>
                </Box>
            </Box>
        );
    }


    const handleNagvigate = () => {
        setTimeout(() => {
            navigate(`/course/${toSlug(course.courseName)}-${course.courseID}`);
        }, 100);
    };

    return (
        <Box
            minW={{ md: "20vh", base: "100%" }}
            borderWidth="1px"
            bg={bgCard}
            _hover={{
                transform: "translateY(-5px)",
                boxShadow: "md",
                cursor: "pointer",
            }}
            transition="all .2s ease-in"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            onClick={handleNagvigate}
        >
            <Image
                src={course.imageUrl || "/avatarSimmmple.png"}
                alt={course.title}
                name={course.title}
                objectFit="cover"
                h="160px"
                w="full"
                loading="lazy"
            />

            <Box px={4} py={2}>
                <Tooltip label={course.courseName} placement="top" hasArrow>
                    <Text fontSize="lg" fontWeight="bold" color="blue" noOfLines={1}>
                        {course.courseName}
                    </Text>
                </Tooltip>
                <Flex align="center" mt="2" >
                    <Flex flex={1}>
                        <HStack spacing={0.5}>
                            {[...Array(5)].map((_, i) => (
                                <StarIcon boxSize={3} key={i} color={i < Math.round(course.rating) ? 'yellow.400' : 'gray.300'} />
                            ))}
                        </HStack>
                        <Text ml="1" mt="2px" fontSize="sm" fontWeight="medium">  {course.rating ? course.rating.toFixed(1) : "0"}</Text>
                    </Flex>

                    <Flex flex={1}>
                        <FaUsers color="gray" />
                        <Text ml="1" fontSize="sm" fontWeight="medium">
                            {formatNumber(course.totalReviews)}
                        </Text>
                    </Flex>
                    <Text ml="1" fontSize="sm" fontWeight="medium">
                        {(course.progress?.toFixed(0)) || "0"}%
                    </Text>
                </Flex>
            </Box>
            {/* Tiến độ hoàn thành */}
            <Progress
                value={course.progress}
                size="sm"
                colorScheme="green"
                bg="blue.100"
                hasStripe
                w="full"
                borderRadius="md"
            />
        </Box>

    );
};

export default CourseCard;
