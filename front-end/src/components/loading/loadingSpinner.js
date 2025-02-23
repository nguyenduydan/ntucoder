import React from 'react';
import { Image, Flex, Text, useColorMode } from '@chakra-ui/react';
import loadingGif from '../../assets/img/loading.gif';
const Loading = ({
    message = "Đang tải dữ liệu...",
    gifUrl = loadingGif,
}) => {
    const { colorMode } = useColorMode();
    const textColor = colorMode === 'light' ? 'black' : 'white';

    return (
        <Flex direction="column" justify="center" align="center" height="100vh">
            <Image src={gifUrl} alt="Loading..." />
            <Text mt={4} fontSize="lg" fontWeight={"bold"} color={textColor}>
                {message}
            </Text>
        </Flex>
    );
};

export default Loading;
