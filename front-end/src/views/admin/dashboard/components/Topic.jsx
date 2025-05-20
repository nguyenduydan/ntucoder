import { Box, SimpleGrid, Text } from "@chakra-ui/react";

const Topics = ({ topics }) => (
    <Box mb={8} p={5} bg="white" shadow="md" borderRadius="md">
        <Text fontSize="xl" fontWeight="bold" mb={4}>
            Chủ đề
        </Text>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            {topics.map(({ id, name }) => (
                <Box
                    key={id}
                    p={4}
                    borderWidth="1px"
                    borderRadius="md"
                    _hover={{ shadow: "lg" }}
                >
                    <Text>{name}</Text>
                </Box>
            ))}
        </SimpleGrid>
    </Box>
);

export default Topics;
