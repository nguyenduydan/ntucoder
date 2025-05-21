import React, { useState, useEffect, useCallback } from "react";
import {
    Box,
    Text,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Spinner,
    Center,
    Flex,
    List,
    ListItem,
    Select
} from "@chakra-ui/react";
import BarChar from "@/components/charts/BarChart"; // Custom chart component
import api from "@/config/apiConfig";
import { LimitText, formatDate } from "@/utils/utils";
import sanitizeHtml from "@/utils/sanitizedHTML";

const Blogs = ({ height, refreshKey, onFinishRefresh }) => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [tabIndex, setTabIndex] = useState(0); // 👈 Track current tab
    const [count, setCount] = useState(4);
    const [totalBlogs, setTotalBlogs] = useState(0);
    const [ascendingSort, setAscendingSort] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/Blog/TopViewed?count=${count}&ascingSort=${ascendingSort}`);
            const countBlog = await api.get("/Blog");

            setTotalBlogs(countBlog.data.totalCount);

            const result = response.data;
            setBlogs(Array.isArray(result) ? result : []);
        } catch (err) {
            setError("Không thể tải danh sách bài viết.");
            console.error("Lỗi khi lấy danh sách bài viết:", err);
        } finally {
            setLoading(false);
            onFinishRefresh?.();
        }
    }, [count, ascendingSort, onFinishRefresh]);

    useEffect(() => {
        fetchData();
    }, [fetchData, refreshKey]);

    const handleCountChange = (e) => {
        setCount(Number(e.target.value));
    };

    const handleSortChange = (e) => {
        const value = e.target.value;
        setAscendingSort(value === "true");
    };

    const chartOptions = {
        chart: { type: "bar", toolbar: { show: false } },
        xaxis: {
            categories: blogs.map((b) => LimitText(b.title, 10)),
            labels: {
                style: { fontSize: "12px" },
                rotate: -45,
                hideOverlappingLabels: true,
            },
        },
        dataLabels: { enabled: true, formatter: (val) => `${val.toLocaleString()}` },
        tooltip: {
            y: { formatter: (val) => `${val.toLocaleString()} lượt xem` },
        },
        plotOptions: { bar: { borderRadius: 4 } },
    };

    const chartData = [
        {
            name: "Lượt xem",
            data: blogs.map((b) => b.viewCount),
        },
    ];

    return (
        <Box p={5} bg="white" shadow="md" borderRadius="md" h={height || "auto"}>
            <Text fontSize="xl" fontWeight="bold" mb={4}>
                Bài viết nổi bật <Text as="span" fontWeight="normal" color="gray.600" fontSize="md">(Tổng: {totalBlogs})</Text>
            </Text>

            <Tabs
                variant="soft-rounded"
                colorScheme="blue"
                index={tabIndex}
                onChange={(index) => setTabIndex(index)}
            >
                <Flex justify="space-between" align="center" mb={4} mx={5}>
                    <TabList>
                        <Tab>Danh sách</Tab>
                        <Tab>Biểu đồ cột</Tab>
                    </TabList>
                    <Select
                        maxW="120px"
                        value={ascendingSort}
                        onChange={handleSortChange}
                        placeholder="Sắp xếp theo lượt xem"
                    >
                        <option value="true">Tăng dần</option>
                        <option value="false">Giảm dần</option>
                    </Select>
                    <Select
                        w="fit-content"
                        size="sm"
                        value={count}
                        onChange={handleCountChange}
                        width="120px"
                        placeholder="Chọn số lượng"
                    >
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                    </Select>
                </Flex>

                <TabPanels>
                    <TabPanel p={0} maxH="250px" overflowY="auto">
                        {loading ? (
                            <Center h="100%">
                                <Spinner size="xl" />
                            </Center>
                        ) : error ? (
                            <Text color="red.500">{error}</Text>
                        ) : blogs.length > 0 ? (
                            <List spacing={4}>
                                {blogs.map((blog) => (
                                    <ListItem
                                        key={blog.id}
                                        p={4}
                                        borderWidth="1px"
                                        borderRadius="md"
                                        boxShadow="sm"
                                        _hover={{ bg: "gray.50" }}
                                    >
                                        <Text fontWeight="bold">{LimitText(blog.title, 50)}</Text>
                                        <Box
                                            sx={{ wordBreak: "break-word" }}
                                            dangerouslySetInnerHTML={{
                                                __html: sanitizeHtml(LimitText(blog.content, 50)),
                                            }}
                                        />
                                        <Flex mt={2} align="center" flexWrap="wrap" gap={2}>
                                            <Text fontSize="sm" color="gray.500">
                                                {blog.coderName || "Người viết không xác định"} |
                                            </Text>
                                            <Text fontSize="sm" color="gray.500">
                                                {formatDate(blog.blogDate)} |
                                            </Text>
                                            <Text>{blog.viewCount.toLocaleString()} lượt xem</Text>
                                        </Flex>
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Text>Không có bài viết nào.</Text>
                        )}
                    </TabPanel>

                    <TabPanel p={0}>
                        {loading ? (
                            <Center h="100%">
                                <Spinner size="xl" />
                            </Center>
                        ) : error ? (
                            <Text color="red.500">{error}</Text>
                        ) : blogs.length === 0 ? (
                            <Text>Không có dữ liệu để hiển thị.</Text>
                        ) : (
                            <Box w="100%" h="250px">
                                <BarChar
                                    chartData={chartData}
                                    chartOptions={{
                                        ...chartOptions,
                                        chart: {
                                            ...chartOptions.chart,
                                            height: "100%",
                                        },
                                    }}
                                />
                            </Box>
                        )}
                    </TabPanel>


                </TabPanels>
            </Tabs>

        </Box >
    );
};

export default Blogs;
