import React from 'react';
import { Flex, Image } from '@chakra-ui/react';
import NodataPng from "assets/img/nodata.png";

const NotFound = () => {
    return (
        <Flex justify="center" align="center" height="100%">
            <Image
                src={NodataPng}
                alt="Không có dữ liệu"
                h="50%"
                objectFit="contain"
                backgroundColor="transparent"
            />
        </Flex>
    );
};

export default NotFound;
