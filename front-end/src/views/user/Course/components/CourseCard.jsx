import React from "react";
import { Box, Text, Image, Badge, Flex, HStack, useColorModeValue } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { darken, lighten } from "@chakra-ui/theme-tools";
import { useNavigate } from "react-router-dom";
import { toSlug, getLuminance, formatCurrency, formatNumber } from "@/utils/utils";
import { FaUsers } from "react-icons/fa";

const getTextColor = (bgColor) => getLuminance(bgColor) > 0.5 ? darken(bgColor, 30) : lighten(bgColor, 50);

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


    // Nếu không phải placeholder, thì course chắc chắn phải có
    const textColor = getTextColor(course.badgeColor);


    const handleNagvigate = () => {
        setTimeout(() => {
            navigate(`/course/${toSlug(course.courseName)}-${course.courseID}`);
        }, 100);
    };

    return (
        <Box minW={{ md: "20vh", base: "100%" }} bg={bgCard}
            _hover={{ transform: "translateY(-10px)", boxShadow: "xl", cursor: "pointer" }} transition="all .2s ease-in"
            borderRadius="lg" overflow="hidden" boxShadow="md"
            onClick={handleNagvigate}
        >
            <Image src={course.imageUrl || "/avatarSimmmple.png"} alt={course.title} objectFit="cover" h="160px" w="full" loading="lazy" />
            <Box p="4">
                <Badge bg={course.badgeColor} textTransform="capitalize" fontWeight="normal" textColor={textColor} px="2" borderRadius="md">
                    {course.badgeName}
                </Badge>
                <Text fontSize="lg" fontWeight="bold" mt="2" noOfLines={1}>{course.courseName}</Text>
                <Flex align="center" mt="2">
                    <Text ml="1" fontSize="sm" color="gray.400">{course.creatorName}</Text>
                </Flex>
                <Flex align="center" alignItems="center" mt="2">
                    <Flex flex={1}>
                        <HStack spacing={0.5}>
                            {[...Array(5)].map((_, i) => (
                                <StarIcon boxSize={3} key={i} color={i < Math.round(course.rating) ? 'yellow.400' : 'gray.300'} />
                            ))}
                        </HStack>
                        <Text ml="1" mt="2px" fontSize="sm" fontWeight="medium">  {course.rating ? course.rating.toFixed(1) : "0"}</Text>
                    </Flex>
                    <Flex>
                        <FaUsers color="gray.400" />
                        <Text ml="1" fontSize="sm" fontWeight="medium">
                            {formatNumber(course.enrollCount)}
                        </Text>
                    </Flex>
                </Flex>
                <Flex mt="3" align="center" justify="space-between">
                    {course.fee === 0 ? (
                        <Text fontSize="lg" fontWeight="bold" color="green.500">Miễn phí</Text>
                    ) : (
                        <Text fontSize="lg" fontWeight="bold" color="red.500">{formatCurrency(course.fee)}</Text>
                    )}
                    {course.originalFee > 0 && (
                        <Flex alignItems="center">
                            <Text ml="2" fontSize="sm" textDecoration="line-through" color="gray.400">
                                {formatCurrency(course.originalFee)}
                            </Text>
                            <Badge colorScheme="red" ml="2" px="1" color="red.500" boxShadow="sm" borderRadius="5px">
                                {course.discountPercent}%
                            </Badge>
                        </Flex>
                    )}
                </Flex>
            </Box>
        </Box>
    );
};

export default CourseCard;
