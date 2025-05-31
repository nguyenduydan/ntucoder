import React from "react";
import { SimpleGrid, Box, Heading, Text } from "@chakra-ui/react";
import Counter from "components/animate/Count";

const statsData = [
    { value: 10000, label: "Học viên", suffix: "+" },
    { value: 300, label: "Khóa học", suffix: "+" },
    { value: 95, label: "Hài lòng", suffix: "%" },
    { value: 50, label: "Giảng viên", suffix: "+" }
];

const StatsSection = React.memo(() => (
    <SimpleGrid
        columns={{ base: 2, md: 4 }}
        spacing={2}
        mt={10}
        py={10}
        mb={10}
        mx="auto"
        maxW="container.xl"
        alignItems="center"
        align="center"
        justifyContent="center"
    >
        {statsData.map((stat, index) => (
            <Box key={index} textAlign="center">
                <Heading fontSize="3rem" color="blue.500">
                    <Counter to={stat.value} />{stat.suffix}
                </Heading>
                <Text fontSize="xl">{stat.label}</Text>
            </Box>
        ))}
    </SimpleGrid>
));

StatsSection.displayName = 'StatsSection';
export default StatsSection;
