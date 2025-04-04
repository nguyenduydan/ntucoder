import React from "react";
import { Box, Text, Image, Badge, Flex, useColorModeValue } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { darken, lighten } from "@chakra-ui/theme-tools";
import { useNavigate } from "react-router-dom";
import { toSlug, getLuminance, formatCurrency } from "utils/utils";

const getTextColor = (bgColor) => getLuminance(bgColor) > 0.5 ? darken(bgColor, 30) : lighten(bgColor, 50);

const CourseCard = ({ course }) => {
    const textColor = getTextColor(course.badgeColor);
    const bgCard = useColorModeValue("white", "navy.900");
    const navigate = useNavigate();

    const handleNagvigate = () => {
        setTimeout(() => {
            navigate(`/course/${toSlug(course.courseName)}-${course.courseID}`);
        }, 100);
    };

    return (
        <Box minW={{ md: "20vh", base: "100%" }} borderWidth="1px" bg={bgCard}
            _hover={{ transform: "scale(1.02)", cursor: "pointer" }} transition="all .2s ease-in-out"
            borderRadius="lg" overflow="hidden" boxShadow="md"
            onClick={handleNagvigate}
        >
            <Image src={course.imageUrl || "/avatarSimmmple.png"} alt={course.title} objectFit="cover" h="160px" w="full" />
            <Box p="4">
                <Badge bg={course.badgeColor} textTransform="capitalize" fontWeight="normal" textColor={textColor} px="2" borderRadius="md">
                    {course.badgeName}
                </Badge>
                <Text fontSize="lg" fontWeight="bold" mt="2">{course.courseName}</Text>
                <Flex align="center" mt="2">
                    <Text ml="1" fontSize="sm" color="gray.400">{course.creatorName}</Text>
                </Flex>
                <Flex align="center" mt="2">
                    <StarIcon color="yellow.400" />
                    <Text ml="1" fontSize="sm" fontWeight="medium">{course.rating}</Text>
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
                            <Badge colorScheme="red" ml="2" px="1" color="red.500" boxShadow="sm" borderRadius="5px">{course.discountPercent}%</Badge>
                        </Flex>
                    )}
                </Flex>
            </Box>
        </Box>
    );
};

export default CourseCard;
