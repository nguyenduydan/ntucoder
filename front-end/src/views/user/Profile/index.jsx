import {
    Box,
    Text,
    Grid,
    GridItem,
    Divider,
    Flex,
    Tooltip,
    Button,
    useDisclosure,
    Textarea,
    IconButton,
    useToast,
    Icon,
    Badge
} from '@chakra-ui/react';
import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FaRegUser, FaMailBulk, FaPhone, FaCheckCircle, FaCalendar } from "react-icons/fa";
import { PiWarningCircle } from "react-icons/pi";
import { getDetail, updateItem } from '@/config/apiService';
import { useTitle } from '@/contexts/TitleContext';
import CourseLearning from './components/CourseLearning';
import { formatDate, maskEmail } from '@/utils/utils';
import { MdEdit } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import AvatarLoadest from '@/components/fields/Avatar';
import UpdateModal from './components/UpdateModal';
import { FaArrowLeft, FaEdit, FaCheck, FaTimes, FaStar } from 'react-icons/fa';


const Profile = () => {
    useTitle("Hồ sơ cá nhân");
    const { id } = useParams();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const { coder } = useAuth();
    const { coderID } = coder || {};
    const isAllowShow = coderID && !id;
    const [info, setInfo] = useState({});
    // Edit description
    const [isEditing, setIsEditing] = useState(false);
    const [description, setDescription] = useState(info?.description || "");

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

    useEffect(() => {
        if (!isEditing) {
            setDescription(info?.description || "");
        }
    }, [info?.description, isEditing]);

    const isCoderNameValid = !!info?.coderName;
    const isEmailValid = !!info?.coderEmail;
    const isPhoneValid = !!info?.phoneNumber;


    const handleEditClick = () => {
        setDescription(info?.description || "");
        setIsEditing(true);
    };

    const handleCancel = () => {
        setDescription(info?.description || "");
        setIsEditing(false);
    };

    const handleSave = async () => {
        try {
            const dataToSend = { description };

            console.log("Dữ liệu gửi lên API:", dataToSend);  // <-- kiểm tra dữ liệu gửi

            await updateItem({
                controller: 'Coder',
                id: coderID,
                data: dataToSend,
            });

            toast({
                title: 'Cập nhật thành công!',
                status: 'success',
                duration: 2000,
                isClosable: true,
                variant: 'top-accent',
                position: 'top'
            });
            setIsEditing(false);
            fetchData();
        } catch (error) {
            console.error('Lỗi khi cập nhật:', error);
            const err = error.response?.data?.message || error.message;
            toast({
                title: 'Lỗi khi cập nhật.',
                status: 'error',
                description: err,
                duration: 2000,
                isClosable: true,
                variant: 'top-accent',
                position: 'top'
            });
        }
    };


    return (
        <Box maxW="180vh" minH="100vh" mx="auto">
            <Box mt={5} ms={10}>
                <Button
                    colorScheme="blue"
                    variant="link"
                    size="md"
                    onClick={() => window.history.back()}
                    leftIcon={<FaArrowLeft />}
                    _hover={{
                        transform: "translateX(-5px)",
                    }}
                >
                    Quay lại
                </Button>
            </Box>
            <Grid templateColumns={{ base: "1fr", md: "0.6fr 2fr" }} gap={4} mx={5} p={4}>
                {/* Avatar and menu */}
                <GridItem
                    bgGradient="linear(to-b, blue.600, purple.500)"
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
                        <Text fontSize="2xl" color="white" fontWeight="bold">
                            {info?.coderName || "Coder Name"}
                        </Text>
                        <Flex
                            my={2}
                            align="center"
                            p={3}
                            borderRadius="md"
                            boxShadow="lg"
                            bgGradient="linear(to-r, #1a202c, #2d3748)"  // nền tối xám đậm
                        >
                            <Text
                                fontWeight="bold"
                                bgGradient="linear(to-r, teal.400, purple.300)"
                                bgClip="text"
                                fontSize="md"
                                userSelect="none"
                            >
                                Tổng điểm:

                            </Text>
                            <Badge colorScheme="yellow" ms={2} fontSize="md" px={3} py={1} borderRadius="md" display="flex" alignItems="center" gap={1}>
                                {info?.totalPoint || 0}
                                <Icon as={FaStar} color="yellow.500" />
                            </Badge>
                        </Flex>

                        {isAllowShow && (
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

                    {/* Thông tin cơ bản */}
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
                    <Divider my={2} />

                    {/* Giới thiệu */}
                    <Box textColor="white" minH="10vh">
                        <Text fontSize="xl" mt={2} textTransform="uppercase" fontWeight="bold">
                            Giới thiệu
                        </Text>

                        {(isEditing) ? (
                            <Box>
                                <Textarea
                                    value={description}
                                    onChange={(e) => {
                                        if (e.target.value.length <= 200) {
                                            setDescription(e.target.value);
                                        }
                                    }}
                                    maxLength={200}
                                    mt={2}
                                    placeholder="Nhập giới thiệu"
                                    bg="white"
                                    color="black"
                                    h="100px"
                                    resize="none"
                                />
                                <Flex justify="space-between" align="center" mt={1}>
                                    <Text fontSize="sm" color="white">
                                        {description.length}/200 ký tự
                                    </Text>
                                    <Flex gap={2}>
                                        <IconButton
                                            aria-label="save"
                                            icon={<FaCheck />}
                                            size="sm"
                                            colorScheme="green"
                                            onClick={handleSave}
                                        />
                                        <IconButton
                                            aria-label="cancel"
                                            icon={<FaTimes />}
                                            size="sm"
                                            colorScheme="red"
                                            onClick={handleCancel}
                                        />
                                    </Flex>
                                </Flex>
                            </Box>
                        ) : (
                            <Flex mt={2} justifyContent="space-between" alignContent="center" alignItems="center">
                                <Text w="100%" fontSize="md">{info?.description || ""}</Text>
                                {isAllowShow &&
                                    <Tooltip placement="top" label="Chỉnh sửa">
                                        <IconButton
                                            aria-label="edit"
                                            icon={<FaEdit />}
                                            size="sm"
                                            color="white"
                                            ml={2}
                                            bg="transparent"
                                            _hover={{ color: "black", bg: "gray.300" }}
                                            onClick={handleEditClick}
                                        />
                                    </Tooltip>
                                }
                            </Flex>
                        )}
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
