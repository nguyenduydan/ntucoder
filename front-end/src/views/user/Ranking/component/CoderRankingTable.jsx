import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Avatar,
    Text,
    Badge,
    Box,
    Flex,
    Skeleton,
    SkeletonCircle,
    SkeletonText,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

const CoderRankingTable = ({ coders, loading, currentPage = 1, pageSize = 10, onReset }) => {
    const { coder } = useAuth();
    const coderID = coder?.coderID || "";

    // State cho bộ đếm ngược
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        let resetTime = localStorage.getItem("rankingResetTime");

        if (!resetTime) {
            resetTime = Date.now() + SEVEN_DAYS_MS;
            localStorage.setItem("rankingResetTime", resetTime);
        } else {
            resetTime = parseInt(resetTime, 10);
        }

        const updateTimer = () => {
            const now = Date.now();
            const diff = resetTime - now;

            if (diff <= 0) {
                const newResetTime = now + SEVEN_DAYS_MS;
                localStorage.setItem("rankingResetTime", newResetTime);
                setTimeLeft(SEVEN_DAYS_MS);

                // ✅ Gọi lại handlefetchAll từ cha
                if (onReset && typeof onReset === "function") {
                    onReset();
                }
            } else {
                setTimeLeft(diff);
            }
        };

        updateTimer();
        const timerId = setInterval(updateTimer, 1000);
        return () => clearInterval(timerId);
    }, [onReset]);


    // Hàm format ms thành chuỗi: "X ngày HH:mm:ss"
    const formatTimeLeft = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const days = Math.floor(totalSeconds / (24 * 3600));
        const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${days} ngày ${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    return (
        <Box minH="40vh" overflowX="auto">
            {/* Hiển thị bộ đếm ngược */}
            <Box mb={4} p={2} bg="blue.50" borderRadius="md" textAlign="center" fontWeight="semibold" color="blue.700">
                Reset bảng xếp hạng trong: {formatTimeLeft(timeLeft)}
            </Box>

            <TableContainer overflowX="auto">
                <Table size="sm" colorScheme="blue" minW="320px">
                    <Thead bg="gray.100" position="sticky" top={0} zIndex={1}>
                        <Tr>
                            <Th w="20px" py={[2, 3]} fontSize={["xs", "sm"]}>#</Th>
                            <Th ps={[2, 5]} fontSize={["sm", "md"]}>Tên người dùng</Th>
                            <Th ps={[2, 5]} fontSize={["sm", "md"]}>Điểm</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, idx) => (
                                <Tr key={`skeleton-${idx}`}>
                                    <Td py={[2, 4]}><Skeleton height="20px" /></Td>
                                    <Td py={[2, 4]}>
                                        <Flex align="center" gap={3}>
                                            <SkeletonCircle size={["6", "8"]} />
                                            <SkeletonText noOfLines={1} width="120px" />
                                        </Flex>
                                    </Td>
                                    <Td py={[2, 4]}><Skeleton height="20px" width="60px" /></Td>
                                </Tr>
                            ))
                        ) : Array.isArray(coders) && coders.length > 0 ? (
                            coders.map((coder, idx) => (
                                <Tr key={coder.coderID} bg={coder.coderID === coderID ? "blue.300" : "white"}>
                                    <Td py={[2, 4]} fontWeight="bold" fontSize={["xs", "sm"]}>
                                        {(currentPage - 1) * pageSize + idx + 1}
                                    </Td>
                                    <Td py={[2, 4]}>
                                        <NavLink to={`/profile/${coder.coderID}`}>
                                            <Flex
                                                alignItems="center"
                                                gap={3}
                                                _hover={{ color: "blue.600", transform: "scale(1.02)" }}
                                                transition="all .2s ease-in-out"
                                            >
                                                <Avatar
                                                    name={coder.coderName || "Coder"}
                                                    src={coder.avatar}
                                                    size={["xs", "sm"]}
                                                    loading="lazy"
                                                />
                                                <Text fontWeight="bold" fontSize={["sm", "md"]}>
                                                    {coder.coderName}
                                                </Text>
                                            </Flex>
                                        </NavLink>
                                    </Td>
                                    <Td py={[2, 4]}>
                                        <Badge fontSize={["xs", "sm"]} colorScheme="green">
                                            {coder.totalPoint} điểm
                                        </Badge>
                                    </Td>
                                </Tr>
                            ))
                        ) : (
                            <Tr>
                                <Td colSpan={3} py={[6, 8]} textAlign="center" fontSize={["sm", "md"]}>
                                    <Text fontStyle="italic" color="gray.500">
                                        Không có dữ liệu để hiển thị.
                                    </Text>
                                </Td>
                            </Tr>
                        )}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default CoderRankingTable;
