import React from 'react';
import {
    Box,
    Text,
    Flex,
    Tooltip,
    Icon
} from '@chakra-ui/react';
import { FaRegUser, FaMailBulk, FaPhone, FaCheckCircle, FaCalendar } from "react-icons/fa";
import { PiWarningCircle } from "react-icons/pi";
import { formatDate, maskEmail } from '@/utils/utils';

const BasicInfo = ({ info, isCoderNameValid, isEmailValid, isPhoneValid, isAllowShow }) => {
    return (
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
                                    <Icon
                                        as={FaCheckCircle}
                                        color="green.300"
                                        boxSize={5}
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
                        <FaMailBulk style={{ marginRight: "4px" }} />
                        <Tooltip placement="top" label={maskEmail(info?.coderEmail) || "Không có thông tin"} hasArrow fontSize="md">
                            <Text fontSize="md">
                                {maskEmail(info?.coderEmail)}
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
                                    <Icon
                                        as={FaCheckCircle}
                                        color="green.300"
                                        boxSize={5}
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
                {isAllowShow && (
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
                                        <Icon
                                            as={FaCheckCircle}
                                            color="green.300"
                                            boxSize={5}
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
                )}
                {/* Ngày sinh */}
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
    );
};

export default BasicInfo;
