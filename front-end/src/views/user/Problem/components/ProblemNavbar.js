import React from "react";
import { Box, Button, Flex, Badge, Select } from "@chakra-ui/react";
import { FaHandPointUp } from "react-icons/fa";

export default function CodeEditor({ setTheme }) {
    const handleThemeChange = (event) => {
        setTheme(event.target.value); // Cập nhật theme mới
    };
    return (
        <Box p={4} bg="gray.900" color="white">
            <Flex justifyContent="space-between" alignItems="center" alignContent="center">
                <Badge colorScheme="cyan" variant="outline" fontSize="lg" px={5} borderRadius="md" cursor="default">C++</Badge>
                <Flex width="70%" justify="end">
                    <Select
                        w="20%"
                        onChange={handleThemeChange}
                        bg="transparent"
                        sx={{
                            option: {
                                color: "white", // Áp dụng màu từ textColor
                                bg: "gray.900", // Màu nền phù hợp với chế độ sáng/tối
                            },
                        }}
                        cursor="pointer"
                        defaultValue="vs-dark"
                    >
                        <option bg="transparent" value="vs-dark">Tối</option>
                        <option bg="transparent" value="vs-light">Sáng</option>
                        {/* Thêm các theme khác nếu cần */}
                    </Select>
                    <Button colorScheme="blue" borderRadius="md" ml={4}>Chạy thử</Button>
                    <Button leftIcon={<FaHandPointUp />} color="gray.300" borderRadius="md" ml={4}>Nộp bài</Button>
                </Flex>
            </Flex>
        </Box>
    );
}
