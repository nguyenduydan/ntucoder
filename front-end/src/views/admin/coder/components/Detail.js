import React, { useEffect, useState } from "react";
import {
    Box,
    Text,
    VStack,
    Divider,
    Flex,
    Grid,
    GridItem,
    Link,
    Button,
    Image,
    Input,
    IconButton,
    useToast,
    Select,
    useColorMode,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { getById, update } from "config/coderService";
import { useNavigate } from "react-router-dom";
import { MdOutlineArrowBack, MdEdit } from "react-icons/md";
import ScrollToTop from "components/scroll/ScrollToTop";
import ProgressBar from "components/loading/loadingBar";
import api from "config/apiConfig";

const genderMapping = {
    0: "Nam",
    1: "Nữ",
    2: "Khác",
};

const CoderDetail = () => {
    const { id } = useParams();
    const [coderDetail, setCoderDetail] = useState(null);
    const [editField, setEditField] = useState(null);
    const [editableValues, setEditableValues] = useState({});
    const [avatarFile, setAvatarFile] = useState(null);
    const navigate = useNavigate();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const { colorMode } = useColorMode(); // Lấy trạng thái chế độ màu
    const textColor = colorMode === 'light' ? 'black' : 'white';
    const boxColor = colorMode === 'light' ? 'white' : 'whiteAlpha.300';

    useEffect(() => {
        const fetchCoderDetail = async () => {
            try {
                const data = await getById(id);
                setCoderDetail(data);
                setEditableValues(data);
            } catch (error) {
                toast({
                    title: "Đã xảy ra lỗi.",
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                    position: "top",
                    variant: "left-accent",
                });
            }
        };

        if (id) {
            fetchCoderDetail();
        }
    }, [id, toast]);

    const handleEdit = (field) => {
        setEditField(field);
    };

    const handleInputChange = (field, value) => {
        setEditableValues((prev) => {
            const updatedValues = { ...prev, [field]: value };
            setCoderDetail((prevCoderDetail) => ({
                ...prevCoderDetail,
                [field]: value,
            }));
            return updatedValues;
        });
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                setEditableValues((prev) => ({ ...prev, avatar: reader.result }));

                const formData = new FormData();
                formData.append("CoderID", id);
                formData.append("AvatarFile", file);

                try {
                    await api.put(`/coder/update/${id}/`, formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",  // Đảm bảo gửi dưới dạng form-data
                        },
                    });

                    toast({
                        title: "Cập nhật avatar thành công!",
                        status: "success",
                        duration: 2000,
                        isClosable: true,
                        position: "top",
                        variant: "left-accent",
                    });
                } catch (error) {
                    console.error("Đã xảy ra lỗi khi cập nhật avatar", error);
                    toast({
                        title: "Đã xảy ra lỗi khi cập nhật avatar.",
                        status: "error",
                        duration: 2000,
                        isClosable: true,
                        position: "top",
                        variant: "left-accent",
                    });
                }
            };
            reader.readAsDataURL(file);
            setAvatarFile(file);
        }
    };

    const handleSave = async () => {
        setLoading(true);  // Bật trạng thái loading khi gửi yêu cầu
        try {
            const formData = new FormData();

            // Lưu tất cả các trường đã chỉnh sửa.
            Object.keys(editableValues).forEach((field) => {
                // Kiểm tra để tránh đính kèm CoderID trong formData
                if (field !== "CoderID") {
                    formData.append(field, editableValues[field]);
                }
            });

            // Nếu có file avatar, đính kèm vào formData
            if (avatarFile) {
                formData.append("AvatarFile", avatarFile);
            }

            // Cập nhật coderDetail sau khi chỉnh sửa
            setCoderDetail((prev) => ({
                ...prev,
                ...editableValues,
            }));

            // Gọi API PUT để cập nhật dữ liệu
            try {
                await api.put(`/coder/update/${id}/`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",  // Đảm bảo gửi dưới dạng form-data
                    },
                });
            } catch (error) {
                console.error("Đã xảy ra lỗi khi cập nhật", error);
            }

            setEditField(null); // Reset trạng thái chỉnh sửa
            toast({
                title: "Cập nhật thành công!",
                status: "success",
                duration: 2000,
                isClosable: true,
                position: "top",
                variant: "left-accent",
            });
            setLoading(false);  // Bật trạng thái loading khi gửi yêu cầu
        } catch (error) {
            console.error("Đã xảy ra lỗi khi cập nhật", error);
            toast({
                title: "Đã xảy ra lỗi khi cập nhật.",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top",
                variant: "left-accent",
            });
            setLoading(false);  // Bật trạng thái loading khi gửi yêu cầu
        }
    };

    if (!coderDetail) {
        return (
            <ProgressBar />
        );
    }
    return (
        <ScrollToTop>
            <Box pt={{ base: "130px", md: "80px", xl: "80px" }} px="25px">
                <Box
                    bg={boxColor}
                    p="6"
                    borderRadius="lg"
                    boxShadow="lg"
                    maxW="1000px"
                    mx="auto"
                >
                    <Flex justifyContent="end" align="end" px="25px">
                        <Link>
                            <Button
                                onClick={() => navigate(`/admin/coder`)}
                                variant="solid"
                                size="lg"
                                colorScheme="messenger"
                                borderRadius="xl"
                                px={5}
                                boxShadow="lg"
                                bgGradient="linear(to-l, messenger.500, navy.300)"
                                transition="all 0.2s ease-in-out"
                                _hover={{
                                    color: "white",
                                    transform: "scale(1.05)",
                                }}
                                _active={{
                                    transform: "scale(0.90)",
                                }}
                            >
                                <MdOutlineArrowBack />Quay lại
                            </Button>
                        </Link>
                    </Flex>
                    <VStack spacing={6} align="stretch">
                        {/* Avatar Section */}
                        <Flex direction="column" align="center">
                            <Image
                                src={editableValues.avatar || coderDetail.avatar || "/avatarSimmmple.png"}
                                alt="Coder Avatar"
                                borderRadius="full"
                                boxSize="200px"
                                objectFit="cover"
                                mb={4}
                                transition="all 0.2s ease-in-out"
                                _hover={{
                                    transform: "scale(1.05)",
                                }}
                                onClick={() => document.getElementById("avatarInput").click()}
                                cursor="pointer"
                            />
                            <Input
                                id="avatarInput"
                                type="file"
                                onChange={handleAvatarChange}
                                style={{ display: "none" }}
                            />
                        </Flex>
                        <Divider />
                        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                            {/* Left Column */}
                            <GridItem >
                                <VStack align="stretch" ps={20} spacing={4}>
                                    <Flex align="center">
                                        <Text fontSize="lg">
                                            <strong>Tên đăng nhập:</strong> {coderDetail.userName || "Chưa có thông tin"}
                                        </Text>
                                    </Flex>

                                    {["coderName", "coderEmail", "phoneNumber"].map((field) => (
                                        <Flex key={field} align="center">
                                            {editField === field ? (
                                                <Input textColor={textColor}
                                                    value={editableValues[field] || ""}
                                                    onChange={(e) => handleInputChange(field, e.target.value)}
                                                    placeholder={`Chỉnh sửa ${field}`}
                                                    onBlur={() => setEditField(null)}
                                                    autoFocus // Tự động focus vào ô input khi chuyển sang chế độ chỉnh sửa
                                                />
                                            ) : (
                                                <Text fontSize="lg" textColor={textColor}>
                                                    <strong>{field === "coderName"
                                                        ? "Họ và tên"
                                                        : field === "coderEmail"
                                                            ? "Email"
                                                            : "Số điện thoại"}:</strong>{" "}
                                                    {coderDetail[field] || "Chưa có thông tin"}
                                                </Text>
                                            )}
                                            <IconButton
                                                aria-label="Edit"
                                                icon={<MdEdit />}
                                                ml={2}
                                                size="sm"
                                                onClick={() => handleEdit(field)}
                                                cursor="pointer"
                                            />
                                        </Flex>
                                    ))}

                                    {/* Gender field */}
                                    <Flex align="center">
                                        {editField === "gender" ? (
                                            <Select
                                                value={editableValues.gender || ""}
                                                onBlur={() => setEditField(null)}
                                                autoFocus
                                                onChange={(e) => handleInputChange("gender", e.target.value)}
                                                placeholder="Chọn giới tính"
                                                width="50%"
                                            >
                                                <option value="0">Nam</option>
                                                <option value="1">Nữ</option>
                                                <option value="2">Khác</option>
                                            </Select>
                                        ) : (
                                            <Text fontSize="lg">
                                                <strong>Giới tính:</strong> {genderMapping[coderDetail.gender] || "Khác"}
                                            </Text>
                                        )}
                                        <IconButton
                                            aria-label="Edit"
                                            icon={<MdEdit />}
                                            ml={2}
                                            size="sm"
                                            onClick={() => handleEdit("gender")}
                                            cursor="pointer"
                                        />
                                    </Flex>

                                    {/* Description field */}
                                    <Flex align="center">
                                        {editField === "description" ? (
                                            <Input
                                                value={editableValues.description || ""}
                                                onChange={(e) => handleInputChange("description", e.target.value)}
                                                placeholder="Chỉnh sửa mô tả"
                                                onBlur={() => setEditField(null)}
                                                autoFocus
                                                textColor={textColor}
                                            />
                                        ) : (
                                            <Text fontSize="lg">
                                                <strong>Mô tả:</strong> {coderDetail.description || "Chưa có thông tin"}
                                            </Text>
                                        )}
                                        <IconButton
                                            aria-label="Edit"
                                            icon={<MdEdit />}
                                            ml={2}
                                            size="sm"
                                            onClick={() => handleEdit("description")}
                                            cursor="pointer"
                                        />
                                    </Flex>
                                </VStack>
                            </GridItem>


                            {/* Right Column */}
                            <GridItem>
                                <VStack align="stretch" ps={20} spacing={4}>
                                    <Text fontSize="lg">
                                        <strong>Ngày tạo:</strong> {coderDetail.createdAt}
                                    </Text>
                                    <Text fontSize="lg">
                                        <strong>Người tạo:</strong> {coderDetail.createdBy}
                                    </Text>
                                    {coderDetail.updatedAt && (
                                        <>
                                            <Text fontSize="lg">
                                                <strong>Ngày cập nhật:</strong> {coderDetail.updatedAt}
                                            </Text>
                                            <Text fontSize="lg">
                                                <strong>Người cập nhật:</strong> {coderDetail.updatedBy}
                                            </Text>
                                        </>
                                    )}
                                </VStack>
                            </GridItem>
                        </Grid>
                    </VStack>
                    <Flex justifyContent="flex-end" mt={6}>
                        <Button
                            variant="solid"
                            size="lg"
                            colorScheme="messenger"
                            borderRadius="xl"
                            px={10}
                            boxShadow="lg"
                            bgGradient="linear(to-l, green.500, green.300)"
                            transition="all 0.2s ease-in-out"
                            _hover={{
                                color: "white",
                                transform: "scale(1.05)",
                            }}
                            _active={{
                                transform: "scale(0.90)",
                            }}
                            onClick={handleSave}
                            isLoading={loading}  // Hiển thị trạng thái loading
                            loadingText="Đang lưu..."
                            disabled={editField === null}
                        >
                            Lưu
                        </Button>
                    </Flex>
                </Box>
            </Box>
        </ScrollToTop>
    );
};

export default CoderDetail;
