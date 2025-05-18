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
import { toSlug, formatDateTime, formatNumber } from '@/utils/utils';
import { useTitle } from '@/contexts/TitleContext';
import ListBlogs from './components/ListBlogs';
import AvatarLoadest from '@/components/fields/Avatar';
import ScrollToTop from '@/components/scroll/ScrollToTop';
import { FaRegEye } from 'react-icons/fa';
import InfoBlog from './components/InfoBlog';
import Pagination from '@/components/pagination/pagination';

const Blog = () => {
    useTitle('Bài viết');
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const { coder, isAuthenticated } = useAuth();
    const [latestBlogs, setLatestBlogs] = useState([]);
    const [topViewedBlogs, setTopViewedBlogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    // Fetch latest blogs theo page và size
    const fetchLatestBlogs = async (page = 1, size = 10, excludedIds = []) => {
        try {
            const res = await api.get('/Blog/Latest', {
                params: {
                    page,
                    pageSize: size,
                    excludedIds: excludedIds.join(',') // gửi dạng chuỗi: "1,2,3"
                }
            });
            if (res.status === 200) {
                return res.data;
            }
        } catch (error) {
            throw error;
        }
    };


    // Fetch top viewed blogs cố định 4 bài
    const fetchTopViewedBlogs = async (count = 4) => {
        try {
            const res = await api.get(`/Blog/TopViewed?count=${count}`);
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    // Hàm fetch top viewed 1 lần duy nhất
    const loadTopViewedBlogs = async () => {
        try {
            const topViewed = await fetchTopViewedBlogs();
            setTopViewedBlogs(topViewed || []);
        } catch (err) {
            toast({
                title: 'Lỗi khi tải bài viết phổ biến',
                description: err.message || 'Không thể tải dữ liệu',
                status: 'error',
                duration: 3000,
                isClosable: true,
                variant: 'top-accent',
                position: 'top'
            });
        }
    };

    // Hàm fetch latestBlogs theo phân trang, loại bỏ các bài đã nằm trong topViewedBlogs
    const loadLatestBlogs = async (page, size) => {
        setLoading(true);
        try {
            // Lấy blogID từ topViewedBlogs để loại bỏ
            const excludedIds = topViewedBlogs.map(b => b.blogID);

            const latestRes = await fetchLatestBlogs(page, size, excludedIds);
            const latest = latestRes.data || [];

            setTotalPages(latestRes.totalPages);
            setTotalCount(latestRes.totalCount);
            setLatestBlogs(latest);
        } catch (err) {
            toast({
                title: 'Lỗi khi tải bài viết mới nhất',
                description: err.message || 'Không thể tải dữ liệu',
                status: 'error',
                duration: 3000,
                isClosable: true,
                variant: 'top-accent',
                position: 'top'
            });
        } finally {
            setLoading(false);
        }
    };


    // Khi page hoặc pageSize thay đổi, fetch lại latestBlogs
    useEffect(() => {
        if (topViewedBlogs.length === 0) {
            loadTopViewedBlogs();
        }
    }, []);

    useEffect(() => {
        if (topViewedBlogs.length > 0) {
            loadLatestBlogs(currentPage, pageSize);
        }
    }, [currentPage, pageSize, topViewedBlogs]);

    // Các hàm xử lý phân trang
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handlePageSizeChange = (size) => {
        setPageSize(size);
        setCurrentPage(1);
    };


    const getPlainText = (html) => {
        const clean = sanitizeHtml(html);
        const div = document.createElement('div');
        div.innerHTML = clean;
        const text = div.textContent || div.innerText || '';
        return text.length > 300 ? text.slice(0, 300) + '...' : text;
    };

    return (
        <ScrollToTop>
            <Box bg="gray.200">
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
                        onSuccess={fetchLatestBlogs}
                        authorName={coder?.coderName || 'Nguyễn Thiết Duy Đan'}
                        authorAvatar={coder?.avatar || 'https://i.pravatar.cc/150?img=10'}
                    />

                    {/* Main content: Left + Right */}
                    <Flex gap={8} mb={8} flexWrap={{ base: 'wrap', md: 'nowrap' }}>
                        {/* Bên trái - blog mới nhất */}
                        <Box
                            flex="0.8"
                            minW={{ base: '100%', md: '0' }}
                            mb={{ base: 6, md: 0 }}
                        >
                            <Heading size="md" fontWeight="bold" mb={4} textTransform="uppercase">
                                Bài viết mới nhất
                            </Heading>
                            <Box
                                bg="white"
                                p={6}
                                rounded="md"
                                shadow="md"
                            >
                                {loading ? (
                                    <Flex justify="center" align="center" height="70vh">
                                        <Spinner />
                                    </Flex>
                                ) : topViewedBlogs.length > 0 ? (
                                    <Box minH="74vh">
                                        <Flex align="center" mb={5}>
                                            <AvatarLoadest
                                                size="md"
                                                name={topViewedBlogs[0].coderName || topViewedBlogs[0].CoderName || topViewedBlogs[0].author || 'Người dùng'}
                                                src={topViewedBlogs[0].avatarCoder || ''}
                                                mr={2}
                                            />

                                            <Box>
                                                <Text fontWeight="bold" fontSize="lg">
                                                    {topViewedBlogs[0].coderName || topViewedBlogs[0].CoderName || topViewedBlogs[0].author || 'Người dùng'}
                                                </Text>
                                                <Flex align="center" gap={3} mt={1}>
                                                    <Text fontSize="sm" color="gray.500">
                                                        {formatDateTime(topViewedBlogs[0].blogDate || topViewedBlogs[0].BlogDate)}
                                                    </Text>
                                                    <Badge colorScheme="blue" display="flex" alignItems="center" fontSize="0.75rem" px={2}>
                                                        <Icon as={FaRegEye} mr={2} />
                                                        {formatNumber(topViewedBlogs[0].viewCount || topViewedBlogs[0].ViewCount || 0)} lượt xem
                                                    </Badge>
                                                </Flex>
                                            </Box>
                                        </Flex>

                                        <Box>
                                            <Image
                                                size="md"
                                                name={topViewedBlogs[0].title || topViewedBlogs[0].Title || 'Không có ảnh'}
                                                src={topViewedBlogs[0].imageBlogUrl || './avatarSimmmple.png'}
                                                w="100%"
                                                maxH="340px"
                                                objectFit="cover"
                                                alt={topViewedBlogs[0].title || topViewedBlogs[0].Title || 'Không có ảnh'}
                                                fallbackSrc="./avatarSimmmple.png"
                                                borderRadius="md"
                                                mb={4}
                                            />
                                        </Box>

                                        <Flex direction="column">
                                            <NavLink to={`/blogs/${toSlug(topViewedBlogs[0].title || topViewedBlogs[0].Title)}-${topViewedBlogs[0].blogID}`}>
                                                <Button variant="link" colorScheme="black" fontSize="xl" fontWeight="bold" mb={2}>
                                                    {topViewedBlogs[0].title || topViewedBlogs[0].Title}
                                                </Button>
                                            </NavLink>
                                            <Text whiteSpace="pre-wrap" fontSize="md" mb={4} wordBreak="break-word">
                                                {getPlainText(topViewedBlogs[0].content || topViewedBlogs[0].Content)}
                                            </Text>
                                        </Flex>
                                    </Box>
                                ) : (
                                    <Box minH="70vh" display="flex" justifyContent="center" alignItems="center">
                                        <Text>Chưa có bài viết nào.</Text>
                                    </Box>
                                )}
                            </Box>
                        </Box>

                        {/* Bên phải - list blog nổi bật */}
                        <Box flex="1" maxHeight="max-content" display="flex" flexDirection="column">
                            <Heading size="md" mb={4} textTransform="uppercase">Các bài viết nổi bật</Heading>
                            <Box >
                                <Stack spacing={5}>
                                    {loading ? (
                                        <Flex justify="center" align="center" height="76vh" bg="white">
                                            <Spinner />
                                        </Flex>
                                    ) : topViewedBlogs.slice(1).length === 0 ? (
                                        <Box minH="76vh" bg="white" display="flex" rounded="md" boxShadow="md" justifyContent="center" alignItems="center" >
                                            <Text>Chưa có bài viết nào.</Text>
                                        </Box>

                                    ) : (
                                        topViewedBlogs.slice(1).map(item => (
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
                                                        maxH="22vh"
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
                    <ListBlogs blogs={latestBlogs} loading={loading} />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalRows={totalCount}
                        onPageChange={handlePageChange}
                        pageSize={pageSize}
                        onPageSizeChange={handlePageSizeChange}
                    />
                </Container>
            </Box>
        </ScrollToTop>
    );
};

export default Blog;
