import { Flex, Text, Button, Badge, Icon } from "@chakra-ui/react";
import { FaRegEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { formatDate, formatNumber } from "@/utils/utils";

const InfoBlog = ({ id, coderName, date, view }) => {
    const navigate = useNavigate();

    return (
        <Flex mt={5} align="center" alignItems="center" gap={2} wrap="wrap">
            <Button variant="link" colorScheme='blue' onClick={() => navigate(`/profile/${id}`)}>
                <Text fontSize="sm" fontWeight="bold">{coderName}</Text>
            </Button>
            |
            <Text fontSize="sm" color="gray.500">
                {formatDate(date)}
            </Text>
            |
            <Badge colorScheme="blue" display="flex" alignItems="center" fontSize="0.75rem" px={2}>
                <Icon as={FaRegEye} mr={1} />
                {formatNumber(view)} lượt xem
            </Badge>
        </Flex>
    );
};

export default InfoBlog;
