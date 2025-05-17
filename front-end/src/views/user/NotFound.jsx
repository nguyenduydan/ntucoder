import React from 'react';
import { Flex, Image, Text, Button, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import NodataPng from 'assets/img/nodata.png';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <Flex
            direction="column"
            align="center"
            justify="center"
            height="86vh"
            bg="gray.50"
            textAlign="center"
            px={4}
        >
            <VStack spacing={6}>
                <Image
                    src={NodataPng}
                    alt="Không tìm thấy trang"
                    maxW="300px"
                    objectFit="contain"
                />

                <Text fontSize="3xl" fontWeight="bold" color="gray.700">
                    404 - Không tìm thấy trang
                </Text>

                <Text fontSize="md" color="gray.500">
                    Có vẻ như bạn đang tìm một trang không tồn tại hoặc đã bị xóa.
                </Text>

                <Button colorScheme="teal" onClick={() => navigate('/')}>
                    Quay về trang chủ
                </Button>
            </VStack>
        </Flex>
    );
};

export default NotFound;
