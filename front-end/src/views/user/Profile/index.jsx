import {
    Box,
    Text,
    Grid,
    GridItem,
    Avatar,
    Divider,
    Flex,
    Tooltip

} from '@chakra-ui/react';
import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from 'contexts/AuthContext';
import { FaRegUser, FaMailBulk, FaPhone, FaCheckCircle } from "react-icons/fa";
import { PiWarningCircle } from "react-icons/pi";
import { getDetail } from 'config/apiService';
import { useTitle } from 'contexts/TitleContext';
import CourseLearning from './components/CourseLearning';

const Profile = () => {
    useTitle("Hồ sơ");
    const { coder } = useAuth();
    const { avatar, coderName, coderID } = coder || {};
    const avatarSrc = avatar || "https://bit.ly/broken-link";
    const [info, setInfo] = useState({});


    const fetchData = useCallback(async () => {
        try {
            const res = await getDetail({ controller: "Coder", id: coderID });
            if (res) setInfo(res);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, [coderID]);

    useEffect(() => {
        if (coderID) fetchData();
    }, [coderID, fetchData]);

    const isCoderNameValid = !!coderName;
    const isEmailValid = !!info?.coderEmail;
    const isPhoneValid = !!info?.phoneNumber;

    return (
        <Box maxW="180vh" minH="100vh" mx="auto">
            <Box h="10vh"></Box>
            <Grid templateColumns={{ base: "1fr", md: "0.6fr 2fr" }} gap={4} mx={5} p={4}>
                {/* Avatar and menu */}
                <GridItem
                    bgGradient="linear(to-b, blue.500, blue.200)"
                    p={4}
                    borderRadius="md"
                    color="black"
                    display="flex"
                    flexDirection="column"
                    alignItems="left"
                    boxShadow="md"
                >
                    <Flex flexDirection="column" alignItems="center">
                        <Avatar
                            size="2xl"
                            name="Coder Name"
                            src={avatarSrc}
                            alt="Coder Avatar"
                            mb={4}
                            border="4px solid white"
                            boxShadow="0 0 10px rgb(9, 9, 238), 0 0 20px rgb(0, 242, 255)"
                        />
                        <Text fontSize="2xl" mb={2} color="white" fontWeight="bold">
                            {coderName || "Coder Name"}
                        </Text>
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
                                    <Tooltip placement='top' label={coderName ? coderName : "Không có thông tin"} hasArrow fontSize="md">
                                        <Text fontSize="md" >
                                            {coderName || ""}
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
                        </Flex>
                    </Box>
                </GridItem>

                {/* Personal information */}
                <GridItem
                    bg="white"
                    borderRadius="md"
                    px={5}
                    py={3}
                    boxShadow="md"
                >
                    <Text fontSize="xl" color="blue.600" fontWeight="bold">
                        Khóa học đã đăng ký
                    </Text>
                    <Divider w="50px" h="3px" bg="blue" />
                    <CourseLearning coderID={coderID} />
                </GridItem>
            </Grid>
        </Box >
    );
};

export default Profile;
