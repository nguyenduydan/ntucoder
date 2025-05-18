import React, { useEffect, useRef } from 'react';
import Slider from 'react-slick';
import { Box } from '@chakra-ui/react';
import CourseCard from './CourseCard';


const CourseCarousel = ({ courses = [], slidesToShow = 3, activeTabIndex }) => {
    const sliderRef = useRef(null);

    useEffect(() => {
        // Khi activeTabIndex thay đổi, reset position slider
        if (sliderRef.current) {
            sliderRef.current.slickGoTo(0); // về slide đầu
            sliderRef.current.slickSetPosition(); // cập nhật layout
        }
    }, [activeTabIndex]);

    if (courses.length === 0) {
        return <Box textAlign="center" fontSize="xl" my={5} minW="900px">Không có khóa học nào.</Box>;
    }

    if (courses.length <= slidesToShow) {
        return (
            <Box display="flex" gap={6} px={4} flexWrap="nowrap" overflowX="auto" minW="900px">
                {courses.map(course => (
                    <Box key={course.courseID} flex="1" maxW="350px">
                        <CourseCard course={course} />
                    </Box>
                ))}
            </Box>
        );
    }

    const settings = {
        dots: false,
        infinite: false,
        speed: 300,
        slidesToShow: slidesToShow,
        slidesToScroll: 3,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <Box mx="auto" overflow="hidden" width="900px" position="relative" minH="200px">
            <Slider {...settings}>
                {courses.map(course => (
                    <Box key={course.courseID} px={2}>
                        <CourseCard course={course} />
                    </Box>
                ))}
            </Slider>
        </Box>
    );
};

export default CourseCarousel;
