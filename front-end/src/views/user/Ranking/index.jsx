import api from '@/config/apiConfig';
import {
    Box,
    Heading,
    VStack,
    Text,
    StackDivider,
    Badge,
    SimpleGrid,
    Flex,
    Container,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FaCrown } from 'react-icons/fa';
import CoderAvatar from '../Course/components/CoderAvatar';
import CoderRankingTable from './component/CoderRankingTable';
import Pagination from "@/components/pagination/pagination";
import useDebounce from '@/hooks/useDebounce';
import SearchInput from '@/components/fields/searchInput';
import { NavLink } from 'react-router-dom';
import { useTitle } from '@/contexts/TitleContext';

const CoderBoard = () => {
    useTitle('Ranking');
    const [isLoading, setIsLoading] = useState(false);
    const [codersHighest, setCoderHighest] = useState([]);
    const [coders, setCoders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [searchText, setSearchText] = useState("");
    const debouncedSearchText = useDebounce(searchText, 100);

    const fetchTop3 = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/Coder/top-hightest');
            if (res.status === 200) {
                setCoderHighest(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch top 3 coders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchListCoder = async (page = 1, size = 10, keyword = "") => {
        setIsLoading(true);
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
        } finally {
            setIsLoading(false);
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
                    {top2 && (
                        <VStack
                            bgGradient="linear(to-br, green.800, green.500, green.300)"
                            borderRadius="md"
                            p={4}
                            shadow="md"
                            width="300px"
                            _hover={{ shadow: 'lg', transform: 'scale(1.05)' }}
                            transition="all 0.3s ease"
                            position="relative"
                        >
                            <Badge colorScheme="yellow" position="absolute" top="2" right="2" fontSize="md" px={2} borderRadius="full">
                                #2
                            </Badge>
                            <NavLink to={`/profile/${top2.coderID}`}>
                                <Flex flexDirection="column" align="center" mb={2}>
                                    <CoderAvatar size="lg" name={top2.coderName} src={top2.avatar} mb={2} />
                                    <Text fontWeight="bold" fontSize="md">{top2.coderName}</Text>
                                </Flex>
                            </NavLink>
                            <Badge fontSize="sm" colorScheme="teal" fontWeight="semibold">{top2.totalPoint} điểm</Badge>
                        </VStack>
                    )}

                    {top1 && (
                        <VStack
                            bgGradient="linear(to-br, yellow.800, yellow.500, yellow.300)"
                            borderRadius="md"
                            p={6}
                            shadow="2xl"
                            width="400px"
                            position="relative"
                            transition="all 0.3s ease"
                            _hover={{
                                shadow: '4xl',
                                boxShadow: '0 0 20px 4px rgba(255, 223, 71, 0.9)',
                                transform: 'scale(1.07)',
                            }}
                        >
                            <Box position="absolute" top="-32px" color="yellow.400" fontSize="6xl">
                                <FaCrown />
                            </Box>
                            <Badge colorScheme="yellow" position="absolute" top="4" right="4" fontSize="lg" px={3} borderRadius="full">
                                #1
                            </Badge>
                            <NavLink to={`/profile/${top1.coderID}`}>
                                <Flex flexDirection="column" align="center" mb={2}>
                                    <CoderAvatar size="2xl" name={top1.coderName} src={top1.avatar} mb={2} />
                                    <Text fontWeight="bold" fontSize="xl">{top1.coderName}</Text>
                                </Flex>
                            </NavLink>
                            <Badge fontSize="lg" colorScheme="teal" fontWeight="semibold">{top1.totalPoint} điểm</Badge>
                        </VStack>
                    )}

                    {top3 && (
                        <VStack
                            bgGradient="linear(to-br, blue.800, blue.500, blue.300)"
                            borderRadius="md"
                            p={4}
                            shadow="md"
                            width="300px"
                            _hover={{ shadow: 'lg', transform: 'scale(1.05)' }}
                            transition="all 0.3s ease"
                            position="relative"
                        >
                            <Badge colorScheme="yellow" position="absolute" top="2" right="2" fontSize="md" px={2} borderRadius="full">
                                #3
                            </Badge>
                            <NavLink to={`/profile/${top3.coderID}`}>
                                <Flex flexDirection="column" align="center" mb={2}>
                                    <CoderAvatar size="lg" name={top3.coderName} src={top3.avatar} mb={2} />
                                    <Text fontWeight="bold" fontSize="md">{top3.coderName}</Text>
                                </Flex>
                            </NavLink>
                            <Badge fontSize="sm" colorScheme="teal" fontWeight="semibold">{top3.totalPoint} điểm</Badge>
                        </VStack>
                    )}
                </Flex>
            </Box>
            {/* Listranking */}
            <Box bg="white" p={4} borderRadius="md" shadow="md" mb={8}>
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
                    />
                </Flex>
                <CoderRankingTable coders={coders} loading={isLoading} />
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
