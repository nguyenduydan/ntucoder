import api from '@/config/apiConfig';
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Skeleton,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
    Flex
} from "@chakra-ui/react";
import { formatDateTime } from '@/utils/utils';
import Pagination from '@/components/pagination/pagination';


const columnsData = [
    { Header: "STT" },
    { Header: "Tài khoản" },
    { Header: "Thời gian nộp" },
    { Header: "Ngôn ngữ" },
    { Header: "Kiểm thử" },
    { Header: "Điểm" },
    { Header: "Thời gian" }
];

const History = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const problemID = searchParams.get("problemID");

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 10,
        totalPages: 0,
        totalCount: 0
    });

    const fetchData = useCallback(async () => {
        if (!problemID) return;

        setIsLoading(true);
        try {
            const res = await api.get(`/Submission/history`, {
                params: {
                    problemId: problemID,
                    page: pagination.currentPage,
                    pageSize: pagination.pageSize
                }
            });

            const { data, currentPage, pageSize, totalPages, totalCount } = res.data;

            setData(data);
            setPagination({
                currentPage,
                pageSize,
                totalPages,
                totalCount
            });
        } catch (error) {
            console.error("Error fetching history", error);
        } finally {
            setIsLoading(false);
        }
    }, [problemID, pagination.currentPage, pagination.pageSize]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, currentPage: page }));
    };

    const handlePageSizeChange = (size) => {
        setPagination(prev => ({ ...prev, pageSize: size, currentPage: 1 }));
    };

    return (
        <Box p={4}>
            <Flex justify="flex-end" mb={3}>
                <Button
                    onClick={fetchData}
                    colorScheme='blue'
                    borderRadius="md"
                    size="sm"
                >
                    Refresh
                </Button>
            </Flex>

            {isLoading ? (
                <Table variant="striped" maxH="450px" overflowY="auto">
                    <Tbody>
                        {Array.from({ length: 5 }).map((_, idx) => (
                            <Tr key={`skeleton-${idx}`}>
                                {columnsData.map((_, colIdx) => (
                                    <Td key={colIdx} p={3}>
                                        <Skeleton height="20px" />
                                    </Td>
                                ))}
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            ) : (
                <Table variant='striped' colorScheme='blue'>
                    <Thead>
                        <Tr>
                            {columnsData.map((col, idx) => (
                                <Th key={idx} fontSize="xs" textAlign="center" maxW="80px" p={2}>
                                    {col.Header}
                                </Th>
                            ))}
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data.length === 0 ? (
                            <Tr>
                                <Td colSpan={columnsData.length} textAlign="center" fontSize="sm">
                                    Chưa có bài làm nào
                                </Td>
                            </Tr>
                        ) : (
                            data.map((item, index) => (
                                <Tr key={item.submissionID || index}>
                                    <Td p={2} fontSize="sm" textAlign="center">
                                        {(pagination.currentPage - 1) * pagination.pageSize + index + 1}
                                    </Td>
                                    <Td p={2} fontSize="sm" textAlign="center">
                                        <Button
                                            onClick={() => navigate(`/profile/${item.coderID}`)}
                                            variant="link"
                                            colorScheme="black"
                                            fontSize="sm"
                                            fontWeight="normal"
                                            _hover={{ color: "blue.500", textDecoration: "underline" }}
                                        >
                                            {item.coderName}
                                        </Button>
                                    </Td>
                                    <Td p={2} fontSize="sm" textAlign="center">{formatDateTime(item.submitTime)}</Td>
                                    <Td p={2} fontSize="sm" textAlign="center">{item.compilerName || '---'}</Td>
                                    <Td p={2} fontSize="sm" textAlign="center" fontWeight="bold"
                                        color={
                                            item.testResult === 'Accepted'
                                                ? 'green.500'
                                                : /fail|wrong|error/i.test(item.testResult)
                                                    ? 'red.500'
                                                    : 'yellow.500'
                                        }>
                                        {item.testResult || '--/--'}
                                    </Td>
                                    <Td p={2} fontSize="sm" textAlign="center">{item.point}</Td>
                                    <Td p={2} fontSize="sm" textAlign="center">
                                        {item.maxTimeDuration != null ? `${item.maxTimeDuration} ms` : '--'}
                                    </Td>
                                </Tr>
                            ))
                        )}
                    </Tbody>
                </Table>
            )}

            <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                pageSize={pagination.pageSize}
                totalRows={pagination.totalCount}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
            />
        </Box>
    );
};

export default History;
