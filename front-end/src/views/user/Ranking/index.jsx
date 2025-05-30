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

    const handlefetchAll = () => {
        fetchTop3();
        fetchListCoder(1, pageSize);
    };

    useEffect(() => {
        handlefetchAll();
    }, []);

    return (
        <Container
            maxW={["100vw", "container.md", "container.xl"]}
            minH="90vh"
            p={[6, 0]}
            bg="gray.200"
            overflowX="hidden" // tránh scroll ngang nếu có overflow
        >
            <Box
                bgGradient="linear(to-r, purple.500, blue.500)"
                p={[4, 6]}
                borderRadius="md"
                mb={8}
                boxShadow="md"
            >
                <Heading
                    mb={8}
                    textAlign="center"
                    fontSize={["3xl", "4xl", "5xl"]}  // responsive font size
                    fontWeight="extrabold"
                    letterSpacing="wide"
                    textTransform="uppercase"
                    color="green.500"
                    textShadow="2px 4px 3px rgb(22, 56, 9), 0 1px 20px #fff"
                >
                    Ranking
                </Heading>

                {/* Top 3 Coders */}
                <Flex
                    justify="center"
                    align="flex-end"
                    gap={[4, 6, 10]}
                    flexDirection={["column", "row"]} // stacked on mobile, row on bigger
                >
                    <TopCoderCard
                        coder={top2}
                        rank={2}
                        gradient="linear(to-br, green.800, green.500, green.300)"
                        isLoading={isLoading}
                        size={["md", "lg", "xl"]}
                    />
                    <TopCoderCard
                        coder={top1}
                        rank={1}
                        gradient="linear(to-br, yellow.800, yellow.500, yellow.300)"
                        crown
                        size={["lg", "2xl", "3xl"]}
                        isLoading={isLoading}
                        mt={[4, 0]} // margin top on mobile for spacing
                    />
                    <TopCoderCard
                        coder={top3}
                        rank={3}
                        gradient="linear(to-br, blue.800, blue.500, blue.300)"
                        isLoading={isLoading}
                        size={["md", "lg", "xl"]}
                    />
                </Flex>
            </Box>

            {/* List ranking */}
            <Box
                bg="white"
                p={[4, 6]}
                borderRadius="md"
                shadow="md"
                mb={8}
                minH="50vh"
            >
                <Flex
                    justify="flex-start"
                    mb={8}
                    flexDirection={["column", "row"]} // stack input on small screens
                    alignItems={["stretch", "center"]}
                    gap={[4, 0]}
                >
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
                        w={["100%", "300px"]}  // full width on mobile, fixed width on desktop
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
                    mt={4}
                />
            </Box>
        </Container>
    );
};

export default CoderBoard;
