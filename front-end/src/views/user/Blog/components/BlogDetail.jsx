import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Avatar,
    Flex,
    Text,
    Spinner,
    Stack,
    Heading,
    Divider,
    useToast,
} from '@chakra-ui/react';
import api from '@/config/apiConfig';
import sanitizeHtml from '@/utils/sanitizedHTML';
import { formatDateTime, toSlug } from '@/utils/utils';
import AvatarLoadest from '@/components/fields/Avatar';

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
            setAllBlogs(allRes.data.filter(b => b.blogID !== blogId)); // bỏ bài hiện tại ra

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

    if (loading) {
        return (
            <Flex justify="center" align="center" height="80vh">
                <Spinner size="xl" />
            </Flex>
        );
    }

    if (!blog) {
        return (
            <Flex justify="center" align="center" height="80vh">
                <Text>Không tìm thấy bài viết</Text>
            </Flex>
        );
    }

    return (
        <Flex maxW="200vh" mx="auto" mt={8} gap={8} px={4} mb={8}>

            {/* Nội dung blog */}
            <Box flex="2" bg="white" p={6} borderRadius="md" boxShadow="md">
                <Heading mb={4}>{blog.title}</Heading>
                <Flex align="center" mb={5}>
                    <AvatarLoadest src={blog.avatar || blog.Avatar} size="md" mr={4} />
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
            </Box>

            {/* Sidebar: danh sách blog khác */}
            <Box flex="0.8" bg="gray.50" p={6} borderRadius="md" boxShadow="sm" maxHeight="80vh" overflowY="auto">
                <Heading size="md" mb={4}>Bài viết khác</Heading>
                <Stack spacing={4}>
                    {allBlogs.length === 0 ? (
                        <Text fontSize="sm" color="gray.600">Không có bài viết khác</Text>
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
                                onClick={() => navigate(`/blog/${toSlug(item.title)}-${item.blogID}`)}
                            >
                                <Text fontWeight="bold" mb={1}>{item.title}</Text>
                                <Text fontSize="sm" color="gray.600">
                                    {sanitizeHtml(item.content).replace(/<[^>]*>/g, '').slice(0, 100)}...
                                </Text>
                            </Box>
                        ))
                    )}
                </Stack>
            </Box>
        </Flex>
    );
};

export default BlogDetail;
