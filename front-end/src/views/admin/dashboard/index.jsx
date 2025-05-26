import { lazy, Suspense, useState } from "react";
import ScrollToTop from "@/components/scroll/ScrollToTop";
import {
    Container,
    Flex,
    Text,
    Spinner,
    Box,
    Heading,
    Select,
    IconButton,
    Tag,
    TagLabel,
    TagCloseButton,
    Tooltip,
    Divider,
    Button,
} from "@chakra-ui/react";
import { MdClear } from "react-icons/md";
import TimeDisplay from "./components/TimeLine";
import { useAuth } from "@/contexts/AuthContext";
import { useTitle } from "@/contexts/TitleContext";

// Lazy load các component
const Stats = lazy(() => import("views/admin/dashboard/components/Stats"));
const Courses = lazy(() => import("views/admin/dashboard/components/Course"));
const Blogs = lazy(() => import("views/admin/dashboard/components/Blogs"));
const CodersRanking = lazy(() => import("views/admin/dashboard/components/CodersRanking"));
const Problems = lazy(() => import("views/admin/dashboard/components/Problems"));

const sectionColorMap = {
    stats: "blue",
    courses: "green",
    coders: "orange",
    problems: "red",
    blogs: "purple",
};
const sectionOptions = Object.keys(sectionColorMap);

const sectionTitles = {
    stats: "Tổng quan",
    courses: "Khóa học",
    blogs: "Bài viết",
    coders: "Xếp hạng",
    problems: "Bài tập",
};

const MainDashBoard = () => {
    useTitle("Dashboard");
    const { coder } = useAuth();
    const initialVisibleSections = ["stats", "courses", "coders"];
    const [visibleSections, setVisibleSections] = useState(initialVisibleSections);
    const [loading, setLoading] = useState(false);
    const [refreshKey, setRefreshKey] = useState(Date.now());

    const handleRefresh = () => {
        setLoading(true);
        setRefreshKey(Date.now());
    };

    const handleSelectChange = (e) => {
        const value = e.target.value;
        if (value === "all") {
            setVisibleSections(sectionOptions);
        } else if (value && !visibleSections.includes(value)) {
            setVisibleSections([...visibleSections, value]);
        }
        e.target.value = "";
    };

    const removeSection = (section) => {
        setVisibleSections(visibleSections.filter((s) => s !== section));
    };

    const clearAllSections = () => {
        setVisibleSections([]);
    };

    const Section = ({ title, children }) => (
        <Box
            transition="all 0.3s ease"
            mb={5}
            height="100%"
            display="flex"
            flexDirection="column"
        >
            <Heading fontSize="xl" color="gray.700" mb={2}>
                {title}
            </Heading>
            <Divider mb={4} mt={2} w="60px" h="5px" borderRadius="full" bg="blue" />
            <Box flex="1" overflow="auto">
                {children}
            </Box>
        </Box>
    );

    const renderSectionComponent = (section) => {
        switch (section) {
            case "courses":
                return (
                    <Courses
                        refreshKey={refreshKey}
                        onFinishRefresh={() => setLoading(false)}
                        height="400px"
                    />
                );
            case "blogs":
                return <Blogs height="400px" refreshKey={refreshKey} onFinishRefresh={() => setLoading(false)} />;
            case "coders":
                return (
                    <CodersRanking
                        refreshKey={refreshKey}
                        onFinishRefresh={() => setLoading(false)}
                        height="400px"
                    />
                );
            case "problems":
                return <Problems height="400px" refreshKey={refreshKey}
                    onFinishRefresh={() => setLoading(false)} />;
            default:
                return null;
        }
    };

    const otherSections = visibleSections.filter((s) => s !== "stats");

    return (
        <ScrollToTop>
            <Container maxW="container.xl" mt={{ base: 40, md: 20 }} pb={10}>
                <TimeDisplay coder={coder} />
                {/* UI Select để chọn hiển thị */}
                <Box mb={10} p={5} shadow="md" borderRadius="lg" bgGradient="linear(to-r, blue.200, purple.300)">
                    <Flex justify="space-between" align="center" direction={{ base: "column", md: "row" }} alignItems="center" mb={4}>
                        <Heading fontSize="lg" mb={4} color="black">🎛️ Tùy chọn hiển thị</Heading>
                        <Button
                            size="md"
                            w={["100%", "150px"]}
                            boxShadow="md"
                            colorScheme="green"
                            isLoading={loading}
                            borderRadius="full"
                            _hover={{
                                transform: "scale(1.05)",
                                boxShadow: "2px 5px 10px rgb(15, 245, 69)",
                            }}
                            _active={{
                                transform: "scale(0.95)",
                            }}
                            onClick={handleRefresh}
                        >
                            Refresh
                        </Button>
                    </Flex>

                    <Flex direction={{ base: "column", md: "row" }} gap={4} align="center" flexWrap="wrap">
                        <Select
                            placeholder="📂 Chọn hiển thị"
                            onChange={handleSelectChange}
                            maxW="220px"
                            bg="white"
                            borderColor="gray.300"
                            color="black"
                            sx={{
                                option: {
                                    color: "black",
                                    bg: "white",
                                },
                            }}
                        >
                            <option value="all">🟢 Chọn tất cả</option>
                            {sectionOptions.map((key) => (
                                <option key={key} value={key}>
                                    📌 {sectionTitles[key]}
                                </option>
                            ))}
                        </Select>

                        {visibleSections.length > 0 && (
                            <Tooltip label="Xóa toàn bộ phần hiển thị" placement="top" bg=" red.500" color="white" hasArrow >
                                <IconButton
                                    icon={<MdClear />}
                                    onClick={clearAllSections}
                                    variant="ghost"
                                    colorScheme="red"
                                    size="sm"
                                    fontSize={20}
                                    aria-label="Clear"
                                />
                            </Tooltip>
                        )}

                        <Flex wrap="wrap" gap={2} mt={{ base: 3, md: 0 }}>
                            {visibleSections.map((section) => (
                                <Tag
                                    key={section}
                                    size="md"
                                    borderRadius="full"
                                    variant="solid"
                                    colorScheme={sectionColorMap[section] || "gray"}
                                >
                                    <TagLabel color="white">{sectionTitles[section]}</TagLabel>
                                    <TagCloseButton onClick={() => removeSection(section)} />
                                </Tag>
                            ))}
                        </Flex>
                    </Flex>
                </Box>

                <Suspense fallback={<Flex justify="center" py={10}><Spinner size="xl" /></Flex>}>
                    {/* Section thống kê riêng */}
                    {visibleSections.includes("stats") && (
                        <Box height="100%" mb={10}>
                            <Section title="Thống kê tổng quan">
                                <Stats
                                    refreshKey={refreshKey}
                                    onFinishRefresh={() => setLoading(false)}
                                    height="100%"
                                />
                            </Section>
                        </Box>
                    )}

                    {/* Các section còn lại */}
                    <Flex wrap="wrap" gap={6} mb={10}>
                        {otherSections.map((section, index, arr) => {
                            const isLast = index === arr.length - 1;
                            const isOddCount = arr.length % 2 !== 0;
                            const isLastAlone = isOddCount && isLast;

                            const width = isLastAlone
                                ? "100%"
                                : { base: "100%", md: "calc(50% - 12px)" };

                            return (
                                <Box key={section} w={width} minH="300px">
                                    <Section title={sectionTitles[section]}>
                                        {renderSectionComponent(section)}
                                    </Section>
                                </Box>
                            );
                        })}
                    </Flex>
                </Suspense>
            </Container>
        </ScrollToTop>
    );
};

export default MainDashBoard;
