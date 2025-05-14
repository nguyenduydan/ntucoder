import {
    Box,
    Text,
    Grid,
    GridItem,
    Divider,
    Flex,
    Tooltip,
    Button,
    useDisclosure
} from '@chakra-ui/react';
import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from 'contexts/AuthContext';
import { FaRegUser, FaMailBulk, FaPhone, FaCheckCircle, FaCalendar } from "react-icons/fa";
import { PiWarningCircle } from "react-icons/pi";
import { getDetail } from 'config/apiService';
import { useTitle } from 'contexts/TitleContext';
import CourseLearning from './components/CourseLearning';
import { formatDate } from 'utils/utils';
import { MdEdit } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import AvatarLoadest from 'components/fields/Avatar';
import UpdateModal from './components/UpdateModal';

const Profile = () => {
    useTitle("Hồ sơ cá nhân");
    const { id } = useParams();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { coder } = useAuth();
    const { coderID } = coder || {};
    const [info, setInfo] = useState({});


    const fetchData = useCallback(async () => {
        try {
            const targetID = id || coderID;
            const res = await getDetail({ controller: "Coder", id: targetID });
            if (res) setInfo(res);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, [id, coderID]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    const isCoderNameValid = !!info?.coderName;
    const isEmailValid = !!info?.coderEmail;
    const isPhoneValid = !!info?.phoneNumber;

    return (
        <Box maxW="180vh" minH="100vh" mx="auto">
            <Box h="10vh"></Box>
            <Grid templateColumns={{ base: "1fr", md: "0.6fr 2fr" }} gap={4} mx={5} p={4}>
                {/* Avatar and menu */}
                <GridItem
                    bgGradient="linear(to-b, blue.600, blue.300)"
                    p={4}
                    borderRadius="md"
                    color="black"
                    display="flex"
                    flexDirection="column"
                    alignItems="left"
                    boxShadow="md"
                >
                    <Flex flexDirection="column" alignItems="center">
                        <AvatarLoadest
                            size="2xl"
                            name="Coder Name"
                            src={info.avatar}
                            alt="Coder Avatar"
                            mb={4}
                            border="4px solid white"
                        />
                        <Text fontSize="2xl" mb={2} color="white" fontWeight="bold">
                            {info?.coderName || "Coder Name"}
                        </Text>
                        {(coderID && !id) && (
                            <Box>
                                <Button
                                    bg="blue"
                                    color="white"
                                    size="md"
                                    _hover={{ bg: "blue.500" }}
                                    rightIcon={<MdEdit />}
                                    onClick={onOpen}
                                >
                                    Chỉnh sửa thông tin
                                </Button>

                                <UpdateModal
                                    coderID={coderID}
                                    isOpen={isOpen}
                                    onClose={onClose}
                                    onUpdated={fetchData}
                                />
                            </Box>
                        )}
                    </Flex>
                    <Divider my={2} />
                    <Box textColor="white">
                        <Text fontSize="xl" mt={2} textTransform="uppercase" fontWeight="bold">
                            Thông tin
                        </Text>

                        <Flex flexDirection="column" gap={2}>
                            {/* User Name */}
                            <Flex align="center" mt={2} mr={2} justify="space-between">
                                <Flex align="center">
                                    <FaRegUser style={{ marginRight: "8px" }} />
                                    <Tooltip placement='top' label={info?.coderName ? info?.coderName : "Không có thông tin"} hasArrow fontSize="md">
                                        <Text fontSize="md" >
                                            {info?.coderName || ""}
                                        </Text>
                                    </Tooltip>
                                </Flex>
                                <Flex>
                                    <Tooltip
                                        placement="top"
                                        label={isCoderNameValid ? "Đã xác thực" : "Chưa xác thực"}
                                    >
                                        <Flex align="center">
                                            {isCoderNameValid ? (
                                                <FaCheckCircle
                                                    cursor="pointer"  // Sử dụng cursor pointer cho dấu tích xanh
                                                    style={{ color: "green", fontSize: "18px" }}
                                                />
                                            ) : (
                                                <PiWarningCircle
                                                    cursor="pointer"  // Sử dụng cursor pointer cho dấu chấm than đỏ
                                                    style={{ color: "red", fontSize: "18px" }}
                                                />
                                            )}
                                        </Flex>
                                    </Tooltip>
                                </Flex>
                            </Flex>

                            {/* Email */}
                            <Flex align="center" mt={2} mr={2} justify="space-between">
                                <Flex align="center">
                                    <FaMailBulk style={{ marginRight: "8px" }} />
                                    <Tooltip placement='top' label={info?.coderEmail || "Không có thông tin"} hasArrow fontSize="md">
                                        <Text fontSize="md" >
                                            {info?.coderEmail || ""}
                                        </Text>
                                    </Tooltip>
                                </Flex>
                                <Flex>
                                    <Tooltip
                                        placement="top"
                                        label={isEmailValid ? "Đã xác thực" : "Chưa xác thực"}

                                    >
                                        <Flex align="center">
                                            {isEmailValid ? (
                                                <FaCheckCircle
                                                    cursor="pointer"  // Sử dụng cursor pointer cho dấu tích xanh
                                                    style={{ color: "green", fontSize: "18px" }}
                                                />
                                            ) : (
                                                <PiWarningCircle
                                                    cursor="pointer"  // Sử dụng cursor pointer cho dấu chấm than đỏ
                                                    style={{ color: "red", fontSize: "18px" }}
                                                />
                                            )}
                                        </Flex>
                                    </Tooltip>
                                </Flex>
                            </Flex>

                            {/* Phone */}
                            <Flex align="center" mt={2} mr={2} justify="space-between">
                                <Flex align="center">
                                    <FaPhone style={{ marginRight: "8px" }} />
                                    <Tooltip placement='top' label={info?.phoneNumber || "Không có thông tin"} hasArrow fontSize="md">
                                        <Text fontSize="md" >
                                            {info?.phoneNumber || ""}
                                        </Text>
                                    </Tooltip>
                                </Flex>
                                <Flex>
                                    <Tooltip
                                        placement="top"
                                        label={isPhoneValid ? "Đã xác thực" : "Chưa xác thực"}

                                    >
                                        <Flex align="center">
                                            {isPhoneValid ? (
                                                <FaCheckCircle
                                                    cursor="pointer"  // Sử dụng cursor pointer cho dấu tích xanh
                                                    style={{ color: "green", fontSize: "18px" }}
                                                />
                                            ) : (
                                                <PiWarningCircle
                                                    cursor="pointer"  // Sử dụng cursor pointer cho dấu chấm than đỏ
                                                    style={{ color: "red", fontSize: "18px" }}
                                                />
                                            )}
                                        </Flex>
                                    </Tooltip>
                                </Flex>
                            </Flex>
                            <Flex align="center" mt={2} mr={2} justify="space-between">
                                <Flex align="center">
                                    <FaCalendar style={{ marginRight: "8px" }} />
                                    <Text fontSize="md" >
                                        {info.birthDay ? formatDate(info.birthDay) : ""}
                                    </Text>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Box>
                    <Divider my={2} />
                    {/* Giới thiệu */}
                    <Box textColor="white" minH="10vh">
                        <Text fontSize="xl" mt={2} textTransform="uppercase" fontWeight="bold">
                            Giới thiệu
                        </Text>
                        <Text fontSize="md" mt={2}>
                            {info?.description || ""}
                        </Text>
                    </Box>
                </GridItem>

                {/* Personal information */}
                <GridItem
                    bg="white"
                    borderRadius="md"
                    boxShadow="md"
                >
                    {/* Course learning */}
                    <CourseLearning coderID={coderID} />
                </GridItem>
            </Grid>
        </Box >
    );
};

export default Profile;
