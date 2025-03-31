import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Text, Spinner, useToast } from "@chakra-ui/react";
import { getById } from "config/lessonService";

import ScrollToTop from "components/scroll/ScrollToTop";

export default function Lesson() {
    const { slugId } = useParams();
    const toast = useToast();
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLesson = async () => {
            setLoading(true);
            try {
                // Lấy lessonId từ slugId ("bai1phucngu-4" -> lấy số 4)
                const lessonId = slugId.split("-").pop();

                const response = await getById(lessonId);
                setLesson(response.data);
            } catch (error) {
                toast({
                    title: "Lỗi khi lấy dữ liệu bài học",
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                    position: "top-right",
                });
            }
            setLoading(false);
        };

        fetchLesson();
    }, [slugId,toast]);

    return (
        <ScrollToTop>
            <Box pt={{ base: "130px", md: "80px", xl: "80px" }} px="6">
                {loading ? (
                    <Spinner size="xl" />
                ) : lesson ? (
                    <>
                        <Text fontSize="2xl" fontWeight="bold" mb="4">{lesson.lessonTitle}</Text>
                        <Text fontSize="md" color="gray.600">{lesson.lessonContent}</Text>
                    </>
                ) : (
                    <Text fontSize="md" color="gray.500">Không tìm thấy bài học.</Text>
                )}
            </Box>
        </ScrollToTop>
    );
}
