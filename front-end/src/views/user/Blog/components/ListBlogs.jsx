import React, { useState } from 'react';
import { Box, Text, Stack, Flex, Spinner, Heading, Image, Button } from '@chakra-ui/react';
import { LimitText, toSlug, formatViewCount } from '@/utils/utils';
import InfoBlog from './InfoBlog';
import sanitizeHtml from '@/utils/sanitizedHTML';
import { useNavigate } from 'react-router-dom';

const ListBlogs = ({ blogs, loading, limitContent = 300, limitTitle = 100, limitCoderName = 30, limitNumber = 10 }) => {
    const navigate = useNavigate();

    return (
        <Box>
            {loading ? (
                <Flex justify="center" align="center" h="50vh" bg="white">
                    <Spinner />
                </Flex>
            ) : blogs.length === 0 ? (
                <Box minH="30vh" display="flex" justifyContent="center" bg="white" boxShadow="md" rounded="md" alignItems="center">
                    <Text>Chưa có bài viết nào.</Text>
                </Box>
            ) : (
                <Stack spacing={4}>
                    {blogs.map((blog) => (
                        <Flex
                            key={blog.blogID}
                            p={3}
                            borderRadius="md"
                            bg="white"
                            boxShadow="md"
                        >
                            <Box flex="0.3" mr={4} display={{ base: 'none', md: 'block' }}>
                                <Image
                                    size="md"
                                    name={blog.title || blog.Title || 'Không có ảnh'}
                                    src={blog.imageBlogUrl || './avatarSimmmple.png'}
                                    w="100%"
                                    maxH="20vh"
                                    objectFit="cover"
                                    alt={blog.title || blog.Title || 'Không có ảnh'}
                                    borderRadius="md"
                                    loading="lazy"
                                />
                            </Box>
                            <Box flex="1">
                                <Button variant="link" colorScheme='black' onClick={() => navigate(`/blogs/${toSlug(blog.title || blog.Title)}-${blog.blogID}`)}>
                                    <Text fontWeight="bold" mb={1}>
                                        {LimitText(blog.title, limitTitle)}
                                    </Text>
                                </Button>
                                <Text fontSize="sm" color="gray.600">
                                    {sanitizeHtml(blog.content).replace(/<[^>]*>/g, '').slice(0, limitContent)}...
                                </Text>
                                <InfoBlog
                                    id={blog.coderID || blog.CoderID}
                                    coderName={LimitText(blog.coderName, limitCoderName)}
                                    date={blog.blogDate || blog.BlogDate}
                                    view={formatViewCount(blog.viewCount || blog.ViewCount)}
                                />
                            </Box>
                        </Flex>
                    ))}
                </Stack>
            )}
        </Box>
    );
};

export default ListBlogs;
