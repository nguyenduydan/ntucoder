import sanitizeHtml from "@/utils/sanitizedHTML";
import { Box } from "@chakra-ui/react";
import { useTitle } from "@/contexts/TitleContext";

export default function LessonContent({ lesson }) {
    // Set title for the page
    useTitle(lesson?.lessonTitle || "Nội dung bài học");
    return (
        <Box sx={{ wordBreak: "break-word" }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(lesson?.lessonContent) }} />
    );
}
