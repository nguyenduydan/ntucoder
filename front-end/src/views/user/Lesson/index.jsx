import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Box, useToast, Flex, Image, Tabs, TabList, Tab, TabPanels,
    Text, Tooltip, TabPanel, Icon, Spinner
} from "@chakra-ui/react";
import NodataPng from "assets/img/nodata.png";
import ScrollToTop from "@/components/scroll/ScrollToTop";
import Split from "react-split";
import LessonHeader from "./components/LessonHeader";
import LessonContent from "./components/LessonContent";
import LessonList from "./components/LessonList";
import History from "../Problem/components/History";
import Problem from "../Problem/index";
import ProblemList from "../Problem/components/ProblemList";
import { FaRegFileAlt, FaBook, FaQuestionCircle, FaBars } from "react-icons/fa";
import { IoIosChatbubbles } from "react-icons/io";

import { getDetail } from "@/config/apiService";
export default function Lesson() {
    const { lessonId } = useParams();
    const toast = useToast();
    const [lesson, setLesson] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const handleSelectLesson = () => {
        setActiveTab(0); // chuyển về tab ProblemList
    };

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const response = await getDetail({ controller: "Lesson", id: lessonId });
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
            } catch (error) {
                setIsLoading(false);
                toast({
                    title: "Lỗi khi lấy dữ liệu bài học",
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                    position: "top-right",
                });
            } finally {
                setIsLoading(false);
            }
        };

        if (!isNaN(lessonId)) {
            fetchLesson();
        }
    }, [lessonId, toast]);

    return (
        <ScrollToTop>
            <Box minH="100%" w='100%'>
                {isLoading ? (
                    <Flex justify="center" align="center" height="100vh">
                        <Spinner size="xl" color="blue.500" />
                    </Flex>
                ) : lesson ? (
                    <Box>
                        <LessonHeader lesson={lesson} />
                        <Split className="split-container" sizes={[45, 55]} minSize={0} gutterSize={5}>
                            {/* Sidebar Tabs */}
                            <Box bg="white" minH="100%" maxW="100%">
                                <Tabs
                                    orientation="vertical"
                                    h="100%"
                                    variant="unstyled"
                                    index={activeTab}
                                    onChange={(index) => setActiveTab(index)}
                                >
                                    <Box display="flex" h="100%" w="100%" overflow="auto" overflowX="hidden">
                                        <TabList bg="blue.600" color="white" display="flex" flexDirection="column" alignItems="center">
                                            <Tooltip label="Mô tả" placement="right" hasArrow>
                                                <Tab py={4} _selected={{ bg: "blue.800" }}>
                                                    <Icon as={FaRegFileAlt} boxSize={5} />
                                                </Tab>
                                            </Tooltip>
                                            <Tooltip label="Giáo trình" placement="right" hasArrow>
                                                <Tab py={4} _selected={{ bg: "blue.800" }}>
                                                    <Icon as={FaBars} boxSize={5} />
                                                </Tab>
                                            </Tooltip>
                                            <Tooltip label="Bài tập" placement="right" hasArrow>
                                                <Tab py={4} _selected={{ bg: "blue.800" }}>
                                                    <Icon as={FaBook} boxSize={5} />
                                                </Tab>
                                            </Tooltip>

                                            <Tooltip label="Lịch sử" placement="right" hasArrow>
                                                <Tab py={4} _selected={{ bg: "blue.800" }} position="relative">
                                                    <Icon as={FaQuestionCircle} boxSize={5} />
                                                </Tab>
                                            </Tooltip>
                                        </TabList>

                                        <TabPanels flex="1" display="flex" flexDirection="column">
                                            <TabPanel overflowY="auto" maxHeight="calc(100vh - 50px)" flex="1" ps={2} pe={0}>
                                                <Box maxWidth="100%" >
                                                    <LessonContent lesson={lesson} />
                                                </Box>
                                            </TabPanel>
                                            <TabPanel overflowY="auto" maxHeight="calc(100vh - 50px)" flex="1">
                                                <Box maxWidth="100%">
                                                    <Text fontWeight="bold" fontSize="lg"> Giáo Trình</Text>
                                                    <LessonList onSelectLesson={handleSelectLesson} />
                                                </Box>
                                            </TabPanel>
                                            <TabPanel overflowY="auto" maxHeight="calc(100vh - 50px)" flex="1">
                                                <Box>
                                                    <ProblemList lessonID={lessonId} />
                                                </Box>
                                            </TabPanel>
                                            <TabPanel overflowY="auto" maxHeight="calc(100vh - 50px)" flex="1">
                                                <Box maxWidth="100%">
                                                    <Text fontWeight="bold" fontSize="lg"> Lịch sử</Text>
                                                    <History />
                                                </Box>
                                            </TabPanel>
                                        </TabPanels>
                                    </Box>
                                </Tabs>
                            </Box>
                            {/* Code Editor */}
                            <Box bg="black" minH="100%" color="white">
                                <Problem />
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
