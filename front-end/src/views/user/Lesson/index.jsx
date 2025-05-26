import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
    Box, useToast, Flex, Image, Tabs, TabList, Tab, TabPanels,
    Text, Tooltip, TabPanel, Icon, Spinner
} from "@chakra-ui/react";
import NodataPng from "assets/img/nodata.png";
import Split from "react-split";
import LessonHeader from "./components/LessonHeader";
import LessonContent from "./components/LessonContent";
import LessonList from "./components/LessonList";
import History from "../Problem/components/History";
import Problem from "../Problem/index";
import ProblemList from "../Problem/components/ProblemList";
import { FaRegFileAlt, FaBook, FaQuestionCircle, FaBars } from "react-icons/fa";
import { getDetail } from "@/config/apiService";


export default function Lesson() {
    const { lessonId } = useParams();
    const toast = useToast();
    const [lesson, setLesson] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const problemID = searchParams.get("problemID");


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
        <Box h="712px" w="100%" display="flex" flexDirection="column">
            {isLoading ? (
                <Flex justify="center" align="center" height="100vh">
                    <Spinner size="xl" color="blue.500" />
                </Flex>
            ) : lesson ? (
                <Box flex="1" display="flex" flexDirection="column" overflow="hidden">
                    <LessonHeader lesson={lesson} />
                    <Box flex="1" overflow="hidden">
                        <Split className="split-container" sizes={[45, 55]} minSize={0} gutterSize={5} style={{ height: '100%' }}>
                            {/* Sidebar Tabs */}
                            <Box bg="white" h="100%" overflow="hidden">
                                <Tabs
                                    orientation="vertical"
                                    h="100%"
                                    variant="unstyled"
                                    index={activeTab}
                                    onChange={(index) => setActiveTab(index)}
                                >
                                    <Flex h="100%" w="100%" overflow="hidden">
                                        <TabList
                                            bgGradient="linear(to-b,rgb(8, 84, 156),purple.800)"
                                            color="white"
                                            display="flex"
                                            flexDirection="column"
                                            alignItems="center"
                                            h="100%"
                                        >
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
                                            {problemID && (
                                                <Tooltip label="Lịch sử" placement="right" hasArrow>
                                                    <Tab py={4} _selected={{ bg: "blue.800" }}>
                                                        <Icon as={FaQuestionCircle} boxSize={5} />
                                                    </Tab>
                                                </Tooltip>
                                            )}
                                        </TabList>

                                        <TabPanels flex="1" h="100%" overflow="hidden">
                                            <TabPanel p={0} h="100%" overflowY="auto">
                                                <LessonContent lesson={lesson} />
                                            </TabPanel>
                                            <TabPanel p={0} h="100%" overflowY="auto">
                                                <Text fontWeight="bold" fontSize="lg" px={4} pt={2}>Giáo Trình</Text>
                                                <LessonList onSelectLesson={handleSelectLesson} />
                                            </TabPanel>
                                            <TabPanel p={0} h="100%" overflowY="auto">
                                                <ProblemList lessonID={lessonId} />
                                            </TabPanel>
                                            {problemID && (
                                                <TabPanel p={0} h="100%" overflowY="auto">
                                                    <Text fontWeight="bold" fontSize="lg" px={4} pt={2}>Lịch sử</Text>
                                                    <History />
                                                </TabPanel>
                                            )}
                                        </TabPanels>

                                    </Flex>
                                </Tabs>
                            </Box>

                            {/* Editor Right Side */}
                            <Box bg="black" h="100%" overflow="auto" color="white">
                                <Problem />
                            </Box>
                        </Split>
                    </Box>
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

    );
}
