import DOMPurify from "dompurify";
import { Box } from "@chakra-ui/react";

export default function LessonConten({ lesson }) {
    return (
        <Box
            dangerouslySetInnerHTML={{
                __html: lesson ? DOMPurify.sanitize(lesson.lessonContent || "Chưa có thông tin", {
                    ALLOWED_TAGS: ['*', 'iframe', 'img', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'br', 'strong', 'em', 'b', 'i', 'u'],
                    ALLOWED_ATTR: ['src', 'width', 'height', 'frameborder', 'allowfullscreen', 'style'],
                }) : "Chưa có thông tin",
            }}
        />
    );
}
