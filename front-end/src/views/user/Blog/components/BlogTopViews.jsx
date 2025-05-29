import React from 'react';
import { Box, Spinner, Stack, Flex, Text, Button, Image, Tooltip } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { formatNumber, LimitText, toSlug } from '@/utils/utils';
import sanitizeHtml from '@/utils/sanitizedHTML';
import InfoBlog from './InfoBlog';

const BlogTopViews = ({ blogs = [], loading, }) => {
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
                            <Box flex={{ base: "unset", md: "0.5" }} mr={{ base: 0, md: 4 }} mb={{ base: 3, md: 0 }}>
                                <Image
                                    size="md"
                                    name={item.title || item.Title || "Không có ảnh"}
                                    src={item.imageBlogUrl || "./avatarSimmmple.png"}
                                    minW={{ base: "100%", md: "300px" }}
                                    maxH={{ base: "30vh", md: "24vh" }}
                                    objectFit="cover"
                                    alt={item.title || item.Title || "Không có ảnh"}
                                    fallbackSrc="./avatarSimmmple.png"
                                    borderRadius="md"
                                    loading="lazy"
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
                                <Box fontSize={{ base: "sm", md: "md" }} color="gray.600" noOfLines={3}>
                                    <Box dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.content || item.Content).replace(/<[^>]*>/g, "") }} />
                                </Box>
                                <InfoBlog
                                    id={item.coderID || item.CoderID}
                                    coderName={LimitText(item.coderName, 15) || LimitText(item.CoderName, 15)}
                                    date={item.blogDate || item.BlogDate}
                                    view={formatNumber(item.viewCount || item.ViewCount || 0)}
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
