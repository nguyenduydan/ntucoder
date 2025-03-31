import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Text, Spinner, useToast, Flex, Image } from "@chakra-ui/react";
import { getById } from "config/lessonService";
import NodataPng from "assets/img/nodata.png";
import ScrollToTop from "components/scroll/ScrollToTop";
import DOMPurify from "dompurify";
import Split from "react-split";
import LessonHeader from "./components/LessonHeader";

export default function Lesson() {
    const { slugId } = useParams();
    const parts = slugId ? slugId.split("-") : [];
    const lessonId = parts.length > 0 ? parseInt(parts.pop(), 10) : NaN; // Lấy phần cuối làm ID
    const toast = useToast();
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLesson = async () => {
            setLoading(true);
            try {
                const response = await getById(lessonId);

                if (response && response.lessonTitle && response.lessonContent) {
                    setLesson(response);
                } else {
                    console.log("Không có dữ liệu bài học");
                }
            } catch (error) {
                toast({
                    title: "Lỗi khi lấy dữ liệu bài học",
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                    position: "top-right",
                });
            } finally {
                setLoading(false);
            }
        };

        if (lessonId) {
            fetchLesson();
        }
    }, [lessonId, toast]);

    return (
        <ScrollToTop>
            <Box minH="85vh" w='100%'>
                {loading ? (
                    <Flex justify="center" align="center" height="50vh">
                        <Spinner
                            thickness='4px'
                            speed='0.3s'
                            emptyColor='gray.200'
                            color='blue.500'
                            size='xl'
                        />
                    </Flex>
                ) : lesson ? (
                    <Box>
                        <LessonHeader lesson={lesson} />
                        <Split
                            className="split-container"
                            sizes={[50, 50]} // Kích thước ban đầu của 2 ô (50% - 50%)
                            minSize={200} // Kích thước tối thiểu của mỗi ô
                            gutterSize={5} // Độ rộng của thanh kéo
                        >
                            <Box bg="white" minH="100%" p={4}>
                                {/* Nội dung bài học */}
                                <Text fontSize="md" color="gray.600">
                                    <Box
                                        dangerouslySetInnerHTML={{
                                            __html: lesson ? DOMPurify.sanitize(lesson.lessonContent || "Chưa có thông tin", {
                                                ALLOWED_TAGS: ['*', 'iframe', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li','br', 'strong', 'em', 'b', 'i', 'u'],
                                                ALLOWED_ATTR: ['src', 'width', 'height', 'frameborder', 'allowfullscreen','style'],
                                            }) : "Chưa có thông tin",
                                        }}
                                    />
                                </Text>
                            </Box>
                            <Box bg="black" minH="100%" p={4}>
                                {/* Nội dung code */}
                            </Box>
                        </Split>
                    </Box>
                ) : (
                    <Flex justify="center" align="center" height="70vh">
                        <Image
                            src={NodataPng}
                            alt="Không có dữ liệu"
                            h="50%"
                            objectFit="fill"
                            backgroundColor="transparent"
                        />
                    </Flex>
                )}
            </Box>
        </ScrollToTop>
    );
}
