import {
    Box,
    Text,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Flex
} from "@chakra-ui/react";
import { getDetail, getTestCase } from "config/apiService";
import React, { useState, useEffect } from "react";

const testResults = [
    {
        input: '""',
        actualOutput: '" "',
        expectedOutput: '" "',
        timeLimit: '" "',
        execTime: '" "',
    },
];

const TestResultPanel = ({ hasRun, id }) => {
    const [testCases, setTestCases] = useState([]);
    const [limitTime, setLimitTime] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const limitRes = await getDetail({ controller: "Problem", id: id });
                const testcaseRes = await getTestCase({
                    controller: "TestCase",
                    problemid: id,
                });
                if (testcaseRes || limitRes) {
                    setLimitTime(limitRes.timeLimit || null);
                    setTestCases(testcaseRes.data || []);
                }

            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu test case:", error);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    return (
        <Box maxH="25vh" bg="gray.900" color="white" px={4} py={3} overflowY="auto">
            {!hasRun && testResults.length > 1 && (
                <Text
                    color="gray.400"
                    border="1px solid"
                    borderColor="gray.600"
                    px={3}
                    py={2}
                    borderRadius="md"
                >
                    Vui lòng chạy thử code để xem kết quả đầy đủ!
                </Text>
            )}

            <Tabs isLazy variant="enclosed" colorScheme="cyan" mt={3}>
                <TabList>
                    {testResults.map((_, index) => (
                        <Tab key={index}>Testcase {index + 1}</Tab>
                    ))}
                </TabList>

                <TabPanels>
                    {testResults.map((test, index) => {
                        if (!hasRun && index > 0) {
                            return (
                                <TabPanel key={index}>
                                    <Text color="gray.400">
                                        Bạn cần chạy thử để xem testcase này.
                                    </Text>
                                </TabPanel>
                            );
                        }

                        const testcase = testCases[index];

                        return (
                            <TabPanel key={index}>
                                <Box bg="gray.700" p={4} borderRadius="md" fontSize="14px">
                                    <Flex justify="start" >
                                        <Text fontWeight="bold" mr={5}>Đầu vào:</Text>
                                        <Text>{testcase?.input || test.input}</Text>
                                    </Flex>
                                    <Flex justify="start" >
                                        <Text fontWeight="bold" mr={5}>Đầu ra thực tế:</Text>
                                        <Text>{test.actualOutput || ""}</Text>
                                    </Flex>
                                    <Flex justify="start" >
                                        <Text fontWeight="bold" mr={5}>Đầu ra mong đợi:</Text>
                                        <Text>{testcase?.output || test.expectedOutput}</Text>
                                    </Flex>
                                    <Flex justify="start" >
                                        <Text fontWeight="bold" mr={5}>Giới hạn thời gian:</Text>
                                        <Text>{limitTime || test.timeLimit}</Text>
                                    </Flex>
                                    <Flex justify="start" >
                                        <Text fontWeight="bold" mr={5}>Thời gian thực thi:</Text>
                                        <Text>{test.execTime || ""}</Text>
                                    </Flex>
                                </Box>
                            </TabPanel>
                        );
                    })}
                </TabPanels>
            </Tabs>
        </Box>
    );
};

export default TestResultPanel;
