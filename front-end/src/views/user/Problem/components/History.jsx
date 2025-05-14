import api from 'config/apiConfig';
import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
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
import { formatDateTime } from 'utils/utils';

const columnsData = [
    { Header: "STT" },
    { Header: "Thời gian nộp" },
    { Header: "Ngôn ngữ" },
    { Header: "Kiểm thử" },
    { Header: "Điểm" },
    { Header: "Thời gian" }
];

const History = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const problemID = searchParams.get("problemID");

    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState([]);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        if (!problemID) {
            setIsLoading(false);
            return;
        }

        try {
            const res = await api.get(`/Submission/history?problemId=${problemID}`);
            setHistory(res.data);
        } catch (error) {
            console.log("Error fetching history", error);
        } finally {
            setIsLoading(false);
        }
    }, [problemID]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleFetchData = () => {
        fetchData();
    };

    return (
        <Box>
            <Flex justify="flex-end" mb={3}>
                <Button
                    onClick={handleFetchData}
                    colorScheme='blue'
                    borderRadius="md"
                    size="sm"
                >
                    Refresh
                </Button>
            </Flex>
            {isLoading ? (
                <Table variant="striped">
                    <Tbody>
                        {Array.from({ length: 5 }).map((_, idx) => (
                            <Tr key={`skeleton-${idx}`}>
                                {columnsData.map((column, colIdx) => (
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
                        {history.length === 0 ? (
                            <Tr>
                                <Td colSpan={columnsData.length} textAlign="center" fontSize="sm">
                                    Chưa có bài làm nào
                                </Td>
                            </Tr>
                        ) : (
                            history.map((item, index) => (
                                <Tr key={item.submissionID || index}>
                                    <Td p={2} fontSize="sm" textAlign="center">{index + 1}</Td>
                                    <Td p={2} fontSize="sm" textAlign="center">{formatDateTime(item.submitTime)}</Td>
                                    <Td p={2} fontSize="sm" textAlign="center">{item.compilerName || '---'}</Td>
                                    <Td
                                        p={2}
                                        fontSize="sm"
                                        textAlign="center"
                                        fontWeight="bold"
                                        color={
                                            item.testResult === 'Accepted'
                                                ? 'green.500'
                                                : /fail|wrong|error/i.test(item.testResult)
                                                    ? 'red.500'
                                                    : 'yellow.500'
                                        }
                                    >
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
        </Box>
    );
};

export default History;
