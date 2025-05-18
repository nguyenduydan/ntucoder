import React from 'react';
import { Box, Spinner, Stack, Flex, Text, Button, Image, Tooltip } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { toSlug } from '@/utils/utils';
import sanitizeHtml from '@/utils/sanitizedHTML';
import InfoBlog from './InfoBlog';

const BlogTopViews = ({ blogs = [], loading }) => {
    const navigate = useNavigate();

    return (
        <Box>
            <Stack spacing={5}>
                {loading ? (
                    <Flex justify="center" align="center" height={{ base: "50vh", md: "76vh" }} bg="white">
                        <Spinner />
                    </Flex>
                ) : blogs.length === 0 ? (
                    <Box
                        minH={{ base: "50vh", md: "76vh" }}
                        bg="white"
                        display="flex"
                        rounded="md"
                        boxShadow="md"
                        justifyContent="center"
                        alignItems="center"
                        px={4}
                        textAlign="center"
                    >
                        <Text>Chưa có bài viết nào.</Text>
                    </Box>
                ) : (
                    blogs.map((item) => (
                        <Flex
                            key={item.blogID}
                            p={{ base: 2, md: 3 }}
                            borderRadius="md"
                            bg="white"
                            boxShadow="md"
                            flexDirection={{ base: "column", md: "row" }}
                        >
                            <Box flex={{ base: "unset", md: "0.6" }} mr={{ base: 0, md: 4 }} mb={{ base: 3, md: 0 }}>
                                <Image
                                    size="md"
                                    name={item.title || item.Title || "Không có ảnh"}
                                    src={item.imageBlogUrl || "./avatarSimmmple.png"}
                                    w="100%"
                                    maxH={{ base: "30vh", md: "22vh" }}
                                    objectFit="cover"
                                    alt={item.title || item.Title || "Không có ảnh"}
                                    fallbackSrc="./avatarSimmmple.png"
                                    borderRadius="md"
                                />
                            </Box>
                            <Box flex="1" mt={{ base: 0, md: 3 }}>
                                <Button
                                    variant="link"
                                    colorScheme="black"
                                    onClick={() => navigate(`/blogs/${toSlug(item.title || item.Title)}-${item.blogID}`)}
                                    fontSize={{ base: "md", md: "lg" }}
                                >
                                    <Tooltip label={item.title || item.Title} hasArrow placement="top">
                                        <Text fontWeight="bold" mb={1}>
                                            {(item.title).replace(/<[^>]*>/g, "").slice(0, 30)}...
                                        </Text>
                                    </Tooltip>
                                </Button>
                                <Text fontSize={{ base: "sm", md: "md" }} color="gray.600" noOfLines={5}>
                                    {sanitizeHtml(item.content).replace(/<[^>]*>/g, "").slice(0, 150)}...
                                </Text>
                                <InfoBlog
                                    id={item.coderID || item.CoderID}
                                    coderName={item.coderName || item.CoderName || item.author || "Người dùng"}
                                    date={item.blogDate || item.BlogDate}
                                    view={item.viewCount || item.ViewCount || 0}
                                />
                            </Box>
                        </Flex>
                    ))
                )}
            </Stack>
        </Box>
    );
};

export default BlogTopViews;
