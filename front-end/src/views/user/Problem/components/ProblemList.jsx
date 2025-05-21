import {
    Box,
    Flex,
    useToast,
    Text,
    Icon
} from '@chakra-ui/react';
import React, { useEffect, useState, useCallback } from 'react';
import { getDetail } from '@/config/apiService';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FaCode, FaCheckCircle, FaRegCircle } from "react-icons/fa";
import ProblemDetail from './ProblemDetail';
import api from '@/config/apiConfig';

const ProblemList = ({ lessonID }) => {
    const [problems, setProblems] = useState(null);
    const [problemContent, setProblemContent] = useState(null);
    const toast = useToast();
    const location = useLocation();
    const navigate = useNavigate();

    const searchParams = new URLSearchParams(location.search);
    const problemID = searchParams.get("problemID");
    const [solvedProblems, setSolvedProblems] = useState([]);

    // Fetch danh sách bài tập trong lesson
    const fetchLessonData = useCallback(async () => {
        try {
            const res = await getDetail({
                controller: "Lesson",
                id: lessonID
            });
            setProblems(res.lessonProblems || []);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu bài học:", error);
            toast({
                title: "Lỗi",
                description: "Không thể tải bài học.",
                status: "error",
                duration: 3000,
                position: "top-right",
                variant: "top-accent",
                isClosable: true,
            });
        }
    }, [lessonID, toast]);

    // Fetch chi tiết bài tập (nếu có chọn)
    const fetchProblemDetail = useCallback(async () => {
        if (!problemID) {
            setProblemContent(null);
            return;
        }

        try {
            const res = await getDetail({
                controller: "Problem",
                id: problemID
            });
            setProblemContent(res);
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết bài tập:", error);
            toast({
                title: "Lỗi",
                description: "Không thể tải chi tiết bài tập.",
                status: "error",
                duration: 3000,
                position: "top-right",
                variant: "top-accent",
                isClosable: true,
            });
        }
    }, [problemID, toast]);

    const fetchProblemSolved = useCallback(async () => {
        try {
            const res = await api.get(`/Progress/solved-problems?lessonId=${lessonID}`);
            const ids = res.data.map(item => item.problemId);
            setSolvedProblems(ids);
        } catch (err) {
            console.error("Lỗi khi lấy danh sách bài đã hoàn thành:", err);
        }
    }, [lessonID]);



    useEffect(() => {
        if (!isNaN(lessonID)) {
            fetchLessonData();
            fetchProblemSolved();
        }
    }, [lessonID, fetchLessonData, fetchProblemSolved]);

    useEffect(() => {
        fetchProblemDetail();
    }, [fetchProblemDetail]);

    const handleBackToList = () => {
        navigate(location.pathname);
        fetchProblemDetail();
        fetchLessonData();
        fetchProblemSolved();
    };

    return (
        <Box p={5} >
            {!problemID || !problemContent ? (
                <Box>
                    <Box fontSize="xl" fontWeight="bold" mb={4}>
                        Danh sách bài tập
                    </Box>
                    <Box>
                        {!problems || problems.length === 0 ? (
                            <Box>Không có bài tập nào hết nha.</Box>
                        ) : (
                            problems.map((p, index) => {
                                const isSolved = solvedProblems.includes(p.problemID);
                                return (
                                    <NavLink to={`${location.pathname}?problemID=${p.problemID}`} key={p.problemID}>
                                        <Box
                                            p={2}
                                            borderBottom="1px solid #eee"
                                            _hover={{ bg: "gray.300", transform: "scale(1.01)" }}
                                            transition="all 0.2s"
                                            borderRadius="md"
                                            cursor="pointer"
                                        >
                                            <Flex alignItems="center" justifyContent="space-between">
                                                <Flex alignItems="center" gap={2}>
                                                    <FaCode />
                                                    <Text>
                                                        {index + 1}. {p.problemName}
                                                    </Text>
                                                </Flex>
                                                <Icon
                                                    as={isSolved ? FaCheckCircle : FaRegCircle}
                                                    color={isSolved ? "green.500" : "gray.400"}
                                                    fontSize="xl"
                                                />
                                            </Flex>
                                        </Box>
                                    </NavLink>
                                );
                            })
                        )}
                    </Box>
                </Box>
            ) : (
                <ProblemDetail problem={problemContent} onBack={handleBackToList} />
            )}
        </Box>
    );
};

export default ProblemList;
