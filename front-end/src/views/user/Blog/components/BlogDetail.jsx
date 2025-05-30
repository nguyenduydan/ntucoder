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
    Container, Image,
    Badge
} from '@chakra-ui/react';
import api from '@/config/apiConfig';
import sanitizeHtml from '@/utils/sanitizedHTML';
import { formatDateTime, toSlug, formatViewCount, LimitText, formatNumber } from '@/utils/utils';
import { useTitle } from '@/contexts/TitleContext';
import { FaArrowLeft } from 'react-icons/fa';
import CoderAvatar from '@/views/user/Course/components/CoderAvatar';
import InfoBlog from './InfoBlog';

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
            const limitBlogs = allRes.data.data.filter(b => b.blogID !== blogId).slice(0, 10);// bỏ bài hiện tại ra
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
                variant: "top-accent",
                position: "top",
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
                    <Flex align="center" mb={4} justify="space-between" flexWrap="wrap" gap={4} alignItems="center">
                        <Heading mb={4}>{blog?.title || "Tiêu đề bài viết"}</Heading>
                        <Badge fontSize="md" colorScheme='blue' mb={4}>
                            {formatNumber(blog?.viewCount || "0")} lượt xem
                        </Badge>
                    </Flex>
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
                            <Flex justify="center" align="center">
                                <Image
                                    size="md"
                                    name={blog.title || blog.Title || 'Không có ảnh'}
                                    src={blog.imageBlogUrl || './avatarSimmmple.png'}
                                    w="70%"
                                    maxH="50vh"
                                    objectFit="cover"
                                    alt={blog.title || blog.Title || 'Không có ảnh'}
                                    borderRadius="md"
                                    loading="lazy"
                                    mb={4}
                                    fallbackSrc="./avatarSimmmple.png"
                                />
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
                                        <InfoBlog
                                            id={item.coderID || item.CoderID}
                                            coderName={item.coderName}
                                            date={item.blogDate}
                                            view={formatViewCount(item.viewCount || item.ViewCount)}
                                        />
                                    </Box>
                                ))
                            )}
                        </Stack>
                    </Box>
                </Box>
            </Flex>
        </Container>
    );
};

export default BlogDetail;
