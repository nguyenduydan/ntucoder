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
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

const CoderRankingTable = ({ coders }) => {
    return (
        <Box>
            <TableContainer maxH="360px" overflowY="auto">
                <Table variant="striped" size="sm" colorScheme='blue'>
                    <Thead bg="gray.100" position="sticky" top={0} zIndex={1}>
                        <Tr>
                            <Th w="20px" py={3} >#</Th>
                            <Th ps={5}>Tên người dùng</Th>
                            <Th ps={5}>Điểm</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {Array.isArray(coders) &&
                            coders.map((coder, idx) => (
                                <Tr key={coder.coderID}>
                                    <Td py={4} fontWeight="bold">{idx + 1}</Td>
                                    <Td py={4} display="flex" alignItems="center" gap={3}>
                                        <NavLink to={`/profile/${coder.coderID}`}>
                                            <Flex alignItems="center" _hover={{ color: "blue", transform: "scale(1.02)" }} transition={"all .2s ease-in-out"}>
                                                <Avatar name={coder.coderName} src={coder.avatar} size="sm" />
                                                <Text fontWeight="bold" ms={2}>{coder.coderName}</Text>
                                            </Flex>
                                        </NavLink>
                                    </Td>
                                    <Td py={4}>
                                        <Badge colorScheme="green">
                                            {coder.totalPoint} điểm
                                        </Badge>
                                    </Td>
                                </Tr>
                            ))}
                    </Tbody>
                </Table>
            </TableContainer>

        </Box>
    );
};

export default CoderRankingTable;
