import React from 'react';
import { ListItem, Text, Box } from '@chakra-ui/react';
import { NavLink, useLocation } from 'react-router-dom';

const LessonItem = ({ lesson, isLoggedIn, isEnrolled, toast }) => {
    const location = useLocation();
    const key = lesson.lessonID || Math.random();

    const LessonContent = (
        <ListItem
            cursor="pointer"
            _hover={{ bg: "gray.300", transform: "scale(1.01)" }}
            transition="all .2s ease-in-out"
            pl={2}
            bg="gray.50"
            borderRadius="sm"
            p={2}
            onClick={() => {
                if (!isLoggedIn) {
                    toast({
                        title: "Bạn cần đăng nhập để truy cập trang này.",
                        status: "warning",
                        duration: 2000,
                        isClosable: true,
                        position: "top",
                        variant: "top-accent",
                    });
                }
            }}
        >
            <Text fontSize="md">📚 {lesson.lessonTitle || "Không có tên bài học"}</Text>
        </ListItem>
    );

    // Nếu chưa enroll hoặc chưa đăng nhập
    if (!isEnrolled || !isLoggedIn) {
        return (
            <Box key={key}>
                <Box cursor={!isEnrolled ? "default" : "pointer"}>
                    {LessonContent}
                </Box>
            </Box>
        );
    }

    // Nếu đã đăng nhập và đã enroll
    return (
        <Box key={key}>
            <NavLink
                to={`${location.pathname}/${lesson.lessonID}`}
                style={({ isActive }) => ({
                    textDecoration: 'none',
                    color: isActive ? 'blue.500' : 'inherit',
                })}
            >
                {LessonContent}
            </NavLink>
        </Box>
    );
};

export default React.memo(LessonItem);
