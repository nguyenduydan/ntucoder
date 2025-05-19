import { Badge, Box, Button, Flex, Icon, Text } from "@chakra-ui/react";
import { MdEdit } from "react-icons/md";
import ModalEdit from "./ModalEdit";
import { FaStar } from "react-icons/fa";
import CoderAvatar from "../../Course/components/CoderAvatar";

const ProfileHeader = ({ info, isAllowShow, onOpen, isOpen, onClose, fetchData, coderID }) => {
    return (
        <Flex flexDirection="column" alignItems="center">
            <CoderAvatar size="2xl" name="Coder Name" src={info.avatar} mb={4} border="4px solid white" />
            <Text fontSize="2xl" color="white" fontWeight="bold">
                {info?.coderName || info?.coderEmail || "Coder Name"}
            </Text>
            <Flex my={2} align="center" p={3} borderRadius="md" boxShadow="lg" bgGradient="linear(to-r, #1a202c, #2d3748)">
                <Text fontWeight="bold" bgGradient="linear(to-r, teal.200, purple.300)" bgClip="text" fontSize="md">
                    Tổng điểm:
                </Text>
                <Badge colorScheme="yellow" ms={2} fontSize="md" px={3} py={1}>
                    {info?.totalPoint || 0}
                    <Icon as={FaStar} color="yellow.500" />
                </Badge>
            </Flex>
            {isAllowShow && (
                <Box>
                    <Button bg="blue" color="white" size="md" _hover={{ bg: "blue.500" }} rightIcon={<MdEdit />} onClick={onOpen}>
                        Chỉnh sửa thông tin
                    </Button>
                    <ModalEdit coderID={coderID} isOpen={isOpen} onClose={onClose} onUpdated={fetchData} />
                </Box>
            )}
        </Flex>
    );
};

export default ProfileHeader;
