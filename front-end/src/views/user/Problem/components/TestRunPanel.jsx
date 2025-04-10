import { Box, Text, VStack } from "@chakra-ui/react";

const testResults = [
    {
        input: "0",
        actualOutput: '"Hello C++"',
        expectedOutput: '"Hello C++"',
        timeLimit: "500 ms",
        execTime: "20 ms",
    },
];

const TestResultPanel = ({ hasRun }) => {
    return (
        <Box maxH="25vh" bg="gray.900" color="white" px={4} py={3} overflowY="auto">
            <Text fontWeight="bold" fontSize="lg" mb={2}>KIỂM THỬ</Text>

            {!hasRun ? (
                <Text color="gray.400" border="1px solid" borderColor="gray.600" px={3} py={2} borderRadius="md">
                    Vui lòng chạy thử code của bạn trước!
                </Text>
            ) : (
                <VStack align="start" spacing={4}>
                    {testResults.map((test, index) => (
                        <Box key={index} w="full" bg="gray.700" p={4} borderRadius="md">
                            <Text fontWeight="semibold" mb={2}>Kiểm thử {index + 1}</Text>
                            <Box ml={4}>
                                <Text><strong>Đầu vào:</strong> {test.input}</Text>
                                <Text><strong>Đầu ra thực tế:</strong> {test.actualOutput}</Text>
                                <Text><strong>Đầu ra mong đợi:</strong> {test.expectedOutput}</Text>
                                <Text><strong>Giới hạn thời gian:</strong> {test.timeLimit}</Text>
                                <Text><strong>Thời gian thực thi:</strong> {test.execTime}</Text>
                            </Box>
                        </Box>
                    ))}
                </VStack>
            )}
        </Box>
    );
};

export default TestResultPanel;
