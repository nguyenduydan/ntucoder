import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Flex,
    Text,
    useToast,
    Spinner,
    Container,
    Stack,
    useDisclosure,
    Heading,
    Image,
    Badge,
    Icon
} from '@chakra-ui/react';

import api from '@/config/apiConfig';
import { useAuth } from '@/contexts/AuthContext';
import sanitizeHtml from '@/utils/sanitizedHTML';
import CreateBlog from './components/CreateBlog';
import { NavLink, useNavigate } from 'react-router-dom';
import { toSlug, formatDateTime, formatDate, formatNumber } from '@/utils/utils';
import { useTitle } from '@/contexts/TitleContext';
import ListBlogs from './components/ListBlogs';
import AvatarLoadest from '@/components/fields/Avatar';
import ScrollToTop from '@/components/scroll/ScrollToTop';
import { FaRegEye } from 'react-icons/fa';
import InfoBlog from './components/InfoBlog';


const Blog = () => {
    useTitle('Bài viết');
    const navigate = useNavigate();
    const { coder, isAuthenticated } = useAuth();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const res = await api.get('/Blog');
            setBlogs(res.data.data);
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

    // 1. Sắp xếp theo lượt xem giảm dần
    const sortedByView = [...blogs]
        .filter(b => typeof (b.viewCount || b.ViewCount) === 'number')
        .sort((a, b) => (b.viewCount || b.ViewCount) - (a.viewCount || a.ViewCount));

    // 2. Lấy bài có lượt xem cao nhất
    const highestViewBlog = sortedByView[0] || null;

    // 3. Lấy 3 bài phổ biến tiếp theo (bỏ top 1)
    const popularBlogs = sortedByView.slice(1, 4);

    // 4. Lấy 7 bài ngẫu nhiên còn lại, loại trừ các bài đã chọn
    const usedIds = new Set([highestViewBlog?.blogID, ...popularBlogs.map(b => b.blogID)]);
    const remainingBlogs = blogs.filter(b => !usedIds.has(b.blogID));
    const shuffled = [...remainingBlogs].sort(() => 0.5 - Math.random());
    const olderBlogs = shuffled.slice(0, 7);

    const getPlainText = (html) => {
        const clean = sanitizeHtml(html);
        const div = document.createElement('div');
        div.innerHTML = clean;
        const text = div.textContent || div.innerText || '';
        return text.length > 300 ? text.slice(0, 300) + '...' : text;
    };

    return (
        <ScrollToTop>
            <Container maxW="8xl" py={8} minH="86vh">
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
                        flex="0.8"
                        bg="white"
                        p={6}
                        rounded="md"
                        shadow="md"
                        minW={{ base: '100%', md: '0' }}
                        mb={{ base: 6, md: 0 }}
                    >
                        <Text fontSize="2xl" fontWeight="bold" mb={4}>
                            Bài viết mới nhất
                        </Text>
                        {loading ? (
                            <Flex justify="center" align="center" height="80vh">
                                <Spinner />
                            </Flex>
                        ) : highestViewBlog ? (
                            <Box>
                                <Flex align="center" mb={5}>
                                    <AvatarLoadest
                                        size="md"
                                        name={highestViewBlog.coderName || highestViewBlog.CoderName || highestViewBlog.author || 'Người dùng'}
                                        src={highestViewBlog.avatarCoder || ''}
                                        mr={2}
                                    />

                                    <Box>
                                        <Text fontWeight="bold" fontSize="lg">
                                            {highestViewBlog.coderName || highestViewBlog.CoderName || highestViewBlog.author || 'Người dùng'}
                                        </Text>
                                        <Flex align="center" gap={3} mt={1}>
                                            <Text fontSize="sm" color="gray.500">
                                                {formatDateTime(highestViewBlog.blogDate || highestViewBlog.BlogDate)}
                                            </Text>
                                            <Badge colorScheme="blue" display="flex" alignItems="center" fontSize="0.75rem" px={2}>
                                                <Icon as={FaRegEye} mr={2} />
                                                {formatNumber(highestViewBlog.viewCount || highestViewBlog.ViewCount || 0)} lượt xem
                                            </Badge>
                                        </Flex>
                                    </Box>
                                </Flex>
                                <Box>
                                    <Image
                                        size="md"
                                        name={highestViewBlog.title || highestViewBlog.Title || 'Không có ảnh'}
                                        src={highestViewBlog.imageBlogUrl || './avatarSimmmple.png'}
                                        w="100%"
                                        maxH="340px"
                                        objectFit="cover"
                                        alt={highestViewBlog.title || highestViewBlog.Title || 'Không có ảnh'}
                                        fallbackSrc="./avatarSimmmple.png"
                                        fallback={true}
                                        borderRadius="md"
                                        mb={4}
                                    />
                                </Box>
                                <Flex direction="column">
                                    <NavLink to={`/blogs/${toSlug(highestViewBlog.title || highestViewBlog.Title)}-${highestViewBlog.blogID}`}>
                                        <Button variant="link" colorScheme='black' fontSize="xl" fontWeight="bold" mb={2}>
                                            {highestViewBlog.title || highestViewBlog.Title}
                                        </Button>
                                    </NavLink>
                                    <Text whiteSpace="pre-wrap" fontSize="md" mb={4} wordBreak="break-word">
                                        {getPlainText(highestViewBlog.content || highestViewBlog.Content)}
                                    </Text>
                                </Flex>

                            </Box>
                        ) : (
                            <Text>Chưa có bài viết nào.</Text>
                        )}
                    </Box>

                    {/* Bên phải - list blog nổi bật */}
                    <Box flex="1" maxHeight="max-content" display="flex" flexDirection="column">
                        <Heading size="md" mb={4} textTransform="uppercase">Các bài viết nổi bật</Heading>
                        <Box >
                            <Stack spacing={5}>
                                {loading ? (
                                    <Flex justify="center" align="center" height="80vh">
                                        <Spinner />
                                    </Flex>
                                ) : popularBlogs.length === 0 ? (
                                    <Text fontSize="sm" color="gray.600">
                                        Không có bài viết khác
                                    </Text>
                                ) : (
                                    popularBlogs.map(item => (
                                        <Flex
                                            key={item.blogID}
                                            p={3}
                                            borderRadius="md"
                                            bg="white"
                                            boxShadow="md"
                                        >
                                            <Box flex="0.6" mr={4}>
                                                <Image
                                                    size="md"
                                                    name={item.title || item.Title || 'Không có ảnh'}
                                                    src={item.imageBlogUrl || './avatarSimmmple.png'}
                                                    w="100%"
                                                    maxH="25vh"
                                                    objectFit="cover"
                                                    alt={item.title || item.Title || 'Không có ảnh'}
                                                    fallbackSrc="./avatarSimmmple.png"
                                                    fallback={true}
                                                    borderRadius="md"
                                                />
                                            </Box>
                                            <Box flex="1" mt={3}>
                                                <Button variant="link" colorScheme='black' onClick={() => navigate(`/blogs/${toSlug(item.title || item.Title)}-${item.blogID}`)}>
                                                    <Text fontWeight="bold" mb={1}>
                                                        {item.title}
                                                    </Text>
                                                </Button>
                                                <Text fontSize="sm" color="gray.600">
                                                    {sanitizeHtml(item.content).replace(/<[^>]*>/g, '').slice(0, 300)}...
                                                </Text>
                                                <InfoBlog
                                                    id={item.coderID || item.CoderID}
                                                    coderName={item.coderName || item.CoderName || item.author || 'Người dùng'}
                                                    date={item.blogDate || item.BlogDate}
                                                    view={item.viewCount || item.ViewCount || 0}
                                                />
                                            </Box>
                                        </Flex>
                                    ))
                                )}
                            </Stack>
                        </Box>
                    </Box>
                </Flex>
                {/* Dưới cùng: List blog còn lại */}
                <ListBlogs blogs={olderBlogs} loading={loading} />
            </Container>
        </ScrollToTop>
    );
};

export default Blog;
