import { Box, Code, Heading } from '@chakra-ui/react';
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
        <Box px={6} py={5} minH="50vh">
            <Heading fontSize="xl" fontWeight="bold" mb={4} textTransform="uppercase">
                Các bài viết đã đăng
            </Heading>
            <Box h="50vh" overflowY="auto">
                <Bloglist blogs={blogs} loading={loading} />
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
