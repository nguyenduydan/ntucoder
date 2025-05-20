import { Box, VStack, Text, Divider } from "@chakra-ui/react";

const TopBlogViewers = ({ blogs }) => (
    <Box mb={8} p={5} bg="white" shadow="md" borderRadius="md">
        <Text fontSize="xl" fontWeight="bold" mb={4}>
            Top bài viết xem nhiều
        </Text>
        <VStack align="start" spacing={3}>
            {blogs.map(({ id, title, views }) => (
                <Box key={id} width="100%">
                    <Text fontWeight="bold">{title}</Text>
                    <Text fontSize="sm" color="gray.600">
                        Lượt xem: {views}
                    </Text>
                    <Divider my={2} />
                </Box>
            ))}
        </VStack>
    </Box>
);

export default TopBlogViewers;
