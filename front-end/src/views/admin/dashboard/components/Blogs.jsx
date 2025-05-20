import { Box, SimpleGrid, Text } from "@chakra-ui/react";

const Blogs = ({ blogs }) => (
    <Box mb={8} p={5} bg="white" shadow="md" borderRadius="md">
        <Text fontSize="xl" fontWeight="bold" mb={4}>
            Bài viết nổi bật
        </Text>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            {blogs.map(({ id, title, views }) => (
                <Box
                    key={id}
                    p={4}
                    borderWidth="1px"
                    borderRadius="md"
                    _hover={{ shadow: "lg" }}
                >
                    <Text fontWeight="bold">{title}</Text>
                    <Text fontSize="sm" color="gray.600">
                        Lượt xem: {views}
                    </Text>
                </Box>
            ))}
        </SimpleGrid>
    </Box>
);

export default Blogs;
