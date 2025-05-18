import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Flex,
    Text,
    Spinner,
    Stack,
    Heading,
    useToast,
    Button,
    Container,
} from '@chakra-ui/react';
import api from '@/config/apiConfig';
import sanitizeHtml from '@/utils/sanitizedHTML';
import { formatDateTime, formatDate, toSlug } from '@/utils/utils';
import { useTitle } from '@/contexts/TitleContext';
import { FaArrowLeft } from 'react-icons/fa';
import CoderAvatar from '@/views/user/Course/components/CoderAvatar';
import ScrollToTop from '@/components/scroll/ScrollToTop';

const BlogDetail = () => {
    const { slugId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const parts = slugId ? slugId.split("-") : [];
    const blogId = parts.length > 0 ? parseInt(parts.pop(), 10) : NaN;

    const [blog, setBlog] = useState(null);
    const [allBlogs, setAllBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        if (isNaN(blogId)) {
            toast({
                title: "Lỗi",
                description: "ID không hợp lệ!",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            navigate("/blog");
            return;
        }

        setLoading(true);
        try {
            // Lấy chi tiết blog
            const blogRes = await api.get(`/Blog/${blogId}`);
            setBlog(blogRes.data);

            // Lấy danh sách tất cả blog (hoặc bạn có thể phân trang tùy ý)
            const allRes = await api.get(`/Blog`);
            const limitBlogs = allRes.data.filter(b => b.blogID !== blogId).slice(0, 10);// bỏ bài hiện tại ra
            setAllBlogs(limitBlogs);

            //Tăng view
            await api.post(`/Blog/${blogId}/view`);

        } catch (err) {
            toast({
                title: "Lỗi khi tải blog",
                description: err.message || "Không thể tải dữ liệu",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    }, [blogId, navigate, toast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useTitle(blog?.title || '');

    return (
        <ScrollToTop>
            <Container maxW="8xl" mx="auto" minH="85vh" mt={8}>
                <Button
                    leftIcon={<FaArrowLeft />}
                    mb={2}
                    mt={3}
                    colorScheme='blue' variant='ghost'
                    onClick={() => navigate(-1)}
                >
                    Trở về trước
                </Button>

                <Flex maxW="200vh" gap={8} px={4} mb={8}>
                    {/* Nội dung blog */}
                    <Box flex="2" bg="white" p={6} borderRadius="md" boxShadow="md">
                        <Heading mb={4}>{blog?.title || "Tiêu đề bài viết"}</Heading>

                        {loading ? (
                            <Flex justify="center" align="center" height="80vh">
                                <Spinner />
                            </Flex>
                        ) : !blog ? (
                            <Text>Không tìm thấy bài viết</Text>
                        ) : (
                            <>
                                <Flex align="center" mb={5}>
                                    <CoderAvatar coderID={blog.coderID || blog.CoderID} size="sm" mr={3} />
                                    <Box>
                                        <Text fontWeight="bold" fontSize="lg">
                                            {blog.coderName || blog.CoderName || blog.author || 'Người dùng'}
                                        </Text>
                                        <Text fontSize="sm" color="gray.500">
                                            {formatDateTime(blog.blogDate || blog.BlogDate)}
                                        </Text>
                                    </Box>
                                </Flex>
                                <Box
                                    px={5}
                                    sx={{ wordBreak: "break-word" }}
                                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(blog.content) }}
                                />
                            </>
                        )}
                    </Box>

                    {/* Sidebar: danh sách blog khác */}
                    <Box flex="0.8" bg="gray.50" p={6} borderRadius="md" boxShadow="sm" maxHeight="80vh" display="flex" flexDirection="column">
                        <Flex
                            align="center"
                            justify="space-between"
                            mb={4}
                            py={2}
                        >
                            <Heading size="md">Bài viết khác</Heading>
                            <Button colorScheme="blue" variant="link" size="sm" onClick={() => navigate("/blogs")}>
                                Xem tất cả
                            </Button>
                        </Flex>

                        <Box overflowY="auto">
                            <Stack spacing={4}>
                                {loading ? (
                                    <Flex justify="center" align="center" height="80vh">
                                        <Spinner />
                                    </Flex>
                                ) : allBlogs.length === 0 ? (
                                    <Text fontSize="sm" color="gray.600">
                                        Không có bài viết khác
                                    </Text>
                                ) : (
                                    allBlogs.map(item => (
                                        <Box
                                            key={item.blogID}
                                            p={3}
                                            borderRadius="md"
                                            bg="white"
                                            boxShadow="sm"
                                            cursor="pointer"
                                            _hover={{ bg: "blue.50" }}
                                            onClick={() => navigate(`/blogs/${toSlug(item.title)}-${item.blogID}`)}
                                        >
                                            <Text fontWeight="bold" mb={1}>
                                                {item.title}
                                            </Text>
                                            <Text fontSize="sm" color="gray.600">
                                                {sanitizeHtml(item.content).replace(/<[^>]*>/g, '').slice(0, 100)}...
                                            </Text>
                                            <Text fontSize="xs" color="gray.500" mt={2}>
                                                {formatDate(item.blogDate)}
                                            </Text>
                                        </Box>
                                    ))
                                )}
                            </Stack>
                        </Box>
                    </Box>
                </Flex>
            </Container>
        </ScrollToTop>
    );
};

export default BlogDetail;
