import {
    Box,
    useToast
} from '@chakra-ui/react';
import React, { useEffect, useState, useCallback } from 'react';
import { getDetail } from 'config/apiService';

const ProblemList = ({ lessonID }) => {  // Nhận lessonID từ props
    const [problems, setProblems] = useState(null);
    const toast = useToast();

    // Dùng useCallback để đảm bảo fetchData không bị tạo lại mỗi lần render
    const fetchData = useCallback(async () => {
        try {
            const res = await getDetail({
                controller: "Lesson",
                id: lessonID
            });
            const lessonProblems = res.lessonProblems;
            setProblems(lessonProblems); // Cập nhật state
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

    useEffect(() => {
        if (!isNaN(lessonID)) {
            fetchData(); // Gọi hàm fetchData khi component mount hoặc lessonID thay đổi
        }
    }, [lessonID, fetchData]);


    return (
        <Box>
            <Box p={4}>
                <Box fontSize="xl" fontWeight="bold" mb={4}>
                    Danh sách bài tập
                </Box>
                <Box>
                    {!problems || problems.length === 0 ? (
                        <Box>Không có bài tập nào hết nha.</Box>
                    ) : (
                        problems.map((p) => (
                            <Box
                                key={p.problemID}
                                p={2}
                                borderBottom="1px solid #eee"
                                _hover={{ bg: "gray.300", transform: "scale(1.01)" }}
                                transition="all 0.2s"
                                borderRadius="md"
                                cursor="pointer"
                            >
                                {p.problemName}
                            </Box>
                        ))
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default ProblemList;
