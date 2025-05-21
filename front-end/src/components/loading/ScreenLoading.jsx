import { Flex, Spinner, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionFlex = motion(Flex);

const LoadingScreen = () => {
    return (
        <Flex justify="center" align="center" h="100vh" bg="white">
            <Spinner thickness="5px" speed="0.35s" color="blue.500" size="xl" />
        </Flex>
    );
};

export default LoadingScreen;
