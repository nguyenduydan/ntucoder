import { Box, VStack, Text, Link } from "@chakra-ui/react";

const Sidebar = () => {
    return (
        <Box w="250px" p={4} borderLeft="1px solid gray">
            <Text fontWeight="bold" mb={2}>Kỳ thi đang diễn ra & sắp tới</Text>
            <VStack align="start" spacing={2}>
                <Link color="red.500">guangkhai1910</Link>
                <Text fontSize="sm" color="red.400">Trước khi kết thúc 00:00:00</Text>
                <Link color="red.500">8b1191024</Link>
                <Text fontSize="sm" color="red.400">Trước khi kết thúc 00:00:00</Text>
            </VStack>
        </Box>
    );
};

export default Sidebar;
