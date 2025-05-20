import { SimpleGrid, Stat, StatLabel, StatNumber, Flex, Box, Icon } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from 'react';
import { FaUserAlt, FaBookOpen, FaPuzzlePiece } from "react-icons/fa";
import { getList } from "@/config/apiService";

const iconMap = {
    "Người dùng": FaUserAlt,
    "Khóa học": FaBookOpen,
    "Bài tập": FaPuzzlePiece,
};

const colorMap = {
    "Người dùng": "purple",
    "Khóa học": "teal",
    "Bài tập": "orange",
};


const Stats = () => {
    // Lưu số lượng
    const [counts, setCounts] = useState({
        users: 0,
        courses: 0,
        problems: 0,
    });

    const fetchCounts = useCallback(async () => {
        try {
            const courseRes = await getList({ controller: "Course", page: 1, pageSize: 1 });
            const problemRes = await getList({ controller: "Problem", page: 1, pageSize: 1 });
            const coderRes = await getList({ controller: "Coder", page: 1, pageSize: 1 });

            setCounts({
                users: coderRes.totalCount || coderRes.data.totalCount || 0,   // tùy API trả về
                courses: courseRes.totalCount || courseRes.data.totalCount || 0,
                problems: problemRes.totalCount || problemRes.data.totalCount || 0,
            });
        } catch (error) {
            console.error("Lỗi khi lấy số liệu thống kê:", error);
            setCounts({ users: 0, courses: 0, problems: 0 });
        }
    }, []);

    useEffect(() => {
        fetchCounts();
    }, [fetchCounts]);

    const stats = [
        { label: "Người dùng", value: counts.users },
        { label: "Khóa học", value: counts.courses },
        { label: "Bài tập", value: counts.problems },
    ];


    return (
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
            {stats.map(({ label, value }) => {
                const IconComp = iconMap[label];
                const color = colorMap[label];
                return (
                    <Stat
                        key={label}
                        px={6}
                        py={8}
                        shadow="xl"
                        borderRadius="lg"
                        bgGradient={`linear(to-r, ${color}.400, ${color}.600)`}
                        color="white"
                    >
                        <Flex>
                            <Box boxSize={20} mr={5} bg="whiteAlpha.300" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
                                <Icon as={IconComp} w={10} h={10} />
                            </Box>
                            <Flex align="start" flexDirection="column" >
                                <StatLabel fontWeight="bold" fontSize="lg" letterSpacing="wider">
                                    {label}
                                </StatLabel>
                                <StatNumber fontSize="4xl" fontWeight="extrabold" letterSpacing="tight">
                                    {value.toLocaleString()}
                                </StatNumber>
                            </Flex>
                        </Flex>
                    </Stat>
                );
            })}
        </SimpleGrid>
    );
};

export default Stats


