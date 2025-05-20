import { Box, VStack, Text, Divider } from "@chakra-ui/react";

const TopCourseEnrolls = ({ courses }) => (
    <Box mb={8} p={5} bg="white" shadow="md" borderRadius="md">
        <Text fontSize="xl" fontWeight="bold" mb={4}>
            Top khóa học đăng ký nhiều
        </Text>
        <VStack align="start" spacing={3}>
            {courses.map(({ id, title, enrolls }) => (
                <Box key={id} width="100%">
                    <Text fontWeight="bold">{title}</Text>
                    <Text fontSize="sm" color="gray.600">
                        Đăng ký: {enrolls}
                    </Text>
                    <Divider my={2} />
                </Box>
            ))}
        </VStack>
    </Box>
);

export default TopCourseEnrolls;
