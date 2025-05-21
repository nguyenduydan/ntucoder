import sanitizeHtml from "@/utils/sanitizedHTML";
import {
    Box,
    Divider, Flex, Icon, Text
}
    from "@chakra-ui/react";
import { useTitle } from "@/contexts/TitleContext";
import { useAuth } from "@/contexts/AuthContext";
import AvatarLoadest from "@/components/fields/Avatar";
import { NavLink } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

export default function LessonContent({ lesson }) {
    // Set title for the page
    useTitle(lesson?.lessonTitle || "Nội dung bài học");
    const { coder } = useAuth();

    // console.log(coder);

    return (
        <Box px={4} py={5}>
            {/* Thông tin về bài học */}
            <Flex px={5} alignItems="center" gap={4} justifyContent="space-between">
                <Flex flex="1" alignItems="center" gap={4}>
                    <AvatarLoadest
                        size="md"
                        src={coder?.avatar || ""}
                        alt="Coder Avatar"
                        borderRadius="full"
                        boxSize="50px"
                        objectFit="cover"
                        loading="lazy"
                    />
                    <NavLink to={`/profile/${coder?.coderID}`}>
                        <Text maxW="200px" _hover={{ color: "blue" }} fontWeight="bold">{(coder?.coderName || 'Ẩn danh').replace(/(.{3}).*(@.*)/, "$1******$2")}</Text>
                    </NavLink>
                </Flex>
                <Flex alignItems="center" >
                    <Icon as={FaHeart} color="red" />
                    <Text ms={1} fontWeight="bold" fontSize="lg"> 100 điểm</Text>
                </Flex>
            </Flex>
            <Divider my={4} />
            <Box sx={{ wordBreak: "break-word" }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(lesson?.lessonContent) }} />
        </Box>
    );
}
