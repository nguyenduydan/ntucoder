import { Box, SimpleGrid, Text } from "@chakra-ui/react";

const Problems = ({ problems }) => (
    <Box mb={8} p={5} bg="white" shadow="md" borderRadius="md">
        <Text fontSize="xl" fontWeight="bold" mb={4}>
            Bài tập
        </Text>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            {problems.map(({ id, title, difficulty }) => (
                <Box
                    key={id}
                    p={4}
                    borderWidth="1px"
                    borderRadius="md"
                    _hover={{ shadow: "lg" }}
                >
                    <Text fontWeight="bold">{title}</Text>
                    <Text fontSize="sm" color="gray.600">
                        Độ khó: {difficulty}
                    </Text>
                </Box>
            ))}
        </SimpleGrid>
    </Box>
);

export default Problems;
