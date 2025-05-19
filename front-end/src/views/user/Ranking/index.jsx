import api from '@/config/apiConfig';
import {
    Box,
    Heading,
    Flex,
    Container,
    useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import CoderRankingTable from './component/CoderRankingTable';
import Pagination from "@/components/pagination/pagination";
import useDebounce from '@/hooks/useDebounce';
import SearchInput from '@/components/fields/searchInput';
import { useTitle } from '@/contexts/TitleContext';
import TopCoderCard from './component/TopCoderCard';

const CoderBoard = () => {
    useTitle('Ranking');
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [codersHighest, setCoderHighest] = useState([]);
    const [coders, setCoders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [searchText, setSearchText] = useState("");
    const debouncedSearchText = useDebounce(searchText, 500);

    const fetchTop3 = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/Coder/top-hightest');
            if (res.status === 200) {
                setCoderHighest(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch top 3 coders:', error);
            toast({
                title: 'Failed to fetch data',
                description: error.message,
                status: 'error',
                duration: 2000,
                isClosable: true,
                variant: 'top-accent',
                position: 'top'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const fetchListCoder = async (page = 1, size = 10, keyword = "") => {
        setSearchLoading(true);
        try {
            const res = await api.get('/Coder/list-ranking', {
                params: {
                    page,
                    pageSize: size,
                    q: keyword,
                },
            });
            if (res.status === 200) {
                setCoders(res.data.data);
                setTotalPages(res.data.totalPages);
                setTotalCount(res.data.totalCount);
            }
        } catch (error) {
            console.error('Failed to fetch top 3 coders:', error);
            toast({
                title: 'Failed to fetch data',
                description: error.message,
                status: 'error',
                duration: 2000,
                isClosable: true,
                variant: 'top-accent',
                position: 'top'
            });
        } finally {
            setSearchLoading(false);
        }
    };

    useEffect(() => {
        fetchTop3();
    }, []);

    useEffect(() => {
        fetchListCoder(currentPage, pageSize, debouncedSearchText);
    }, [debouncedSearchText, currentPage, pageSize]);

    const [top1, top2, top3] = codersHighest;

    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchListCoder(page, pageSize);
    };

    const handlePageSizeChange = (size) => {
        setPageSize(size);
        setCurrentPage(1); // reset về trang đầu
        fetchListCoder(1, size);
    };

    return (
        <Container maxW="container.xl" minH="90vh" p={6} bg="gray.200">
            <Box bgGradient="linear(to-r, purple.500, blue.500)" p={4} borderRadius="md" mb={8} boxShadow="md">
                <Heading
                    mb={8}
                    textAlign="center"
                    fontSize="5xl"
                    fontWeight="extrabold"
                    letterSpacing="wide"
                    textTransform="uppercase"
                    color="green.500"
                    textShadow="2px 4px 3px rgb(22, 56, 9), 0 1px 20px #fff"
                >
                    Ranking
                </Heading>

                {/* Top 3 Coders */}
                <Flex justify="center" align="flex-end" gap={10}>
                    <TopCoderCard
                        coder={top2}
                        rank={2}
                        gradient="linear(to-br, green.800, green.500, green.300)"
                        isLoading={isLoading}
                    />
                    <TopCoderCard
                        coder={top1}
                        rank={1}
                        gradient="linear(to-br, yellow.800, yellow.500, yellow.300)"
                        crown
                        size="2xl"
                        isLoading={isLoading}
                    />
                    <TopCoderCard
                        coder={top3}
                        rank={3}
                        gradient="linear(to-br, blue.800, blue.500, blue.300)"
                        isLoading={isLoading}
                    />
                </Flex>
            </Box>
            {/* Listranking */}
            <Box bg="white" p={4} borderRadius="md" shadow="md" mb={8} minH="50vh">
                <Flex justify="flex-start" mb={8}>
                    <SearchInput
                        type="text"
                        placeholder="Tìm người dùng..."
                        value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                            setCurrentPage(1);
                        }}
                        borderRadius="full"
                        boxShadow="md"
                        borderWidth="1px"
                        w="300px"
                    />
                </Flex>
                <CoderRankingTable coders={coders} loading={searchLoading} />
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalRows={totalCount}
                    onPageChange={handlePageChange}
                    pageSize={pageSize}
                    onPageSizeChange={handlePageSizeChange}
                />

            </Box>


        </Container>
    );
};

export default CoderBoard;
