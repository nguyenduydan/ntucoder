import React from 'react';
import { Spinner, Center, Text, useColorMode } from '@chakra-ui/react';


const Loading = ({ message = "Đang tải dữ liệu..." }) => {
    const { colorMode } = useColorMode(); // Lấy trạng thái chế độ màu
    const textColor = colorMode === 'light' ? 'black' : 'white'; // Đổi màu text
    return (
        <Center>
            <Spinner size="xl" color="teal.500" />
            <Text mt={4} ml={2} fontSize="lg" color={textColor}>
                {message}
            </Text>
        </Center>
    );
};
export default Loading;
