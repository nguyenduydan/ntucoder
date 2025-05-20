import { Box, SimpleGrid, Text } from "@chakra-ui/react";

const Courses = ({ courses }) => (
    <Box mb={8} p={5} bg="white" shadow="md" borderRadius="md">
        <Text fontSize="xl" fontWeight="bold" mb={4}>
            Khóa học
        </Text>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            {courses.map(({ id, title, enrolls }) => (
                <Box
                    key={id}
                    p={4}
                    borderWidth="1px"
                    borderRadius="md"
                    _hover={{ shadow: "lg" }}
                >
                    <Text fontWeight="bold">{title}</Text>
                    <Text fontSize="sm" color="gray.600">
                        Đăng ký: {enrolls}
                    </Text>
                </Box>
            ))}
        </SimpleGrid>
    </Box>
);

export default Courses;
