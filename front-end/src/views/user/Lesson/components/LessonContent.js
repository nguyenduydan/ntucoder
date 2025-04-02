import sanitizeHtml from "utils/sanitizedHTML";
import { Box } from "@chakra-ui/react";

export default function LessonContent({ lesson }) {
    return (
        <Box sx={{ wordBreak: "break-word" }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(lesson?.lessonContent) }} />
    );
}
