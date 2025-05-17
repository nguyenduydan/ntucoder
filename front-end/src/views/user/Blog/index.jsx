import React, { useState, useEffect } from 'react';
import {
    Box,
    Avatar,
    Button,
    Flex,
    Text,
    Image,
    useToast,
    Spinner,
    Container,
    Stack,
    useDisclosure,
    Center,
} from '@chakra-ui/react';

import api from '@/config/apiConfig';
import { useAuth } from '@/contexts/AuthContext';
import sanitizeHtml from '@/utils/sanitizedHTML';
import CreateBlog from './components/CreateBlog';
import AvatarLoadest from '@/components/fields/Avatar';
import { NavLink } from 'react-router-dom';
import { toSlug, formatDateTime, formatDate } from '@/utils/utils';
import { useTitle } from '@/contexts/TitleContext';


const Blog = () => {
    useTitle('Bài viết');
    const { coder, isAuthenticated } = useAuth();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    // Modal controls
    const { isOpen, onOpen, onClose } = useDisclosure();

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const res = await api.get('/Blog');
            setBlogs(res.data);
        } catch (err) {
            toast({
                title: 'Lỗi khi tải blog',
                description: err.message || 'Không thể tải dữ liệu',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    // ... rest of your blog data logic (latestBlog, newestBlogs, olderBlogs)

    const latestBlog = blogs.length > 0 ? blogs[0] : null;
    const newestBlogs = blogs.slice(0, 6);
    const olderBlogs = blogs.slice(6);

    const getPlainText = (html) => {
        const clean = sanitizeHtml(html);
        const div = document.createElement('div');
        div.innerHTML = clean;
        const text = div.textContent || div.innerText || '';
        return text.length > 600 ? text.slice(0, 600) + '...' : text;
    };

    return (
        <Container maxW="container.xl" py={8} minH="86vh">
            {/* Nút mở modal */}
            {isAuthenticated && (
                <Flex align="center" justify="end" mb={4}>
                    <Button colorScheme="blue" onClick={onOpen}>
                        Đăng bài mới
                    </Button>
                </Flex>
            )}
            {/* Modal đăng bài */}
            <CreateBlog
                isOpen={isOpen}
                onClose={onClose}
                onSuccess={fetchBlogs}
                authorName={coder?.coderName || 'Nguyễn Thiết Duy Đan'}
                authorAvatar={coder?.avatar || 'https://i.pravatar.cc/150?img=10'}
            />

            {/* Main content: Left + Right */}
            <Flex gap={8} mb={8} flexWrap={{ base: 'wrap', md: 'nowrap' }}>
                {/* Bên trái - blog mới nhất */}
                <Box
                    flex="2"
                    bg="white"
                    p={6}
                    rounded="md"
                    shadow="md"
                    minW={{ base: '100%', md: '0' }}
                    mb={{ base: 6, md: 0 }}
                    maxH="600px"
                    overflowY="auto"
                >
                    <Text fontSize="2xl" fontWeight="bold" mb={4}>
                        Bài viết mới nhất
                    </Text>
                    {loading ? (
                        <Center>
                            <Spinner />
                        </Center>
                    ) : latestBlog ? (
                        <Box>
                            <Flex align="center" mb={5}>
                                <AvatarLoadest src={latestBlog.avatar || latestBlog.Avatar} size="md" mr={4} />
                                <Box>
                                    <Text fontWeight="bold" fontSize="lg">
                                        {latestBlog.coderName || latestBlog.CoderName || latestBlog.author || 'Người dùng'}
                                    </Text>
                                    <Text fontSize="sm" color="gray.500">
                                        {formatDateTime(latestBlog.blogDate || latestBlog.BlogDate)}
                                    </Text>
                                </Box>
                            </Flex>
                            <Flex direction="column">
                                <NavLink to={`/blogs/${toSlug(latestBlog.title || latestBlog.Title)}-${latestBlog.blogID}`}>
                                    <Button variant="link" colorScheme='black' fontSize="xl" fontWeight="bold" mb={2}>
                                        {latestBlog.title || latestBlog.Title}
                                    </Button>
                                </NavLink>
                                <Text whiteSpace="pre-wrap" fontSize="md" mb={4} wordBreak="break-word">
                                    {getPlainText(latestBlog.content || latestBlog.Content)}
                                </Text>
                            </Flex>

                        </Box>
                    ) : (
                        <Text>Chưa có bài viết nào.</Text>
                    )}
                </Box>

                {/* Bên phải - list blog mới nhất nhỏ */}
                <Box
                    flex="1"
                    bg="white"
                    p={4}
                    rounded="md"
                    shadow="md"
                    minW={{ base: '100%', md: '300px' }}
                    maxH="600px"
                    overflowY="auto"
                >
                    <Text fontSize="xl" fontWeight="bold" mb={4} textAlign="center">
                        Các bài viết mới
                    </Text>
                    {loading ? (
                        <Center>
                            <Spinner />
                        </Center>
                    ) : newestBlogs.length === 0 ? (
                        <Text textAlign="center" color="gray.500">
                            Không có bài viết mới.
                        </Text>
                    ) : (
                        newestBlogs.map((blog) => (
                            <NavLink to={`/blogs/${toSlug(latestBlog.title || latestBlog.Title)}-${latestBlog.blogID}`}>
                                <Box key={blog.blogID || blog.BlogID} mb={4} borderBottom="1px" borderColor="gray.200" pb={3}>
                                    <Text fontWeight="semibold" noOfLines={1}>
                                        {blog.title || blog.Title || 'Tiêu đề không có'}
                                    </Text>
                                    <Text fontSize="sm" color="gray.500">
                                        {formatDate(blog.blogDate || blog.BlogDate)}
                                    </Text>
                                </Box>
                            </NavLink>
                        ))
                    )}
                </Box>
            </Flex>
            {/* Dưới cùng: List blog còn lại */}
            <Box bg="white" p={6} rounded="md" shadow="md">
                <Text fontSize="xl" fontWeight="bold" mb={4} textAlign="center">
                    Các bài viết trước đó
                </Text>
                {loading ? (
                    <Center>
                        <Spinner />
                    </Center>
                ) : olderBlogs.length === 0 ? (
                    <Text textAlign="center" color="gray.500">
                        Không có bài viết nào khác.
                    </Text>
                ) : (
                    <Stack spacing={6}>
                        {olderBlogs.map((blog) => (
                            <Box
                                key={blog.blogID || blog.BlogID}
                                p={4}
                                rounded="md"
                                shadow="sm"
                                borderWidth="1px"
                            >
                                <Flex align="center" mb={3}>
                                    <Avatar size="sm" mr={3} />
                                    <Box>
                                        <Text fontWeight="bold" fontSize="md" lineHeight="short">
                                            {blog.coderName || blog.CoderName || blog.author || 'Người dùng'}
                                        </Text>
                                        <Text fontSize="xs" color="gray.500">
                                            {new Date(blog.blogDate || blog.BlogDate).toLocaleDateString()}
                                        </Text>
                                    </Box>
                                </Flex>
                                <Text whiteSpace="pre-wrap" fontSize="md" mb={3}>
                                    {blog.content || blog.Content}
                                </Text>
                                {blog.image && (
                                    <Image
                                        src={blog.image}
                                        alt="Blog Image"
                                        rounded="md"
                                        maxH="200px"
                                        objectFit="cover"
                                    />
                                )}
                            </Box>
                        ))}
                    </Stack>
                )}
            </Box>
        </Container>
    );
};

export default Blog;
