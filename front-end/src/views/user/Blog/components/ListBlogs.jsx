import React from 'react';
import { Box, Text, Stack, Flex, Spinner, Heading, Image, Button } from '@chakra-ui/react';
import { toSlug } from '@/utils/utils';
import InfoBlog from './InfoBlog';
import sanitizeHtml from '@/utils/sanitizedHTML';
import { useNavigate } from 'react-router-dom';

const ListBlogs = ({ blogs, loading }) => {
    const navigate = useNavigate();
    return (
        <Box p={6} >
            <Heading fontSize="xl" fontWeight="bold" mb={4} textTransform="uppercase">
                Các bài viết trước đó
            </Heading>
            {loading ? (
                <Flex justify="center" align="center" height="80vh">
                    <Spinner />
                </Flex>
            ) : blogs.length === 0 ? (
                <Text textAlign="center" color="gray.500">
                    Không có bài viết nào khác.
                </Text>
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
                            <Box flex="0.3" mr={4}>
                                <Image
                                    size="md"
                                    name={blog.title || blog.Title || 'Không có ảnh'}
                                    src={blog.imageBlogUrl || './avatarSimmmple.png'}
                                    w="100%"
                                    maxH="20vh"
                                    objectFit="cover"
                                    alt={blog.title || blog.Title || 'Không có ảnh'}
                                    fallbackSrc="./avatarSimmmple.png"
                                    fallback={true}
                                    borderRadius="md"
                                />
                            </Box>
                            <Box flex="1">
                                <Button variant="link" colorScheme='black' onClick={() => navigate(`/blogs/${toSlug(blog.title || blog.Title)}-${blog.blogID}`)}>
                                    <Text fontWeight="bold" mb={1}>
                                        {blog.title}
                                    </Text>
                                </Button>
                                <Text fontSize="sm" color="gray.600">
                                    {sanitizeHtml(blog.content).replace(/<[^>]*>/g, '').slice(0, 250)}...
                                </Text>
                                <InfoBlog
                                    id={blog.coderID || blog.CoderID}
                                    coderName={blog.coderName || blog.CoderName || blog.author || 'Người dùng'}
                                    date={blog.blogDate || blog.BlogDate}
                                    view={blog.viewCount || blog.ViewCount || 0}
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
