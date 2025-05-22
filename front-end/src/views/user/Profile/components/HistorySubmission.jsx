import api from '@/config/apiConfig';
import {
    Box,
    Text,
    Divider,
    Stack,
    Spinner,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td
} from '@chakra-ui/react';
import React, { useEffect, useState, useCallback } from 'react';
import { formatDateTime } from '@/utils/utils';
import Pagination from '@/components/pagination/pagination';

const HistorySubmission = ({ coderId }) => {
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    const fetchHistory = useCallback(async (page = 1, size = 10) => {
        setLoading(true);
        try {
            if (!coderId) {
                setHistory([]);
                return;
            }

            const res = await api.get(`/Submission/history`, {
                params: {
                    coderId: coderId,
                    page,
                    pageSize: size
                }
            });

            const { data, currentPage, pageSize, totalPages, totalCount } = res.data;

            setHistory(data || []);
            setCurrentPage(currentPage);
            setPageSize(pageSize);
            setTotalPages(totalPages);
            setTotalCount(totalCount);
        } catch (error) {
            console.error("❌ Error fetching history:", error);
        } finally {
            setLoading(false);
        }
    }, [coderId]);

    useEffect(() => {
        fetchHistory(currentPage, pageSize);
    }, [fetchHistory, currentPage, pageSize]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handlePageSizeChange = (size) => {
        setPageSize(size);
        setCurrentPage(1);
    };

    return (
        <Box px={6} py={5} minH="50vh" bg="white" borderRadius="md" shadow="md">
            <Box>
                <Text fontSize="xl" color="blue.600" fontWeight="bold">
                    Lịch sử làm bài
                </Text>
                <Divider w="60px" h="3px" bg="blue.600" borderRadius="md" mt={1} />
            </Box>

            {loading ? (
                <Stack align="center" mt={10}>
                    <Spinner size="lg" color="blue.500" />
                </Stack>
            ) : history.length === 0 ? (
                <Stack spacing={4} mt={5}>
                    <Text fontSize="lg" color="gray.600">
                        Chưa có lịch sử làm bài nào
                    </Text>
                </Stack>
            ) : (
                <Box overflowX="auto" mt={5}>
                    <Table variant="simple">
                        <Thead>
                            <Tr position="sticky" top={0} zIndex={1} bg="gray.200">
                                <Th textAlign="center">STT</Th>
                                <Th textAlign="center">Thời gian nộp</Th>
                                <Th textAlign="center">Ngôn ngữ</Th>
                                <Th textAlign="center">Kết quả</Th>
                                <Th textAlign="center">Điểm</Th>
                                <Th textAlign="center">Thời gian</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {history.map((item, index) => (
                                <Tr key={item.submissionID || index}>
                                    <Td textAlign="center">
                                        {(currentPage - 1) * pageSize + index + 1}
                                    </Td>
                                    <Td textAlign="center">{formatDateTime(item.submitTime)}</Td>
                                    <Td textAlign="center">{item.compilerName || "---"}</Td>
                                    <Td textAlign="center" fontWeight="bold" color={
                                        item.testResult === 'Accepted'
                                            ? 'green.500'
                                            : /fail|wrong|error/i.test(item.testResult)
                                                ? 'red.500'
                                                : 'yellow.500'
                                    }>
                                        {item.testResult || "--"}
                                    </Td>
                                    <Td textAlign="center">{item.point}</Td>
                                    <Td textAlign="center">{item.maxTimeDuration != null ? `${item.maxTimeDuration} ms` : "--"}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalRows={totalCount}
                onPageChange={handlePageChange}
                pageSize={pageSize}
                onPageSizeChange={handlePageSizeChange}
            />
        </Box>
    );
};

export default HistorySubmission;
