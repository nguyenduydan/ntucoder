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


const CoderRankingTable = ({ coders, loading, currentPage = 1, pageSize = 10 }) => {
    const { coder } = useAuth();
    const coderID = coder?.coderID || "";

    return (
        <Box minH="40vh" overflowX="auto">
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
