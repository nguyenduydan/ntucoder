import React, { useState, useEffect, useCallback } from "react";
import { Box, Text, Spinner, Center, Select, Flex } from "@chakra-ui/react";
import LineChart from "@/components/charts/LineChart";
import { getList } from "@/config/apiService";
import { formatDateTime } from "@/utils/utils";

const Courses = ({ refreshKey, onFinishRefresh, height }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [count, setCount] = useState(10);
    const [sortField, setSortField] = useState("enrollCount");
    const [ascending, setAscending] = useState(false);

    const fetchCourses = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getList({
                controller: "Course",
                page: 1,
                pageSize: count,
                ascending,
                params: {
                    sortField,
                }
            });

            if (Array.isArray(response?.data)) {
                const dataWithEnrolls = response.data.map((course) => ({
                    ...course,
                    enrolls: course.enrollCount ?? 0,
                    title: course.courseName || "Không tên",
                }));
                setCourses(dataWithEnrolls);
            } else {
                throw new Error("Dữ liệu không hợp lệ.");
            }
        } catch (err) {
            setError("Không thể tải danh sách khóa học.");
            console.error(err);
        } finally {
            setLoading(false);
            if (onFinishRefresh) onFinishRefresh();
        }
    }, [sortField, ascending, onFinishRefresh, count]);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses, refreshKey]);

    const chartData = [
        {
            name: "Số lượt đăng ký",
            data: courses.map((course) => ({
                x: course.title || "Không tên",
                y: course.enrolls,
                date:
                    sortField === "createdAt" || sortField === "updatedAt"
                        ? course[sortField]
                        : course["updatedAt"],
            })),
        },
    ];

    const chartOptions = {
        chart: { type: "line", toolbar: { show: false } },
        stroke: { curve: "smooth", width: 3 },
        markers: { size: 5 },
        dataLabels: { enabled: true },
        xaxis: {
            categories: courses.map((c) => c.title || "Không tên"),
            labels: { show: false },
            axisTicks: { show: false },
            axisBorder: { show: false },
        },
        tooltip: {
            enabled: true,
            intersect: false,
            custom: function ({ seriesIndex, dataPointIndex }) {
                const point = chartData[seriesIndex].data[dataPointIndex];
                const formattedDate = formatDateTime(point.date); // Sử dụng hàm đã có
                return `
                    <div style="padding: 8px;">
                        <strong>${point.x}</strong><br />
                        Lượt đăng ký: <strong>${point.y}</strong><br />
                        Thời gian: <span>${formattedDate}</span>
                    </div>
                `;
            },
        },
        colors: ["#3182ce"],
    };

    return (
        <Box
            p={5}
            bg="white"
            height={height || "auto"}
            display="flex"
            flexDirection="column"
            minHeight={0}
            boxShadow="md"
        >
            <Text fontSize="xl" fontWeight="bold" mb={4}>
                📈 Thống kê lượt đăng ký khóa học
            </Text>

            <Flex mb={4} gap={4}>
                <Select
                    maxW="200px"
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value)}
                >
                    <option value="courseName">Tên khóa học</option>
                    <option value="enrollCount">Số lượt đăng ký</option>
                    <option value="createdAt">Ngày tạo</option>
                    <option value="updatedAt">Theo ngày đăng ký</option>
                </Select>

                <Select
                    maxW="150px"
                    value={ascending ? "asc" : "desc"}
                    onChange={(e) => setAscending(e.target.value === "asc")}
                >
                    {(sortField === "createdAt" || sortField === "updatedAt") ? (
                        <>
                            <option value="desc">Mới nhất</option>
                            <option value="asc">Cũ nhất</option>
                        </>
                    ) : sortField === "enrollCount" ? (
                        <>
                            <option value="desc">Giảm dần</option>
                            <option value="asc">Tăng dần</option>
                        </>
                    ) : (
                        <>
                            <option value="desc">Z-A</option>
                            <option value="asc">A-Z</option>
                        </>
                    )}
                </Select>
                <Select
                    maxW="150px"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </Select>
            </Flex>

            {/* Phần nội dung hiển thị chiếm hết không gian còn lại */}
            <Box flex="1" minHeight={0} overflow="hidden">
                {loading ? (
                    <Center height="100%">
                        <Spinner size="xl" />
                    </Center>
                ) : error ? (
                    <Text color="red.500">{error}</Text>
                ) : courses.length > 0 ? (
                    <Box w="100%" h="100%" minH="0">
                        <LineChart
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
                ) : (
                    <Text>Không có dữ liệu để hiển thị</Text>
                )}
            </Box>

        </Box>
    );
};

export default Courses;
