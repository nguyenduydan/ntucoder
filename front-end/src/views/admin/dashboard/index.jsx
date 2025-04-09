import { Box, Text } from "@chakra-ui/react";
import { useTitle } from "contexts/TitleContext";

const MainDashBoard = () => {
    useTitle("Dashboard");
    return (
        <Box mt={20}>
            <Text fontSize={20}>Hello world!</Text>
        </Box>
    );
};

export default MainDashBoard;
