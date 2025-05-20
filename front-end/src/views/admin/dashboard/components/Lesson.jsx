import { Box, SimpleGrid, Text } from "@chakra-ui/react";

const Lessons = ({ lessons }) => (
    <Box mb={8} p={5} bg="white" shadow="md" borderRadius="md">
        <Text fontSize="xl" fontWeight="bold" mb={4}>
            Bài học
        </Text>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            {lessons.map(({ id, title }) => (
                <Box
                    key={id}
                    p={4}
                    borderWidth="1px"
                    borderRadius="md"
                    _hover={{ shadow: "lg" }}
                >
                    <Text>{title}</Text>
                </Box>
            ))}
        </SimpleGrid>
    </Box>
);

export default Lessons;
