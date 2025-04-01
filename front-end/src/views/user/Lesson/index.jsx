import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Spinner, useToast, Flex, Image,Tabs, TabList, Tab, TabPanels, Tooltip,TabPanel,Icon,Badge } from "@chakra-ui/react";
import { getById } from "config/lessonService";
import NodataPng from "assets/img/nodata.png";
import ScrollToTop from "components/scroll/ScrollToTop";
import Split from "react-split";
import LessonHeader from "./components/LessonHeader";
import LessonContent from "./components/LessonContent";
import { FaRegFileAlt, FaClock, FaComments, FaQuestionCircle, FaBars } from "react-icons/fa";

export default function Lesson() {
    const { slugId } = useParams();
    const parts = slugId ? slugId.split("-") : [];
    const lessonId = parts.length > 0 ? parseInt(parts.pop(), 10) : NaN; // Lấy phần cuối làm ID
    const toast = useToast();
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        const fetchLesson = async () => {
            setLoading(true);
            try {
                const response = await getById(lessonId);

                    if (response && response.lessonTitle && response.lessonContent) {
                        setLesson(response);
                    } else {
                        toast({
                            title: "Lỗi khi lấy dữ liệu bài học",
                            status: "error",
                            duration: 2000,
                            isClosable: true,
                            position: "top-right",
                        });
                        console.log("Không có dữ liệu bài học");
                    }
                setTimeout(() => {
                    setLoading(false);
                }, 300);
            } catch (error) {
                toast({
                    title: "Lỗi khi lấy dữ liệu bài học",
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                    position: "top-right",
                });
                setLoading(false);
            }
        };

        if (!isNaN(lessonId)) {
            fetchLesson();
        } else {
            setLoading(false);
        }
    }, [lessonId, toast]);

    return (
        <ScrollToTop>
            <Box minH="85vh" w='100%'>
                 {lesson ? (
                    <Box>
                        <LessonHeader lesson={lesson} />
                        <Split className="split-container" sizes={[40, 60]} minSize={0} gutterSize={5}>
                            {/* Sidebar Tabs */}
                            <Box bg="white" minH="100%" maxW="100%">
                                {loading ? (
                                    <Flex justify="center" align="center" minH="100%">
                                        <Spinner size="lg" color="blue.500" />
                                    </Flex>
                                ) : (
                                    <Tabs
                                        orientation="vertical"
                                        h="100%"
                                        variant="unstyled"
                                        index={activeTab}
                                        onChange={(index) => setActiveTab(index)}
                                    >
                                        <Box display="flex" h="100%" overflow="auto" overflowX="hidden">
                                           <TabList bg="blue.600" color="white" display="flex" flexDirection="column" alignItems="center">
                                                <Tooltip label="Mô tả" placement="right" hasArrow>
                                                    <Tab py={4} _selected={{ bg: "blue.800" }}>
                                                        <Icon as={FaRegFileAlt} boxSize={5} />
                                                    </Tab>
                                                </Tooltip>

                                                <Tooltip label="Bài học" placement="right" hasArrow>
                                                    <Tab py={4} _selected={{ bg: "blue.800" }}>
                                                        <Icon as={FaBars} boxSize={5} />
                                                    </Tab>
                                                </Tooltip>

                                                <Tooltip label="Lịch sử" placement="right" hasArrow>
                                                    <Tab py={4} _selected={{ bg: "blue.800" }}>
                                                        <Icon as={FaClock} boxSize={5} />
                                                    </Tab>
                                                </Tooltip>

                                                <Tooltip label="Tin nhắn" placement="right" hasArrow>
                                                    <Tab py={4} _selected={{ bg: "blue.800" }} position="relative">
                                                        <Icon as={FaComments} boxSize={5} />
                                                        <Badge colorScheme="red" position="absolute" top="-2px" right="-10px" fontSize="8px">161</Badge>
                                                    </Tab>
                                                </Tooltip>

                                                <Tooltip label="Hỗ trợ" placement="right" hasArrow>
                                                    <Tab py={4} _selected={{ bg: "blue.800" }}>
                                                        <Icon as={FaQuestionCircle} boxSize={5} />
                                                    </Tab>
                                                </Tooltip>
                                            </TabList>
                                            <TabPanels flex="1" display="flex" flexDirection="column">
                                                <TabPanel overflowY="auto" maxHeight="calc(100vh - 50px)" flex="1">
                                                    <Box maxWidth="100%">
                                                    <LessonContent lesson={lesson} />
                                                    </Box>
                                                </TabPanel>
                                                <TabPanel overflowY="auto" maxHeight="calc(100vh - 50px)" flex="1">
                                                    <Box>Danh mục</Box>
                                                </TabPanel>
                                                <TabPanel overflowY="auto" maxHeight="calc(100vh - 50px)" flex="1">
                                                    <Box>Lịch sử</Box>
                                                </TabPanel>
                                                <TabPanel overflowY="auto" maxHeight="calc(100vh - 50px)" flex="1">
                                                    <Box>Tin nhắn</Box>
                                                </TabPanel>
                                                <TabPanel overflowY="auto" maxHeight="calc(100vh - 50px)" flex="1">
                                                    <Box>Hỗ trợ</Box>
                                                </TabPanel>
                                            </TabPanels>
                                        </Box>
                                    </Tabs>
                                )}
                            </Box>
                            {/* Code Editor */}
                            <Box bg="black" minH="100%" color="white">
                                {loading ? (
                                    <Flex justify="center" align="center" minH="100%">
                                        <Spinner size="lg" color="white" />
                                    </Flex>
                                ) : (
                                    <p>Code editor content here...</p>
                                )}
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
