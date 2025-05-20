import { Box, Table, Thead, Tbody, Tr, Th, Td, Text } from "@chakra-ui/react";

const CodersRanking = ({ coders }) => (
    <Box mb={8} p={5} bg="white" shadow="md" borderRadius="md">
        <Text fontSize="xl" fontWeight="bold" mb={4}>
            Top coder
        </Text>
        <Table variant="simple" size="md">
            <Thead>
                <Tr>
                    <Th>Rank</Th>
                    <Th>Tên</Th>
                    <Th>Điểm</Th>
                </Tr>
            </Thead>
            <Tbody>
                {coders.map(({ id, name, rank, points }) => (
                    <Tr key={id}>
                        <Td>{rank}</Td>
                        <Td>{name}</Td>
                        <Td>{points}</Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    </Box>
);

export default CodersRanking;
