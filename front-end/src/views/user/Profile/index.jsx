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
    Spinner,
    Skeleton
} from '@chakra-ui/react';
import React, { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getDetail, updateItem } from '@/config/apiService';
import { useTitle } from '@/contexts/TitleContext';
import { useParams } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import ScrollToTop from '@/components/scroll/ScrollToTop';

import ProfileHeader from './components/ProfileHeader';
import BasicInfo from './components/BasicInfo';

const CourseBox = lazy(() => import('./components/CourseLearning'));
const BlogBox = lazy(() => import('./components/BlogBox'));
const ActionBox = lazy(() => import('./components/ActionBox'));
const HistoryBox = lazy(() => import('./components/HistorySubmission'));


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
        <ScrollToTop>
            <Box maxW="180vh" minH="100vh" mx="auto" mb={5}>
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
                <Grid templateColumns={{ base: "1fr", md: "1fr 2fr" }} gap={4} mx={5} p={4}>
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
                        maxW="345px"
                    >
                        <ProfileHeader
                            info={info}
                            isAllowShow={isAllowShow}
                            isOpen={isOpen}
                            onOpen={onOpen}
                            onClose={onClose}
                            fetchData={fetchData}
                            coderID={coderID}
                        />
                        <Divider my={2} />
                        {/* Thông tin cơ bản */}
                        <BasicInfo
                            info={info}
                            isCoderNameValid={isCoderNameValid}
                            isAllowShow={isAllowShow}
                            isEmailValid={isEmailValid}
                            isPhoneValid={isPhoneValid} />
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
                    <GridItem minW="980px">
                        {/* Course learning */}
                        <Suspense fallback={<Skeleton height="393px" w="100%" />}>
                            <CourseBox coderID={id || coderID} />
                        </Suspense>
                        <Grid
                            templateColumns={{ base: "1fr", md: "1fr 0.7fr" }}
                            gap={4}
                            h="75vh"
                            mt={5}
                        >
                            <GridItem overflow="hidden">
                                <Suspense fallback={<Skeleton height="100%" w="100%" />}>
                                    <BlogBox coderID={id || coderID} />
                                </Suspense>
                            </GridItem>
                            <GridItem overflow="hidden">
                                <Suspense fallback={<Skeleton height="100%" w="100%" />}>
                                    <ActionBox coderID={id || coderID} />
                                </Suspense>
                            </GridItem>
                        </Grid>
                        <GridItem mt={5} overflow="hidden">
                            <Suspense fallback={<Skeleton height="393px" w="100%" />}>
                                <HistoryBox coderId={id || coderID} />
                            </Suspense>
                        </GridItem>

                    </GridItem>
                </Grid>
            </Box >
        </ScrollToTop>
    );
};

export default Profile;
