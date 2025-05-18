// components/TopCoderCard.jsx
import { VStack, Flex, Badge, Text, Box, Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { FaCrown } from "react-icons/fa";
import CoderAvatar from "@/views/user/Course/components/CoderAvatar";

const TopCoderCard = ({ coder, rank, gradient, crown = false, size = "lg", isLoading = false }) => {
    const hasCoder = !!coder;

    return (
        <VStack
            bgGradient={gradient}
            borderRadius="md"
            p={rank === 1 ? 6 : 4}
            shadow={rank === 1 ? "2xl" : "md"}
            width={rank === 1 ? "400px" : "300px"}
            _hover={{
                shadow: rank === 1 ? "4xl" : "lg",
                transform: rank === 1 ? "scale(1.07)" : "scale(1.05)",
                ...(rank === 1 && {
                    boxShadow: "0 0 20px 4px rgba(255, 223, 71, 0.9)"
                })
            }}
            transition="all 0.3s ease"
            position="relative"
        >
            {crown && !isLoading && (
                <Box position="absolute" top="-32px" color="yellow.400" fontSize="6xl">
                    <FaCrown />
                </Box>
            )}

            <Badge
                colorScheme="yellow"
                position="absolute"
                top={rank === 1 ? 4 : 2}
                right={rank === 1 ? 4 : 2}
                fontSize={rank === 1 ? "lg" : "md"}
                px={rank === 1 ? 3 : 2}
                borderRadius="full"
            >
                #{rank}
            </Badge>

            {isLoading ? (
                <>
                    <SkeletonCircle size={size === "2xl" ? "100px" : "70px"} mb={2} />
                    <SkeletonText noOfLines={1} width="80px" mb={2} />
                </>
            ) : hasCoder ? (
                <NavLink to={`/profile/${coder.coderID}`}>
                    <Flex flexDirection="column" align="center" mb={2}>
                        <CoderAvatar size={size} name={coder.coderName} src={coder.avatar} mb={2} />
                        <Text fontWeight="bold" fontSize={rank === 1 ? "xl" : "md"}>{coder.coderName}</Text>
                    </Flex>
                </NavLink>
            ) : (
                <Flex flexDirection="column" align="center" mb={2}>
                    <CoderAvatar size={size} name="Chưa có người dùng" mb={2} />
                    <Text fontWeight="bold" fontSize={rank === 1 ? "xl" : "md"}>Chưa có người dùng</Text>
                </Flex>
            )}

            {isLoading ? (
                <Skeleton height="30px" width="60px" borderRadius="full" />
            ) : (
                <Badge
                    fontSize={rank === 1 ? "lg" : "sm"}
                    colorScheme="teal"
                    fontWeight="semibold"
                >
                    {hasCoder ? `${coder.totalPoint} điểm` : "0 điểm"}
                </Badge>
            )}
        </VStack>
    );
};

export default TopCoderCard;
