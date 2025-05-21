import { VStack, Flex, Badge, Text, Box, Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { FaCrown } from "react-icons/fa";
import CoderAvatar from "@/views/user/Course/components/CoderAvatar";

const TopCoderCard = ({ coder, rank, gradient, crown = false, size = "lg", isLoading = false }) => {
    const hasCoder = !!coder;

    // Width và padding
    const width = rank === 1
        ? { base: "90vw", sm: "350px", md: "400px" }
        : { base: "70vw", sm: "300px", md: "300px" }; // top2 và top3 cùng kích thước width

    // Padding top và bottom cố định cho top 2 & 3 giống nhau
    const padding = rank === 1
        ? { base: 4, sm: 5, md: 6 }
        : { base: 4, sm: 4, md: 4 }; // padding top-bottom = 4 (đều)

    // Avatar size
    const avatarSize = rank === 1
        ? { base: "lg", sm: "lg", md: "2xl" }
        : { base: "lg", sm: "lg", md: "xl" };

    // Badge và Crown vị trí đồng bộ top 2 & 3
    const badgeTop = rank === 1 ? { base: 3, sm: 4 } : { base: 3, sm: 4 };
    const badgeRight = rank === 1 ? { base: 3, sm: 4 } : { base: 3, sm: 4 };
    const crownTop = rank === 1 ? { base: "-24px", sm: "-28px", md: "-32px" } : { base: "-24px", sm: "-28px", md: "-32px" };

    // Font sizes đồng bộ top 2 & 3
    const nameFontSize = rank === 1 ? { base: "lg", sm: "md" } : { base: "md", sm: "sm" };
    const badgeFontSize = rank === 1 ? { base: "md", sm: "lg" } : { base: "sm", sm: "sm" };

    return (
        <VStack
            bgGradient={gradient}
            borderRadius="md"
            p={padding}
            shadow={rank === 1 ? "2xl" : "md"}
            width={width}
            minH={rank === 1 ? "auto" : "100px"}  // Tạo minHeight cố định cho top 2 và 3
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
                <Box
                    position="absolute"
                    top={crownTop}
                    color="yellow.400"
                    fontSize={{ base: "4xl", sm: "5xl", md: "6xl" }}
                >
                    <FaCrown />
                </Box>
            )}

            <Badge
                colorScheme="yellow"
                position="absolute"
                top={badgeTop}
                right={badgeRight}
                fontSize={badgeFontSize}
                px={rank === 1 ? { base: 2, sm: 3 } : { base: 2, sm: 3 }}
                borderRadius="full"
            >
                #{rank}
            </Badge>

            {isLoading ? (
                <>
                    <SkeletonCircle size={avatarSize} mb={2} />
                    <SkeletonText noOfLines={1} width="80px" mb={2} />
                </>
            ) : hasCoder ? (
                <NavLink to={`/profile/${coder.coderID}`}>
                    <Flex flexDirection="column" align="center" mb={2}>
                        <CoderAvatar size={avatarSize} name={coder.coderName} src={coder.avatar} mb={2} />
                        <Text fontWeight="bold" fontSize={nameFontSize} textAlign="center">
                            {coder.coderName}
                        </Text>
                    </Flex>
                </NavLink>
            ) : (
                <Flex flexDirection="column" align="center" mb={2}>
                    <CoderAvatar size={avatarSize} name="Chưa có người dùng" mb={2} />
                    <Text fontWeight="bold" fontSize={nameFontSize}>
                        Chưa có người dùng
                    </Text>
                </Flex>
            )}

            {isLoading ? (
                <Skeleton height="30px" width="60px" borderRadius="full" />
            ) : (
                <Badge
                    fontSize={badgeFontSize}
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
