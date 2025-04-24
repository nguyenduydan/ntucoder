import React from "react";
import { Box, Button, Flex, Select } from "@chakra-ui/react";
import { FaHandPointUp } from "react-icons/fa";

export default function CodeNavbar({ language, setLanguage, theme, setTheme, onRun }) {
    const handleThemeChange = (event) => {
        setTheme(event.target.value);
    };

    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
    };

    return (
        <Box p={4} bg="gray.900" color="white">
            <Flex justifyContent="space-between" alignItems="center">
                <Select
                    w="20%"
                    value={language}
                    onChange={handleLanguageChange}
                    bg="transparent"
                    color="white"
                    sx={{
                        option: {
                            color: "white",
                            bg: "gray.900",
                        },
                    }}
                    cursor="pointer"
                >
                    <option value="cpp">C/C++</option>
                    {/* <option value="python">Python</option>
                        <option value="java">Java</option>
                        Thêm ngôn ngữ khác nếu cần */}
                </Select>
                <Flex width="70%" justify="end" align="center" gap={4}>
                    <Select
                        w="20%"
                        value={theme}
                        onChange={handleThemeChange}
                        bg="transparent"
                        color="white"
                        sx={{
                            option: {
                                color: "white",
                                bg: "gray.900",
                            },
                        }}
                        cursor="pointer"
                    >
                        <option value="vs-dark">Tối</option>
                        <option value="vs-light">Sáng</option>
                    </Select>

                    <Button colorScheme="blue" borderRadius="md" onClick={onRun}>
                        Chạy thử
                    </Button>
                    <Button leftIcon={<FaHandPointUp />} color="gray.300" borderRadius="md">
                        Nộp bài
                    </Button>
                </Flex>
            </Flex>
        </Box>
    );
}
