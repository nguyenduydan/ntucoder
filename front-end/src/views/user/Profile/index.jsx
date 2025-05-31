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
    Skeleton,
    Container
} from '@chakra-ui/react';
import React, { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getDetail, updateItem } from '@/config/apiService';
import { useTitle } from '@/contexts/TitleContext';
import { useParams } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';

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

            console.log("Dữ liệu gửi lên API:", dataToSend);

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
        <Container maxW="full" minH="100vh" p={0}>
            {/* Back Button */}
            <Box mt={{ base: 3, md: 5 }} mx={{ base: 4, md: 10 }}>
                <Button
                    colorScheme="blue"
                    variant="link"
                    size={{ base: "sm", md: "md" }}
                    onClick={() => window.history.back()}
                    leftIcon={<FaArrowLeft />}
                    _hover={{
                        transform: "translateX(-5px)",
                    }}
                >
                    Quay lại
                </Button>
            </Box>

            {/* Main Content */}
            <Box mx={{ base: 2, sm: 4, md: 5 }} p={{ base: 2, md: 4 }} mb={5}>
                <Grid
                    templateColumns={{
                        base: "1fr",
                        lg: "minmax(300px, 400px) 1fr"
                    }}
                    gap={{ base: 4, md: 6 }}
                    alignItems="start"
                >
                    {/* Left Sidebar - Profile Info */}
                    <GridItem
                        bgGradient="linear(to-b, blue.600, purple.500)"
                        p={{ base: 3, md: 4 }}
                        borderRadius="md"
                        color="black"
                        display="flex"
                        flexDirection="column"
                        alignItems="left"
                        boxShadow="md"
                        w="full"
                        maxW={{ base: "full", lg: "400px" }}
                        mx={{ base: 0, lg: 0 }}
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

                        {/* Basic Info */}
                        <BasicInfo
                            info={info}
                            isCoderNameValid={isCoderNameValid}
                            isAllowShow={isAllowShow}
                            isEmailValid={isEmailValid}
                            isPhoneValid={isPhoneValid}
                        />
                        <Divider my={2} />

                        {/* Description Section */}
                        <Box textColor="white" minH={{ base: "8vh", md: "10vh" }}>
                            <Text
                                fontSize={{ base: "lg", md: "xl" }}
                                mt={2}
                                textTransform="uppercase"
                                fontWeight="bold"
                            >
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
                                        h={{ base: "80px", md: "100px" }}
                                        resize="none"
                                        fontSize={{ base: "sm", md: "md" }}
                                    />
                                    <Flex
                                        justify="space-between"
                                        align="center"
                                        mt={1}
                                        direction={{ base: "column", sm: "row" }}
                                        gap={{ base: 2, sm: 0 }}
                                    >
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
                                <Flex
                                    mt={2}
                                    justifyContent="space-between"
                                    alignContent="center"
                                    alignItems="flex-start"
                                    direction={{ base: "column", sm: "row" }}
                                    gap={{ base: 2, sm: 0 }}
                                >
                                    <Text
                                        w="100%"
                                        fontSize={{ base: "sm", md: "md" }}
                                        lineHeight="1.4"
                                        wordBreak="break-word"
                                    >
                                        {info?.description || "Chưa có giới thiệu"}
                                    </Text>
                                    {isAllowShow && (
                                        <Tooltip placement="top" label="Chỉnh sửa">
                                            <IconButton
                                                aria-label="edit"
                                                icon={<FaEdit />}
                                                size="sm"
                                                color="white"
                                                ml={{ base: 0, sm: 2 }}
                                                mt={{ base: 2, sm: 0 }}
                                                bg="transparent"
                                                _hover={{ color: "black", bg: "gray.300" }}
                                                onClick={handleEditClick}
                                                alignSelf={{ base: "flex-end", sm: "center" }}
                                            />
                                        </Tooltip>
                                    )}
                                </Flex>
                            )}
                        </Box>
                    </GridItem>

                    {/* Right Content - Main Information */}
                    <GridItem w="full">
                        {/* Course Learning Section */}
                        <Box mb={{ base: 4, md: 5 }}>
                            <Suspense fallback={
                                <Skeleton height={{ base: "250px", md: "393px" }} w="100%" />
                            }>
                                <CourseBox coderID={id || coderID} />
                            </Suspense>
                        </Box>

                        {/* Blog and Action Grid */}
                        <Grid
                            templateColumns={{
                                base: "1fr",
                                md: "1fr",
                                lg: "1fr 0.7fr"
                            }}
                            gap={{ base: 4, md: 4 }}
                            h={{
                                base: "auto",
                                md: "60vh",
                                lg: "75vh"
                            }}
                            mb={{ base: 4, md: 5 }}
                        >
                            <GridItem
                                overflow="hidden"
                                minH={{ base: "300px", md: "400px" }}
                            >
                                <Suspense fallback={
                                    <Skeleton height="100%" w="100%" />
                                }>
                                    <BlogBox coderID={id || coderID} />
                                </Suspense>
                            </GridItem>
                            <GridItem
                                overflow="hidden"
                                minH={{ base: "300px", md: "400px" }}
                            >
                                <Suspense fallback={
                                    <Skeleton height="100%" w="100%" />
                                }>
                                    <ActionBox coderID={id || coderID} />
                                </Suspense>
                            </GridItem>
                        </Grid>

                        {/* History Section */}
                        <GridItem overflow="hidden">
                            <Suspense fallback={
                                <Skeleton height={{ base: "250px", md: "393px" }} w="100%" />
                            }>
                                <HistoryBox coderId={id || coderID} />
                            </Suspense>
                        </GridItem>
                    </GridItem>
                </Grid>
            </Box>
        </Container>
    );
};

export default Profile;
