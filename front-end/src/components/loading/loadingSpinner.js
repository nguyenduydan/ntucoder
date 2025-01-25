import React from 'react';
import { Spinner, Center, Text } from '@chakra-ui/react';

const Loading = ({ message = "Đang tải dữ liệu..." }) => {
    return (
        <Center>
            <Spinner size="xl" color="teal.500" />
            <Text mt={4} fontSize="lg" color="black">
                {message}
            </Text>
        </Center>
    );
};
export default Loading;
