import React, { useEffect, useState, useCallback } from 'react';
import {
    Box, Heading, Text, Textarea, Button, VStack, HStack, Progress, Divider, Icon, useToast,
    Flex,
    Spinner
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import api from '@/config/apiConfig';
import StarRating from '@/views/user/Course/components/StarRating';
import { formatDateTime } from '@/utils/utils';
import { useAuth } from '@/contexts/AuthContext';
import { NavLink } from 'react-router-dom';
import CoderAvatar from './CoderAvatar';


const Review = ({ courseId }) => {
    const { isAuthenticated, coder } = useAuth();
    const [reviewData, setReviewData] = useState({
        rating: 5,
        content: '',
    });

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [breakdown, setBreakdown] = useState([0, 0, 0, 0, 0]);
    const toast = useToast();

    const [showMore, setShowMore] = useState(false);

    // Lấy 5 đánh giá đầu tiên nếu showMore là false
    const reviewsToShow = showMore ? reviews : reviews.slice(0, 5);

    const handleToggleShowMore = () => {
        setShowMore((prev) => !prev);
    };

    const fetchReviews = useCallback(async () => {
        try {
            const response = await api.get(`/Review?courseId=${courseId}`);
            const data = response.data || [];
            setReviews(data);

            // Tính breakdown rating
            const counts = [0, 0, 0, 0, 0];
            data.forEach((r) => counts[r.rating - 1]++);
            setBreakdown(counts.reverse()); // [5*, 4*, 3*, 2*, 1*]
        } catch (e) {
            toast({ title: 'Lỗi', description: e.message, status: 'error' });
        } finally {
            setLoading(false);
        }
    }, [courseId, toast]);

    const handleAddReview = async () => {
        try {
            const res = await api.post(`/Review?courseId=${courseId}`, reviewData);
            if (res.status === 200 || res.status === 201) {
                toast({
                    title: 'Thành công',
                    description: 'Đánh giá đã được gửi!',
                    status: 'success',
                    variant: 'top-accent',
                    duration: 2000,
                    position: 'top',
                    isClosable: true
                });
                setReviewData({ ...reviewData, content: '', rating: 5 });
            }

            fetchReviews(); // Refresh
        } catch (e) {
            toast({
                title: 'Thất bại',
                description: e.message,
                status: 'error',
                variant: 'top-accent',
                duration: 2000,
                position: 'top',
                isClosable: true
            });
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);


    const total = reviews.length;
    const avgRating = total > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)
        : 0;

    return (
        <Box mx="auto" p={4}>
            {/* Tổng quan */}
            <Heading size="lg" mb={4}>Đánh giá khóa học</Heading>
            <HStack spacing={6} align="start" mb={6}>
                <Box minW="200px">
                    <Text fontSize="5xl" >{avgRating}</Text>
                    <HStack>
                        {[...Array(5)].map((_, i) => (
                            <StarIcon boxSize={7} key={i} color={i < Math.round(avgRating) ? 'yellow.400' : 'gray.300'} />
                        ))}
                    </HStack>
                    <Text color="gray.500" mt={3}>({total} đánh giá)</Text>
                </Box>

                <VStack align="start" flex={1}>
                    {[5, 4, 3, 2, 1].map((star, i) => {
                        const percent = total ? Math.round((breakdown[i] / total) * 100) : 0;
                        return (
                            <HStack key={star} w="100%">
                                <Text w="30px" flex="0.1">{star} sao</Text>
                                <Progress
                                    value={percent}
                                    flex="1"
                                    size="sm"
                                    colorScheme="yellow"
                                    bg="gray.200"
                                    rounded="md"
                                    sx={{
                                        '& > div': {
                                            backgroundColor: 'yellow.400', // phần thanh tiến độ
                                        }
                                    }}
                                />
                                <Text w="40px" textAlign="right" color="gray.400">{percent}%</Text>
                            </HStack>
                        );
                    })}
                </VStack>
            </HStack>

            {/* Form đánh giá */}
            {isAuthenticated && (
                <Box mb={8}>
                    <Heading size="md" mb={3}>Viết đánh giá</Heading>

                    <Textarea
                        placeholder="Nội dung đánh giá của bạn..."
                        value={reviewData.content}
                        onChange={(e) => setReviewData({ ...reviewData, content: e.target.value })}
                        mb={3}
                        resize="none"
                        h="140px"
                    />
                    <Flex justify="flex-end">
                        <StarRating
                            value={reviewData.rating}
                            onChange={(rating) => setReviewData({ ...reviewData, rating })}
                        />

                        <Button
                            colorScheme="blue" ml={3}
                            onClick={handleAddReview}
                            isDisabled={reviewData.content.length === 0}
                        >
                            Gửi đánh giá
                        </Button>
                    </Flex>
                </Box>
            )}

            <Divider mb={6} />

            {/* Danh sách đánh giá */}
            <Heading size="md" mb={4}>Đánh giá của người học</Heading>
            {loading ? (
                <Spinner />
            ) : (
                reviewsToShow.length === 0 ? (
                    <Text>Chưa có đánh giá nào.</Text>
                ) : (
                    reviewsToShow.map((review) => (
                        <Box key={review.reviewID} mb={2} p={3} borderRadius="md">
                            <HStack mb={1}>
                                <CoderAvatar
                                    coderID={review.coderID}
                                    size="sm"
                                />
                                <Box>
                                    <NavLink
                                        to={`/profile/${review.coderID}`}
                                    >
                                        <Text _hover={{ color: "blue" }} fontWeight="bold">{(review.coderName || 'Ẩn danh').replace(/(.{3}).*(@.*)/, "$1******$2")}</Text>
                                    </NavLink>
                                    <HStack spacing={1}>
                                        {[...Array(5)].map((_, i) => (
                                            <Icon as={StarIcon} key={i} color={i < review.rating ? 'yellow.400' : 'gray.300'} />
                                        ))}
                                        <Text fontSize="xs" color="gray.500">
                                            {formatDateTime(review.createdAt)}
                                        </Text>
                                    </HStack>
                                </Box>
                            </HStack>
                            <Text mt={2}>{review.content}</Text>
                            <Divider mt={2} />
                        </Box>
                    ))
                )
            )}
            {reviews.length > 5 && (
                <Button mt={4}
                    variant="outline"
                    colorScheme='black'
                    _hover={{ bg: 'black', color: 'white' }}
                    onClick={handleToggleShowMore}>
                    {showMore ? 'Thu gọn' : 'Xem thêm'}
                </Button>
            )}
        </Box>
    );
};

export default Review;
