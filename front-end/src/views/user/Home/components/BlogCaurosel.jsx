import React from 'react';
import Slider from "react-slick";
import { Box, Text, Tooltip, Button, Spinner, Center, Image, Flex } from '@chakra-ui/react';
import { toSlug, LimitText, formatViewCount } from '@/utils/utils';
import sanitizeHtml from '@/utils/sanitizedHTML';
import { useNavigate } from 'react-router-dom';
import InfoBlog from '../../Blog/components/InfoBlog';

const BlogCaurosel = ({ blogs, loading }) => {
    const navigate = useNavigate();

    if (loading) {
        return (
            <Center p={4}>
                <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
            </Center>
        );
    }

    if (!Array.isArray(blogs) || blogs.length === 0) {
        return (
            <Box p={4}>
                <Text>Không có blog nào để hiển thị.</Text>
            </Box>
        );
    }

    return (
        <Slider
            infinite={true}
            speed={500}
            slidesToShow={1}
            slidesToScroll={1}
            autoplay={true}
            autoplaySpeed={5000}
            arrows={false}
        >
            {blogs.map((blog) => {
                const {
                    blogID,
                    title = '',
                    content = '',
                    coderID,
                    coderName = '',
                    blogDate,
                    viewCount = 0,
                    imageBlogUrl = '',
                } = blog;

                return (
                    <Flex
                        key={`blog-${blogID}`}
                        borderRadius="md"
                        flexDirection={{ base: "column", md: "row" }}
                        minH="420px"
                        overflow="hidden"
                    >
                        <Box flex={{ base: "unset", md: "0.5" }} mr={{ base: 0, md: 4 }} mb={{ base: 3, md: 0 }}>
                            <Image
                                size="md"
                                name={title || "Không có ảnh"}
                                src={imageBlogUrl || "./avatarSimmmple.png"}
                                minW="100%"
                                maxH={{ base: "30vh", md: "30vh" }}
                                objectFit="cover"
                                alt={title || "Không có ảnh"}
                                fallbackSrc="./avatarSimmmple.png"
                                borderRadius="md"
                                loading="lazy"
                            />
                        </Box>

                        <Box flex={{ base: "unset", md: "0.5" }} mt={{ base: 3, md: 5 }} display="flex" flexDirection="column" justifyContent="space-between">
                            <Box>
                                <Tooltip label={title} hasArrow placement="top">
                                    <Button
                                        variant="link"
                                        colorScheme="black"
                                        onClick={() => navigate(`/blogs/${toSlug(title)}-${blogID}`)}
                                        fontSize={{ base: "md", md: "lg" }}
                                        fontWeight="bold"
                                        mb={1}
                                        whiteSpace="normal"
                                        textAlign="left"
                                    >
                                        {title.replace(/<[^>]*>/g, "").slice(0, 30)}...
                                    </Button>
                                </Tooltip>

                                <Box fontSize={{ base: "sm", md: "md" }} color="gray.600" mt={2} wordBreak="break-word"
                                    overflow="hidden">
                                    <Text noOfLines={3}>
                                        {sanitizeHtml(content).replace(/<[^>]*>/g, '').slice(0, 200)}
                                    </Text>
                                </Box>
                            </Box>

                            <InfoBlog
                                id={coderID}
                                coderName={LimitText(coderName, 15)}
                                date={blogDate}
                                view={formatViewCount(viewCount)}
                                mt={4}
                            />
                        </Box>
                    </Flex>
                );
            })}
        </Slider>
    );
};

export default BlogCaurosel;
