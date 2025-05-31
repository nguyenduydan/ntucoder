import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    List,
    Flex,
    Box,
    Text,
    IconButton,
    Tooltip,
    Spinner,
    Center,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    useToast,
    useColorModeValue
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { NavLink } from 'react-router-dom';
import { getList } from "@/config/apiService";
import api from '@/config/apiConfig';

const EnrollmentList = ({
    courseID,
    onEnrollmentDeleted,
    pageSize = 10,
    sortField = "enrolledAt",
    ascending = false,
    initialLimit = 5 // Số lượng hiển thị ban đầu
}) => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [deletingId, setDeletingId] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    const toast = useToast();
    const listColor = useColorModeValue("gray.200", "gray.700");
    const textColor = useColorModeValue("gray.800", "white");
    const observerRef = useRef();
    const listEndRef = useRef();

    // Fetch enrollments from API
    const fetchEnrollments = async (page = 1, append = false) => {
        if (!courseID) return;

        if (!append) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }
        setError(null);

        try {
            const response = await getList({
                controller: "Enrollment",
                page: page,
                pageSize: pageSize,
                sortField: sortField,
                ascending: ascending,
                params: {
                    courseID: courseID
                }
            });

            const newEnrollments = response.data || [];

            if (append) {
                setEnrollments(prev => [...prev, ...newEnrollments]);
            } else {
                setEnrollments(newEnrollments);
            }

            setTotalPages(response.totalPages || 0);
            setTotalCount(response.totalCount || 0);
            setCurrentPage(page);

            // Kiểm tra còn data để load không
            setHasMore(page < (response.totalPages || 0));

        } catch (err) {
            console.error("Error fetching enrollments:", err);
            setError("Không thể tải danh sách học viên");
            if (!append) {
                setEnrollments([]);
            }
        } finally {
            if (!append) {
                setLoading(false);
            } else {
                setLoadingMore(false);
            }
        }
    };

    // Load more data khi scroll đến cuối
    const loadMoreData = useCallback(() => {
        if (hasMore && !loadingMore && !loading) {
            fetchEnrollments(currentPage + 1, true);
        }
    }, [hasMore, loadingMore, loading, currentPage]);

    // Intersection Observer để detect khi scroll đến cuối
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMoreData();
                }
            },
            {
                threshold: 1.0,
                rootMargin: '20px'
            }
        );

        if (listEndRef.current) {
            observer.observe(listEndRef.current);
        }

        observerRef.current = observer;

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [loadMoreData]);

    // Initial load khi component mount hoặc courseID thay đổi
    useEffect(() => {
        setEnrollments([]);
        setCurrentPage(1);
        setHasMore(true);
        fetchEnrollments(1, false);
    }, [courseID, sortField, ascending, pageSize]);

    // Handle enrollment deletion
    const handleDeleteEnrollment = async (coderID) => {
        setDeletingId(coderID);
        try {
            const res = await api.delete("/Enrollment", {
                data: {
                    courseID: courseID,
                    coderID: coderID
                }
            });

            if (res.status === 200) {
                toast({
                    title: "Đã xóa học viên khỏi khóa học",
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                    position: "top",
                    variant: "top-accent",
                });

                // Xóa khỏi state hiện tại thay vì reload
                setEnrollments(prev => prev.filter(enrollment => enrollment.coderID !== coderID));
                setTotalCount(prev => prev - 1);

                // Notify parent component
                if (onEnrollmentDeleted) {
                    onEnrollmentDeleted(coderID);
                }
            }
        } catch (error) {
            console.error("Error deleting enrollment:", error);
            toast({
                title: "Lỗi xóa học viên",
                description: error.response?.data?.message || "Có lỗi xảy ra khi xóa học viên",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top",
                variant: "top-accent",
            });
        } finally {
            setDeletingId(null);
        }
    };

    // Loading state ban đầu
    if (loading && enrollments.length === 0) {
        return (
            <Center py={8}>
                <Spinner
                    thickness='4px'
                    emptyColor="gray.200"
                    speed='0.65s'
                    color='blue.500'
                    size='lg'
                />
            </Center>
        );
    }

    // Error state
    if (error && enrollments.length === 0) {
        return (
            <Alert status="error" borderRadius="md">
                <AlertIcon />
                <Box>
                    <AlertTitle>Lỗi!</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Box>
            </Alert>
        );
    }

    // Empty state
    if (enrollments.length === 0 && !loading) {
        return (
            <Alert status="info" borderRadius="md">
                <AlertIcon />
                <Box>
                    <AlertTitle>Thông tin</AlertTitle>
                    <AlertDescription>Chưa có học viên nào đăng ký khóa học này.</AlertDescription>
                </Box>
            </Alert>
        );
    }

    // Lấy enrollments để hiển thị (giới hạn ban đầu hoặc tất cả nếu đã load thêm)
    const displayedEnrollments = enrollments;

    return (
        <Box>
            {/* Header with count */}
            <Flex justify="space-between" align="center" mb={4}>
                <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                    Danh sách học viên ({totalCount})
                </Text>
                {hasMore && (
                    <Text fontSize="sm" color="gray.500">
                        Cuộn xuống để xem thêm
                    </Text>
                )}
            </Flex>

            {/* Enrollment List */}
            <Box
                maxH="22vh"
                overflowY="auto"
                css={{
                    '&::-webkit-scrollbar': {
                        width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: '#f1f1f1',
                        borderRadius: '3px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: '#c1c1c1',
                        borderRadius: '3px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        background: '#a8a8a8',
                    },
                }}
            >
                <List spacing={3}>
                    {displayedEnrollments.map((enrollment, index) => (
                        <Flex
                            key={enrollment.coderID}
                            align="center"
                            justify="space-between"
                            bg="transparent"
                        >
                            <Tooltip
                                label={`Xem chi tiết ${enrollment.coderName}`}
                                placement="top"
                                hasArrow
                            >
                                <NavLink
                                    to={`/admin/coder/detail/${enrollment.coderID}`}
                                    style={{ flex: 1, textDecoration: "none" }}
                                >
                                    <Box
                                        bg={listColor}
                                        p={3}
                                        borderRadius="md"
                                        _hover={{
                                            transform: "translateY(-2px)",
                                            shadow: "md"
                                        }}
                                        transition="all 0.2s ease-in-out"
                                    >
                                        <Flex justify="space-between" align="center">
                                            <Text fontWeight="bold" fontSize="13px" color={textColor}>
                                                {index + 1}: {enrollment.coderName}
                                            </Text>
                                            <Text fontSize="sm" color="gray.500">
                                                {new Date(enrollment.enrolledAt).toLocaleDateString('vi-VN')}
                                            </Text>
                                        </Flex>
                                    </Box>
                                </NavLink>
                            </Tooltip>

                            <Tooltip label="Xóa học viên" placement="top" hasArrow>
                                <IconButton
                                    icon={<DeleteIcon />}
                                    colorScheme="red"
                                    size="sm"
                                    aria-label="Xóa học viên"
                                    isRound
                                    ml={3}
                                    isLoading={deletingId === enrollment.coderID}
                                    onClick={() => handleDeleteEnrollment(enrollment.coderID)}
                                    _hover={{ transform: "scale(1.1)" }}
                                    transition="all 0.2s ease-in-out"
                                />
                            </Tooltip>
                        </Flex>
                    ))}
                </List>

                {/* Loading more indicator */}
                {loadingMore && (
                    <Center py={4}>
                        <Spinner size="sm" color="blue.500" />
                        <Text ml={2} fontSize="sm" color="gray.500">
                            Đang tải thêm...
                        </Text>
                    </Center>
                )}

                {/* Intersection observer target */}
                {hasMore && !loadingMore && (
                    <div ref={listEndRef} style={{ height: '20px' }} />
                )}

                {/* End of list indicator */}
                {!hasMore && enrollments.length > 0 && (
                    <Center py={4}>
                        <Text fontSize="sm" color="gray.500">
                            Đã hiển thị tất cả học viên
                        </Text>
                    </Center>
                )}
            </Box>
        </Box>
    );
};

export default EnrollmentList;
