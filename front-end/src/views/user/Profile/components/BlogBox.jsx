import { Box, Divider, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Bloglist from "@/views/user/Blog/components/ListBlogs";
import Pagination from '@/components/pagination/pagination';
import { getList } from '@/config/apiService';

const BlogBox = ({ coderID }) => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    const fetchBlogs = async (page = 1, size = 10) => {
        setLoading(true);
        try {
            const res = await getList({
                controller: "Blog",
                page,
                pageSize: size,
                params: { coderID: coderID },
            });

            setBlogs(res.data || []); // ✅ res.data là mảng các blogs
            setTotalCount(res.totalCount || 0);
            setTotalPages(res.totalPages || 1);
        } catch (error) {
            console.error("❌ Error fetching blogs:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchBlogs(currentPage, pageSize);
    }, [currentPage, pageSize]);

    // Xử lý phân trang
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handlePageSizeChange = (size) => {
        setPageSize(size);
        setCurrentPage(1);
    };

    return (
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
            <Text fontSize="xl" color="blue.600" fontWeight="bold" mb={3}>
                Các bài viết đã đăng
                <Divider mt={1} w="60px" h="3px" bg="blue" borderRadius="md" />
            </Text>

            <Box h="55vh" overflowY="auto">
                <Bloglist blogs={blogs} loading={loading} limitContent={100} limitTitle={30} limitCoderName={10} limitNumber={5} />
            </Box>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalRows={totalCount}
                onPageChange={handlePageChange}
                pageSize={pageSize}
                onPageSizeChange={handlePageSizeChange}
            />
        </Box>
    );
};

export default BlogBox;
