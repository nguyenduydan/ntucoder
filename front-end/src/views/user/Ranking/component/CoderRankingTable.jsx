import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Avatar,
    Text,
    Badge,
    Box,
    Flex,
    Skeleton,
    SkeletonCircle,
    SkeletonText,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

const CoderRankingTable = ({ coders, loading, currentPage = 1, pageSize = 10 }) => {
    return (
        <Box minH="40vh">
            <TableContainer>
                <Table size="sm" colorScheme="blue">
                    <Thead bg="gray.100" position="sticky" top={0} zIndex={1}>
                        <Tr>
                            <Th w="20px" py={3}>#</Th>
                            <Th ps={5}>Tên người dùng</Th>
                            <Th ps={5}>Điểm</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, idx) => (
                                <Tr key={`skeleton-${idx}`}>
                                    <Td py={4}><Skeleton height="20px" /></Td>
                                    <Td py={4}>
                                        <Flex align="center" gap={3}>
                                            <SkeletonCircle size="8" />
                                            <SkeletonText noOfLines={1} width="120px" />
                                        </Flex>
                                    </Td>
                                    <Td py={4}><Skeleton height="20px" width="60px" /></Td>
                                </Tr>
                            ))
                        ) : Array.isArray(coders) && coders.length > 0 ? (
                            coders.map((coder, idx) => (
                                <Tr key={coder.coderID}>
                                    <Td py={4} fontWeight="bold">{(currentPage - 1) * pageSize + idx + 1}</Td>
                                    <Td py={4}>
                                        <NavLink to={`/profile/${coder.coderID}`}>
                                            <Flex
                                                alignItems="center"
                                                gap={3}
                                                _hover={{ color: "blue.600", transform: "scale(1.02)" }}
                                                transition="all .2s ease-in-out"
                                            >
                                                <Avatar name={coder.coderName || "Coder"} src={coder.avatar} size="sm" loading="lazy" />
                                                <Text fontWeight="bold">{coder.coderName}</Text>
                                            </Flex>
                                        </NavLink>
                                    </Td>
                                    <Td py={4}>
                                        <Badge colorScheme="green">{coder.totalPoint} điểm</Badge>
                                    </Td>
                                </Tr>
                            ))
                        ) : (
                            <Tr>
                                <Td colSpan={3} py={6} textAlign="center">
                                    <Text fontStyle="italic" color="gray.500" fontSize="md">
                                        Không có dữ liệu để hiển thị.
                                    </Text>
                                </Td>
                            </Tr>
                        )}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default CoderRankingTable;
