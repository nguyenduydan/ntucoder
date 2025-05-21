import {
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    Flex,
    Box,
    Icon,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { FaUserAlt, FaBookOpen, FaPuzzlePiece } from "react-icons/fa";
import { getList } from "@/config/apiService";
import Counter from "@/components/animate/Count";
import { motion } from "framer-motion";

// Mapping
const iconMap = {
    "Người dùng": FaUserAlt,
    "Khóa học": FaBookOpen,
    "Bài tập": FaPuzzlePiece,
    "Số người đăng ký": FaBookOpen,
};

const colorMap = {
    "Người dùng": "purple",
    "Khóa học": "teal",
    "Bài tập": "orange",
    "Số người đăng ký": "blue",
};

// Motion wrapper
const MotionStat = motion(Stat);

const Stats = ({ refreshKey, onFinishRefresh }) => {
    const [counts, setCounts] = useState({
        users: 0,
        courses: 0,
        problems: 0,
        enrolls: 0
    });

    const fetchCounts = useCallback(async () => {
        try {
            const [courseRes, problemRes, coderRes, enrollRes] = await Promise.all([
                getList({ controller: "Course", page: 1, pageSize: 1 }),
                getList({ controller: "Problem", page: 1, pageSize: 1 }),
                getList({ controller: "Coder", page: 1, pageSize: 1 }),
                getList({ controller: "Enrollment", page: 1, pageSize: 1 }),
            ]);

            setCounts({
                users: coderRes.totalCount || coderRes.data?.totalCount || 0,
                courses: courseRes.totalCount || courseRes.data?.totalCount || 0,
                problems: problemRes.totalCount || problemRes.data?.totalCount || 0,
                enrolls: enrollRes.totalCount || enrollRes.data?.totalCount || 0,
            });
        } catch (error) {
            console.error("Lỗi khi lấy số liệu thống kê:", error);
        } finally {
            if (onFinishRefresh) {
                onFinishRefresh();
            }
        }
    }, []);

    useEffect(() => {
        fetchCounts();
    }, [fetchCounts, refreshKey]);

    const stats = [
        { label: "Người dùng", value: counts.users },
        { label: "Khóa học", value: counts.courses },
        { label: "Bài tập", value: counts.problems },
        { label: "Số người đăng ký", value: counts.enrolls }
    ];

    return (
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={8}>
            {stats.map(({ label, value }, index) => {
                const IconComp = iconMap[label];
                const color = colorMap[label];

                return (
                    <MotionStat
                        key={label}
                        px={6}
                        py={8}
                        shadow="xl"
                        borderRadius="lg"
                        bgGradient={`linear(to-r, ${color}.400, ${color}.600)`}
                        color="white"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                    >
                        <Flex align="center">
                            <Box
                                boxSize={20}
                                mr={2}
                                bg="whiteAlpha.300"
                                borderRadius="md"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Icon as={IconComp} w={10} h={10} />
                            </Box>
                            <Flex align="start" flexDirection="column">
                                <StatLabel fontWeight="bold" fontSize="md" letterSpacing="wider">
                                    {label}
                                </StatLabel>
                                <StatNumber fontSize="3xl" fontWeight="extrabold" letterSpacing="tight">
                                    <Counter key={value} to={value} />
                                </StatNumber>
                            </Flex>
                        </Flex>
                    </MotionStat>
                );
            })}
        </SimpleGrid>
    );
};

export default Stats;
