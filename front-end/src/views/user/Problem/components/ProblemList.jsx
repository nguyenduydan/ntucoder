import {
    Box,
    Flex,
    useToast
} from '@chakra-ui/react';
import React, { useEffect, useState, useCallback } from 'react';
import { getDetail } from '@/config/apiService';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FaCode } from "react-icons/fa6";
import ProblemDetail from './ProblemDetail';

const ProblemList = ({ lessonID }) => {
    const [problems, setProblems] = useState(null);
    const [problemContent, setProblemContent] = useState(null);
    const toast = useToast();
    const location = useLocation();
    const navigate = useNavigate();

    const searchParams = new URLSearchParams(location.search);
    const problemID = searchParams.get("problemID");

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

    useEffect(() => {
        if (!isNaN(lessonID)) {
            fetchLessonData();
        }
    }, [lessonID, fetchLessonData]);

    useEffect(() => {
        fetchProblemDetail();
    }, [fetchProblemDetail]);

    const handleBackToList = () => {
        navigate(location.pathname); // Xóa query param problemID
        fetchProblemDetail();
        fetchLessonData();
    };

    return (
        <Box>
            {!problemID || !problemContent ? (
                <>
                    <Box fontSize="xl" fontWeight="bold" mb={4}>
                        Danh sách bài tập
                    </Box>
                    <Box>
                        {!problems || problems.length === 0 ? (
                            <Box>Không có bài tập nào hết nha.</Box>
                        ) : (
                            problems.map((p, index) => (
                                <NavLink to={`${location.pathname}?problemID=${p.problemID}`} key={p.problemID}>
                                    <Box
                                        p={2}
                                        borderBottom="1px solid #eee"
                                        _hover={{ bg: "gray.300", transform: "scale(1.01)" }}
                                        transition="all 0.2s"
                                        borderRadius="md"
                                        cursor="pointer"
                                    >
                                        <Flex alignItems="center" gap={2}>
                                            <FaCode />{index + 1}. {p.problemName}
                                        </Flex>
                                    </Box>
                                </NavLink>
                            ))
                        )}
                    </Box>
                </>
            ) : (
                <ProblemDetail problem={problemContent} onBack={handleBackToList} />
            )}
        </Box>
    );
};

export default ProblemList;
