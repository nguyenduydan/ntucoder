import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import {
    Box,
    Text,
    Divider,
    VStack,
    HStack,
    Spinner,
    IconButton,
    useToast,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    Button
} from '@chakra-ui/react';
import api from '@/config/apiConfig';
import { FaTrash } from 'react-icons/fa';
import { formatDateTime, LimitText } from '@/utils/utils';

const PAGE_SIZE = 10;

const ActionBox = ({ coderID }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const containerRef = useRef(null);
    const toast = useToast();

    // Xử lý xóa
    const [commentToDelete, setCommentToDelete] = useState(null);
    const cancelRef = useRef();

    const fetchComments = useCallback(async () => {
        if (!coderID || !hasMore) return;
        setLoading(true);
        try {
            const res = await api.get(`/Comments/by-coder?coderId=${coderID}&page=${page}&pageSize=${PAGE_SIZE}`);
            const newComments = res.data.data || [];
            setComments(prev => [...prev, ...newComments]);
            setHasMore(newComments.length === PAGE_SIZE);
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    }, [coderID, page, hasMore]);

    useEffect(() => {
        setComments([]);
        setPage(1);
        setHasMore(true);
    }, [coderID]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleScroll = () => {
        const el = containerRef.current;
        if (!el || loading || !hasMore) return;

        const threshold = 100;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - threshold) {
            setPage(prev => prev + 1);
        }
    };

    const handleDeleteClick = (comment) => {
        setCommentToDelete(comment);
    };

    const confirmDelete = async () => {
        if (!commentToDelete) return;

        try {
            await api.delete(`/comments/${commentToDelete.commentID}`);
            setComments(prev => prev.filter(c => c.commentID !== commentToDelete.commentID));
            toast({
                title: "Đã xóa bình luận",
                status: "success",
                duration: 1500,
                isClosable: true,
                position: "top",
                variant: "top-accent",

            });
        } catch (error) {
            console.error('Delete comment error', error);
            toast({
                title: "Không thể xóa bình luận",
                status: "error",
                duration: 1500,
                isClosable: true,
                position: "top",
            });
        } finally {
            setCommentToDelete(null);
        }
    };

    const renderedComments = useMemo(() => {
        if (comments.length === 0 && !loading) return <Text>Chưa có bình luận nào.</Text>;

        return (
            <VStack spacing={4} align="stretch">
                {comments.map((comment) => (
                    <Box
                        key={comment.commentID}
                        p={3}
                        borderWidth="1px"
                        borderRadius="md"
                        boxShadow="md"
                        position="relative"
                    >
                        <HStack spacing={3} mb={2} justifyContent="space-between">
                            <Text fontSize="xs" color="gray.500">
                                {formatDateTime(comment.commentTime)}
                            </Text>
                            <IconButton
                                aria-label="Xóa bình luận"
                                icon={<FaTrash />}
                                size="xs"
                                colorScheme="red"
                                onClick={() => handleDeleteClick(comment)}
                                position="absolute"
                                top={2}
                                right={2}
                            />
                        </HStack>
                        <Text>{LimitText(comment.content, 100)}</Text>
                    </Box>
                ))}
                {loading && <Spinner size="sm" alignSelf="center" />}
            </VStack>
        );
    }, [comments, loading]);

    return (
        <>
            <Box
                h="100%"
                bg="white"
                borderRadius="lg"
                shadow="md"
                display="flex"
                flexDirection="column"
                overflow="hidden"
                px={5}
                py={4}
            >
                <Box mb={2}>
                    <Text fontSize="xl" color="blue.600" fontWeight="bold">
                        Các bình luận
                    </Text>
                    <Divider mt={1} w="60px" h="3px" bg="blue" borderRadius="md" />
                </Box>

                <Box
                    ref={containerRef}
                    onScroll={handleScroll}
                    overflowY="auto"
                    flex={1}
                    pr={5}
                    py={3}
                >
                    {renderedComments}
                </Box>
            </Box>

            {/* Alert Confirm Delete */}
            <AlertDialog
                isOpen={!!commentToDelete}
                leastDestructiveRef={cancelRef}
                onClose={() => setCommentToDelete(null)}
                isCentered
                motionPreset="slideInBottom"
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Xóa bình luận
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Bạn chắc chắn muốn xóa bình luận này?
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={() => setCommentToDelete(null)}>
                                Hủy
                            </Button>
                            <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                                Xóa
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
};

export default ActionBox;
