import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Box, Flex, Avatar, Text, Input, Button, VStack, HStack, Collapse, Select,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useToast,
    Skeleton
} from '@chakra-ui/react';
import { GrSend } from "react-icons/gr";
import { useAuth } from '@/contexts/AuthContext';
import api from '@/config/apiConfig';
import { formatRelativeTime } from '@/utils/utils';

const COMMENTS_PAGE_SIZE = 5;

const CommentItem = ({ comment, onReply, onDelete, globalExpand }) => {
    const { coder, isAuthenticated } = useAuth();
    const toast = useToast();
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [showReplies, setShowReplies] = useState(false);
    // AlertDialog state
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const cancelRef = useRef();
    // Khi globalExpand thay đổi, tự mở replies
    useEffect(() => {
        setShowReplies(globalExpand);
    }, [globalExpand]);

    // Mở dialog xác nhận
    const openAlert = () => setIsAlertOpen(true);
    // Đóng dialog
    const closeAlert = () => setIsAlertOpen(false);

    const handleSendReply = async () => {
        if (replyText.trim() === '') return;
        try {
            const payload = {
                content: replyText.trim(),
                courseID: comment.courseID,
                parentCommentID: comment.commentID,
            };

            const token = coder?.token || localStorage.getItem('token');

            const res = await api.post('/comments', payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            onReply(comment.commentID, { ...res.data, replies: [] });
            setReplyText('');
            setShowReplyInput(false);
            setShowReplies(true);
        } catch (err) {
            console.error('Add reply error', err);
            toast({
                title: "Lỗi khi gửi bình luận",
                status: "error",
                position: "top",
                variant: "top-accent",
                duration: "1000"
            });
        }
    };

    const handleReplyClick = () => {
        setShowReplyInput(true);
        setReplyText(`@${comment.coderName} `);
    };

    const handleCancelReply = () => {
        setShowReplyInput(false);
        setReplyText('');
    };
    // Xử lý xóa comment khi xác nhận
    const handleConfirmDelete = async () => {
        try {
            const token = coder?.token || localStorage.getItem('token');
            await api.delete(`/comments/${comment.commentID}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            onDelete(comment.commentID);
            closeAlert();
        } catch (err) {
            console.error('Delete comment error', err);
            toast({
                title: "Lỗi khi xóa bình luận",
                status: "error",
                position: "top",
                variant: "top-accent",
                duration: "1000"
            });
            closeAlert();
        }
    };

    return (
        <Box>
            <Flex align="flex-start" mb={2} position="relative">
                <Avatar size="sm" name={comment.coderName} src={comment.coderAvatar} mr={3} zIndex={1} />
                <Box bg="gray.100" p={3} borderRadius="md" w="full" zIndex={1}>
                    <Flex justify="space-between" align="center">
                        <Text fontWeight="bold" fontSize="sm">{comment.coderName}</Text>
                        {isAuthenticated && coder?.id === comment.coderId && (
                            <Button
                                size="xs"
                                colorScheme="red"
                                variant="ghost"
                                onClick={openAlert}
                            >
                                Xóa
                            </Button>
                        )}
                    </Flex>

                    <Text fontSize="sm" mt={1}>{comment.content}</Text>

                    <HStack mt={2} spacing={4}>
                        <Text fontSize="xs" color="gray.500">{formatRelativeTime(comment.commentTime)}</Text>
                        <Button size="xs" variant="link" colorScheme="blue" onClick={handleReplyClick}>
                            Trả lời
                        </Button>
                        {comment.replies?.length > 0 && (
                            <Button
                                size="xs"
                                variant="link"
                                colorScheme="gray"
                                onClick={() => setShowReplies(!showReplies)}
                            >
                                {showReplies ? 'Ẩn trả lời' : `Xem ${comment.replies.length} trả lời`}
                            </Button>
                        )}
                    </HStack>

                    <Collapse in={showReplyInput} animateOpacity>
                        {isAuthenticated && (
                            <VStack mt={2} align="stretch" spacing={1}>
                                <Text fontWeight="bold" color="blue.600">@{comment.coderName}</Text>
                                <HStack>
                                    <Input
                                        size="sm"
                                        placeholder="Trả lời bình luận..."
                                        value={replyText}
                                        autoFocus
                                        onChange={(e) => setReplyText(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                                    />
                                    <Button size="sm" colorScheme="blue" onClick={handleSendReply}>
                                        Gửi
                                    </Button>
                                    <Button size="sm" variant="outline" colorScheme="red" onClick={handleCancelReply}>
                                        Hủy
                                    </Button>
                                </HStack>
                            </VStack>
                        )}
                    </Collapse>
                </Box>
            </Flex>

            <Collapse in={showReplies} animateOpacity>
                <Box pl={10} position="relative">
                    {comment.replies?.map(reply => (
                        <CommentItem
                            key={reply.commentID}
                            comment={reply}
                            onReply={() => { }}
                            onDelete={onDelete}
                            globalExpand={globalExpand}
                        />
                    ))}
                </Box>
            </Collapse>

            {/* AlertDialog xác nhận xóa */}
            <AlertDialog
                isOpen={isAlertOpen}
                leastDestructiveRef={cancelRef}
                onClose={closeAlert}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Xác nhận xóa
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Bạn có chắc muốn xóa bình luận này? Hành động này không thể hoàn tác.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={closeAlert}>
                                Hủy
                            </Button>
                            <Button colorScheme="red" onClick={handleConfirmDelete} ml={3}>
                                Xóa
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>

    );
};

const CommentSection = ({ courseId }) => {
    const containerRef = useRef(null);
    const { coder, isAuthenticated } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [globalExpand, setGlobalExpand] = useState(false);
    // Mới thêm: state sort
    const [sortBy, setSortBy] = useState('CommentTime'); // mặc định
    const [ascending, setAscending] = useState(false); // false = mới nhất trước


    // Fetch comments theo page + pageSize + sort
    const fetchComments = async (page = 1, append = false, pageSize = COMMENTS_PAGE_SIZE) => {
        try {
            if (page === 1) setLoading(true);
            else setLoadingMore(true);

            const res = await api.get('/comments', {
                params: {
                    courseId,
                    page,
                    pageSize,
                    sortBy,
                    ascending,
                },
            });

            const fetchedComments = res.data.data || [];
            const totalPages = res.data.totalPages || 1;

            if (append) {
                setComments(prev => [...prev, ...fetchedComments]);
            } else {
                setComments(fetchedComments);
            }

            setCurrentPage(page);
            setHasMore(page < totalPages);
        } catch (err) {
            console.error('Load comments error', err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // Hàm load thêm bình luận khi scroll gần đáy
    const handleScroll = useCallback(() => {
        if (!containerRef.current || loadingMore || loading || !hasMore) return;

        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

        // Nếu scroll gần đáy (ví dụ trong 100px)
        if (scrollHeight - scrollTop - clientHeight < 100) {
            fetchComments(currentPage + 1, true);
        }
    }, [currentPage, fetchComments, hasMore, loadingMore, loading]);

    useEffect(() => {
        const currentRef = containerRef.current;
        if (!currentRef) return;

        currentRef.addEventListener('scroll', handleScroll);

        return () => {
            currentRef.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    // Tải lại bình luận khi thay đổi sort hoặc courseId
    useEffect(() => {
        if (courseId) {
            if (!globalExpand) {
                // Bình thường, tải theo phân trang
                fetchComments(1, false);
            } else {
                // Nếu đang globalExpand, load toàn bộ bình luận luôn (bỏ phân trang)
                fetchComments(1, false, 9999);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courseId, sortBy, ascending, globalExpand]);

    const handleDeleteComment = (commentID) => {
        setComments(prevComments =>
            prevComments
                .filter(c => c.commentID !== commentID)
                .map(c => ({
                    ...c,
                    replies: c.replies ? c.replies.filter(r => r.commentID !== commentID) : [],
                }))
        );
    };

    const handleAddComment = async () => {
        if (newComment.trim() === '') return;
        if (!isAuthenticated) {
            alert('Bạn cần đăng nhập để bình luận');
            return;
        }

        try {
            const payload = {
                content: newComment.trim(),
                courseID: courseId,
                parentCommentID: null,
            };

            const token = coder?.token || localStorage.getItem('token');

            const res = await api.post('/comments', payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Thêm comment mới lên đầu danh sách
            setComments(prev => [{ ...res.data, replies: [] }, ...prev]);
            setNewComment('');
        } catch (err) {
            console.error('Add comment error', err);
            alert('Lỗi khi gửi bình luận');
        }
    };

    const handleAddReply = (parentID, reply) => {
        setComments(prev =>
            prev.map(c =>
                c.commentID === parentID
                    ? { ...c, replies: [...(c.replies || []), reply] }
                    : c
            )
        );
    };

    // Bật/tắt xem tất cả trả lời
    const toggleGlobalExpand = () => {
        setGlobalExpand(prev => !prev);
    };

    if (loading) return <Text textAlign="center">Đang tải bình luận...</Text>;

    return (
        <Box w="100%" maxW="700px" mx="auto" px={4} py={2}>
            {!isAuthenticated && (
                <Text color="red" fontStyle="italic">
                    **Đăng nhập để có thể bình luận
                </Text>
            )}
            <Flex justify="space-between" align="center" mb={4} flexWrap="wrap" gap={2}>
                <Text fontSize="lg" fontWeight="bold">Bình luận</Text>
                <HStack spacing={2}>
                    <Button
                        colorScheme='navy'
                        px={4}
                        py={2}
                        onClick={toggleGlobalExpand}
                        maxW="150px"
                        whiteSpace="normal"
                    >
                        <Text fontSize="12px" textAlign="center">
                            {globalExpand ? "Thu gọn tất cả trả lời" : "Xem tất cả trả lời"}
                        </Text>
                    </Button>
                    <Select
                        ms={4}
                        size="sm"
                        value={ascending ? 'asc' : 'desc'}
                        onChange={(e) => setAscending(e.target.value === 'asc')}
                        borderRadius="md"
                    >
                        <option value="desc">Mới nhất trước</option>
                        <option value="asc">Cũ nhất trước</option>
                    </Select>
                </HStack>
            </Flex>

            {/* Phần danh sách bình luận có scroll */}
            <Box
                height="400px"
                overflowY="auto"
                borderColor="gray.200"
                borderRadius="md"
                bg="white"
                ref={containerRef}
                px={4}
                py={2}
            >
                <VStack spacing={4} align="stretch">
                    {comments.map(comment => (
                        <CommentItem
                            key={comment.commentID}
                            comment={comment}
                            onReply={handleAddReply}
                            onDelete={handleDeleteComment}
                            globalExpand={globalExpand}
                        />
                    ))}

                    {loadingMore && (
                        <VStack spacing={3} mt={3}>
                            <Skeleton height="20px" width="100%" />
                            <Skeleton height="20px" width="90%" />
                            <Skeleton height="20px" width="95%" />
                        </VStack>
                    )}
                </VStack>
            </Box>
            {/* Input thêm bình luận */}
            {isAuthenticated && (
                <HStack mt={3}>
                    <Avatar size="sm" name={coder?.name || 'Bạn'} src={coder?.avatar || 'https://bit.ly/prosper-baba'} />
                    <Input
                        placeholder="Viết bình luận..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                        bg="white"
                    />
                    <Button rightIcon={<GrSend />} colorScheme="green" onClick={handleAddComment}>Gửi</Button>
                </HStack>
            )}

        </Box>
    );
};

export default CommentSection;
