import {
    Box,
    Text,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Flex,
    Grid,
    GridItem,
} from "@chakra-ui/react";
import { getDetail, getTestCase } from "@/config/apiService";
import React, { useState, useEffect } from "react";

const TestResultPanel = ({ hasRun, id, errors, testCaseResult = [] }) => {
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
            {!hasRun && testCases.length === 0 && (
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

            <Tabs isLazy variant="enclosed" colorScheme="white" mt={3}>
                <TabList>
                    {testCases.map((_, index) => {
                        const result = testCaseResult[index];
                        if (index === 0 || (result && result.result !== "Accepted")) {
                            return <Tab key={index}>Testcase {index + 1}</Tab>;
                        }
                        return null;
                    })}
                </TabList>

                <TabPanels>
                    {testCases.length === 0 ? (
                        <TabPanel key={0}>
                            <Grid templateColumns="2fr 1fr" bg="gray.700" p={4} borderRadius="md" fontSize="14px">
                                <GridItem>
                                    <Flex justify="start">
                                        <Text fontWeight="bold" mr={5}>Đầu vào:</Text>
                                        <Text>""</Text>
                                    </Flex>
                                    <Flex justify="start">
                                        <Text fontWeight="bold" mr={5}>Đầu ra thực tế:</Text>
                                        <Text>""</Text>
                                    </Flex>
                                    <Flex justify="start">
                                        <Text fontWeight="bold" mr={5}>Đầu ra mong đợi:</Text>
                                        <Text>""</Text>
                                    </Flex>
                                    <Flex justify="start">
                                        <Text fontWeight="bold" mr={5}>Giới hạn thời gian:</Text>
                                        <Text>""</Text>
                                    </Flex>
                                    <Flex justify="start">
                                        <Text fontWeight="bold" mr={5}>Thời gian thực thi:</Text>
                                        <Text>""</Text>
                                    </Flex>
                                </GridItem>
                                <GridItem>
                                    <Text fontWeight="bold" mr={5}>Hiển thị lỗi</Text>
                                    <Text bg="black" minH="12vh" borderRadius="md" p={2}>
                                        {errors || "Không có lỗi"}
                                    </Text>
                                </GridItem>
                            </Grid>
                        </TabPanel>
                    ) : (
                        testCases.map((testcase, index) => {
                            const result = testCaseResult[index] || {};
                            return (
                                <TabPanel key={index}>
                                    <Grid templateColumns="2fr 1fr" bg="gray.700" p={4} borderRadius="md" fontSize="14px">
                                        <GridItem>
                                            <Flex justify="start">
                                                <Text fontWeight="bold" mr={5}>Đầu vào:</Text>
                                                <Text whiteSpace="pre-wrap">{testcase.input || '""'}</Text>
                                            </Flex>
                                            <Flex justify="start">
                                                <Text fontWeight="bold" mr={5}>Đầu ra thực tế:</Text>
                                                <Text whiteSpace="pre-wrap">{result.actualOutput || '""'}</Text>
                                            </Flex>
                                            <Flex justify="start">
                                                <Text fontWeight="bold" mr={5}>Đầu ra mong đợi:</Text>
                                                <Text whiteSpace="pre-wrap">{testcase.output || '""'}</Text>
                                            </Flex>
                                            <Flex justify="start">
                                                <Text fontWeight="bold" mr={5}>Giới hạn thời gian:</Text>
                                                <Text>{limitTime || '""'} ms</Text>
                                            </Flex>
                                            <Flex justify="start">
                                                <Text fontWeight="bold" mr={5}>Thời gian thực thi:</Text>
                                                <Text>{result.execTime || '""'} ms</Text>
                                            </Flex>
                                        </GridItem>
                                        <GridItem>
                                            <Text fontWeight="bold" mr={5}>Hiển thị lỗi</Text>
                                            <Text bg="black" minH="12vh" borderRadius="md" p={2}>
                                                {result.error || "Không có lỗi"}
                                            </Text>
                                        </GridItem>
                                    </Grid>
                                </TabPanel>
                            );
                        })
                    )}
                </TabPanels>
            </Tabs>
        </Box>

    );
};

export default TestResultPanel;
