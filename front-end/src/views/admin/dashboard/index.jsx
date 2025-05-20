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
} from "@chakra-ui/react";
import { MdClear } from "react-icons/md";
import { formatDateTime } from "@/utils/utils";
import TimeDisplay from "./components/TimeLine";

// Lazy load các component
const Stats = lazy(() => import("views/admin/dashboard/components/Stats"));
const Courses = lazy(() => import("views/admin/dashboard/components/Course"));
const Blogs = lazy(() => import("views/admin/dashboard/components/Blogs"));
const CodersRanking = lazy(() => import("views/admin/dashboard/components/CodersRanking"));
const Problems = lazy(() => import("views/admin/dashboard/components/Problems"));
const Lessons = lazy(() => import("views/admin/dashboard/components/Lesson"));
const Topics = lazy(() => import("views/admin/dashboard/components/Topic"));
const TopCourseEnrolls = lazy(() => import("views/admin/dashboard/components/TopCourseEnrolls"));
const TopBlogViewers = lazy(() => import("views/admin/dashboard/components/TopBlogViewers"));

const sectionColorMap = {
    stats: "blue",
    courses: "green",
    blogs: "purple",
    coders: "orange",
    problems: "red",
    lessons: "teal",
    topics: "cyan",
    topCourses: "yellow",
    topBlogs: "pink",
};
const sectionOptions = Object.keys(sectionColorMap);

const MainDashBoard = () => {
    const initialVisibleSections = ["stats", "courses", "topCourses"];
    const [visibleSections, setVisibleSections] = useState(initialVisibleSections);


    const handleSelectChange = (e) => {
        const value = e.target.value;

        if (value === "all") {
            setVisibleSections(sectionOptions); // Chọn tất cả
        } else if (value && !visibleSections.includes(value)) {
            setVisibleSections([...visibleSections, value]);
        }

        e.target.value = ""; // Reset Select về placeholder
    };


    const removeSection = (section) => {
        setVisibleSections(visibleSections.filter((s) => s !== section));
    };

    const clearAllSections = () => {
        setVisibleSections([]);
    };

    const stats = [
        { label: "Người dùng", value: 1245, change: "+8.5%" },
        { label: "Khóa học", value: "₫120,000,000", change: "+12%" },
        { label: "Bài tập", value: 320, change: "-3%" },
    ];

    const courses = [
        { id: 1, title: "React cơ bản", enrolls: 1200 },
        { id: 2, title: "NodeJS nâng cao", enrolls: 950 },
        { id: 3, title: "Chakra UI từ A-Z", enrolls: 800 },
    ];

    const blogs = [
        { id: 1, title: "Học React thế nào?", views: 5000 },
        { id: 2, title: "Tips tối ưu NodeJS", views: 3500 },
        { id: 3, title: "Chakra UI đẹp thế nào?", views: 2800 },
    ];

    const coders = [
        { id: 1, name: "Nguyen Van A", rank: 1, points: 1500 },
        { id: 2, name: "Tran Thi B", rank: 2, points: 1400 },
        { id: 3, name: "Le Van C", rank: 3, points: 1300 },
    ];

    const problems = [
        { id: 1, title: "Tính tổng dãy số", difficulty: "Dễ" },
        { id: 2, title: "Tìm chuỗi con dài nhất", difficulty: "Trung bình" },
        { id: 3, title: "Thuật toán Dijkstra", difficulty: "Khó" },
    ];

    const lessons = [
        { id: 1, title: "JS Basics" },
        { id: 2, title: "React Hooks" },
        { id: 3, title: "Node Express" },
    ];

    const topics = [
        { id: 1, name: "Frontend" },
        { id: 2, name: "Backend" },
        { id: 3, name: "Algorithm" },
    ];

    const topCourseEnrolls = courses.sort((a, b) => b.enrolls - a.enrolls).slice(0, 3);
    const topBlogViews = blogs.sort((a, b) => b.views - a.views).slice(0, 3);

    const Section = ({ title, children }) => (
        <Box mb={10} transition="all 0.3s ease">
            <Heading fontSize="xl" color="gray.700">
                {title}
            </Heading>
            <Divider mb={4} mt={2} w="60px" h="5px" borderRadius="full" bg="brand.500" />
            <Box>
                {children}
            </Box>
        </Box>
    );


    return (
        <ScrollToTop>
            <Container maxW="container.xl" mt={{ base: 40, md: 20 }} pb={10}>
                <TimeDisplay />
                {/* UI Select để chọn hiển thị */}
                <Box mb={10} p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg="gray.50">
                    <Heading fontSize="lg" mb={4} color="gray.700">🎛️ Tùy chọn hiển thị</Heading>

                    <Flex direction={{ base: "column", md: "row" }} gap={4} align="center" flexWrap="wrap">
                        <Select
                            placeholder="📂 Chọn phần..."
                            onChange={handleSelectChange}
                            maxW="220px"
                            bg="white"
                            borderColor="gray.300"
                            _hover={{ borderColor: "blue.400" }}
                            _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
                        >
                            <option value="all">🟢 Chọn tất cả</option>
                            {sectionOptions.map((key) => (
                                <option key={key} value={key}>
                                    {`📌 ${key}`}
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
                                    <TagLabel color="white">{section}</TagLabel>
                                    <TagCloseButton onClick={() => removeSection(section)} />
                                </Tag>
                            ))}
                        </Flex>
                    </Flex>
                </Box>


                <Suspense fallback={<Flex justify="center" py={10}><Spinner size="xl" /></Flex>}>
                    {visibleSections.includes("stats") && (
                        <Section title="Thống kê tổng quan">
                            <Stats />
                        </Section>
                    )}

                    {visibleSections.includes("courses") && (
                        <Section title="Khóa học">
                            <Courses courses={courses} />
                        </Section>
                    )}

                    {visibleSections.includes("blogs") && (
                        <Section title="Blog nổi bật">
                            <Blogs blogs={blogs} />
                        </Section>
                    )}

                    {visibleSections.includes("coders") && (
                        <Section title="Top Coders">
                            <CodersRanking coders={coders} />
                        </Section>
                    )}

                    {visibleSections.includes("problems") && (
                        <Section title="Bài tập gần đây">
                            <Problems problems={problems} />
                        </Section>
                    )}

                    {visibleSections.includes("lessons") && (
                        <Section title="Bài giảng">
                            <Lessons lessons={lessons} />
                        </Section>
                    )}

                    {visibleSections.includes("topCourses") && (
                        <Section title="Top khóa học theo lượt đăng ký">
                            <TopCourseEnrolls courses={topCourseEnrolls} />
                        </Section>
                    )}

                    {visibleSections.includes("topBlogs") && (
                        <Section title="Top blog theo lượt xem">
                            <TopBlogViewers blogs={topBlogViews} />
                        </Section>
                    )}

                    {visibleSections.includes("topics") && (
                        <Section title="Chủ đề nổi bật">
                            <Topics topics={topics} />
                        </Section>
                    )}
                </Suspense>
            </Container>
        </ScrollToTop >
    );
};

export default MainDashBoard;
