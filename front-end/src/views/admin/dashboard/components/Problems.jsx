import React, { useState, useEffect, useCallback } from "react";
import {
    Box,
    SimpleGrid,
    Text,
    Select,
    Spinner,
    Center,
    Flex,
    ListItem,
    List,
} from "@chakra-ui/react";
import { getList } from "@/config/apiService";
import { formatDate, LimitText } from "@/utils/utils";
import sanitizeHtml from "@/utils/sanitizedHTML";

const Problems = ({ height, refreshKey, onFinishRefresh }) => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [published, setPublished] = useState("true");

    const fetchProblems = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = { ascending: true };

            if (published === "true" || published === "false") {
                params.published = published === "true";
            }

            const response = await getList({
                controller: "Problem",
                page: 1,
                pageSize: 10,
                params,
            });

            setProblems(response.data || []);
        } catch (err) {
            setError("Không thể tải danh sách bài tập.");
            console.error("Lỗi khi lấy danh sách bài tập:", err);
        } finally {
            setLoading(false);
            onFinishRefresh?.();
        }
    }, [published, onFinishRefresh]);

    useEffect(() => {
        fetchProblems();
    }, [fetchProblems, refreshKey]);

    const handlePublishedChange = (e) => {
        setPublished(e.target.value);
    };

    return (
        <Box p={5} bg="white" h={height || "auto"} shadow="md" borderRadius="md">
            <Text fontSize="xl" fontWeight="bold" mb={4}>
                Bài tập ({problems.length})
            </Text>

            <Flex mb={4} gap={4} align="center">
                <Select maxW="200px" value={published} onChange={handlePublishedChange}>
                    <option value="">Tất cả</option>
                    <option value="true">Công khai</option>
                    <option value="false">Không công khai</option>
                </Select>
            </Flex>

            {loading ? (
                <Center h="100%">
                    <Spinner size="xl" />
                </Center>
            ) : error ? (
                <Text color="red.500">{error}</Text>
            ) : problems.length === 0 ? (
                <Text>Không có bài tập nào.</Text>
            ) : (
                <List spacing={4} maxH="250px" overflowY="auto">
                    {problems.map(({ problemID, problemName, problemContent, coderName, }) => (
                        <ListItem
                            key={problemID}
                            p={4}
                            borderWidth="1px"
                            borderRadius="md"
                            _hover={{ shadow: "lg" }}
                        >
                            <Text fontWeight="bold">{problemName}</Text>
                            <Box
                                sx={{ wordBreak: "break-word" }}
                                dangerouslySetInnerHTML={{
                                    __html: sanitizeHtml(LimitText(problemContent, 50)),
                                }}
                            />
                            <Text fontSize="sm" color="gray.600">
                                Người tạo: {coderName}
                            </Text>
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
};

export default Problems;
