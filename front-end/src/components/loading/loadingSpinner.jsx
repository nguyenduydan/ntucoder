import React from 'react';
import { Image, Flex, Box, useColorMode } from '@chakra-ui/react';
import loadingGif from '../../assets/img/loading.gif';
import AnimateText from "components/animate/AnimateText";
const Loading = ({
    message = "Đang tải dữ liệu...",
    gifUrl = loadingGif,
}) => {
    const { colorMode } = useColorMode();
    const textColor = colorMode === 'light' ? 'black' : 'white';

    return (
        <Flex direction="column" justify="center" align="center" height="100vh">
            <Image h="300px" src={gifUrl} alt="Loading..." />
            <Box fontSize="lg" fontWeight={"bold"} color={textColor}>
                <AnimateText text={message} />
            </Box>
        </Flex>
    );
};

export default Loading;
