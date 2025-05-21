import React, { useState, useEffect, useCallback } from "react";
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Text,
    Spinner,
    Center,
} from "@chakra-ui/react";
import api from "@/config/apiConfig";
import { FaMedal } from "react-icons/fa";
import { FcVip } from "react-icons/fc";


const CodersRanking = ({ refreshKey, onFinishRefresh, height }) => {
    const [coders, setCoders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCoders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get("/Coder/list-ranking");
            const result = response.data;

            const dataWithRank = result.data
                .slice(0, 5) // Lấy 5 phần tử đầu tiên
                .map((coder, index) => ({
                    ...coder,
                    rank: index + 1,
                }));

            setCoders(dataWithRank);
        } catch (err) {
            setError("Không thể tải danh sách coder.");
            console.error("Lỗi khi lấy danh sách coder:", err);
        } finally {
            setLoading(false);
            onFinishRefresh?.();
        }
    }, [onFinishRefresh]);

    useEffect(() => {
        fetchCoders();
    }, [fetchCoders, refreshKey]);

    if (loading) {
        return (
            <Box p={5} bg="white" shadow="md" borderRadius="md" h={height || "auto"}>
                <Center h="100%">
                    <Spinner size="xl" />
                </Center>
            </Box>
        );
    }

    return (
        <Box p={5} bg="white" shadow="md" borderRadius="md" h={height || "auto"}>
            <Text fontSize="xl" fontWeight="bold" mb={4} display="flex" alignItems="center" gap={2}>
                <FcVip size={24} />
                Danh sách 5 người cao nhất
            </Text>
            {error ? (
                <Text color="red.500">{error}</Text>
            ) : coders.length === 0 ? (
                <Text>Không có dữ liệu xếp hạng.</Text>
            ) : (
                <Table variant="striped" bg="gray.300" size="md">
                    <Thead>
                        <Tr>
                            <Th>Rank</Th>
                            <Th>Tên</Th>
                            <Th>Điểm</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {coders.map(({ coderID, coderName, totalPoint, rank }) => (
                            <Tr
                                key={coderID}
                            >
                                <Td>
                                    {rank <= 3 ? (
                                        <FaMedal
                                            color={
                                                rank === 1
                                                    ? "gold"
                                                    : rank === 2
                                                        ? "silver"
                                                        : "#cd7f32" // Bronze
                                            }
                                            size={20}
                                        />
                                    ) : (
                                        rank
                                    )}
                                </Td>

                                <Td>{coderName}</Td>
                                <Td>{(totalPoint || 0).toLocaleString()}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            )}
        </Box>
    );
};

export default CodersRanking;
