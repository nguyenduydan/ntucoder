import React, { useEffect, useState, useCallback } from "react";
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
    Skeleton,
    useColorMode,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { MdOutlineArrowBack, MdEdit } from "react-icons/md";
import ScrollToTop from "@/components/scroll/ScrollToTop";
import ProgressBar from "@/components/loading/loadingBar";
import { getDetail, updateItem } from "@/config/apiService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatDateTime } from "@/utils/utils";
import { getCacheBustedUrl } from "@/utils/utils";
import ToolDetail from "@/components/navbar/ToolDetail";

const genderMapping = {
    0: "Nam",
    1: "Nữ",
    2: "Khác",
};

const roleMapping = {
    1: "Người quản trị",
    2: "Người dùng",
    3: "Giáo viên",
};

const CoderDetail = () => {
    const { id } = useParams();
    const [coderDetail, setCoderDetail] = useState({});;
    const [editField, setEditField] = useState(null);
    const [editableValues, setEditableValues] = useState({});
    const [avatarFile, setAvatarFile] = useState(null);
    const navigate = useNavigate();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [avatarLoaded, setAvatarLoaded] = useState(false);
    const { colorMode } = useColorMode(); // Lấy trạng thái chế độ màu
    const textColor = colorMode === 'light' ? 'black' : 'white';
    const boxColor = colorMode === 'light' ? 'white' : 'whiteAlpha.300';

    const fetchCoderDetail = useCallback(async () => {
        try {
            const data = await getDetail({ controller: "Coder", id });
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
    }, [id, toast]);

    useEffect(() => {
        if (id) {
            fetchCoderDetail();
        }
    }, [id, fetchCoderDetail]);

    useEffect(() => {
        setAvatarLoaded(false);
    }, [
        editableValues?.avatar,
        coderDetail?.avatar,
    ]);

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

                if (editableValues.role) {
                    formData.append("Role", editableValues.role);
                }
                try {
                    // update image
                    await updateItem({ controller: "Coder", id: id, data: formData });

                    toast({
                        title: "Cập nhật avatar thành công!",
                        status: "success",
                        duration: 2000,
                        isClosable: true,
                        position: "top",
                        variant: "left-accent",
                    });
                    await fetchCoderDetail();
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
                    const value = editableValues[field];

                    if (field === "birthDay" && (value === null || value === undefined)) {
                        formData.append("BirthDay", "");
                    } else {
                        formData.append(field, value);
                    }
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
            await updateItem({ controller: "Coder", id: id, data: formData });
            await fetchCoderDetail();
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
                    p={{ base: "4", md: "6" }}  // Padding responsive
                    borderRadius="lg"
                    boxShadow="lg"
                    maxW="1000px"
                    w="100%"
                    mx="auto"
                >
                    <Flex justifyContent="end" align="end" px={{ base: "10px", md: "25px" }}>
                        <ToolDetail offsetTop="15">
                            <Button
                                onClick={() => navigate(`/admin/coder`)}
                                variant="solid"
                                size="lg"
                                colorScheme="teal"
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
                                <MdOutlineArrowBack /> Quay lại
                            </Button>

                            <Button
                                variant="solid"
                                size="lg"
                                colorScheme="teal"
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
                                isLoading={loading}
                                loadingText="Đang lưu..."

                            >
                                Lưu
                            </Button>
                        </ToolDetail>
                    </Flex>
                    <VStack spacing={6} align="stretch" mt={4}>
                        {/* Avatar Section */}
                        <Flex direction="column" align="center">
                            <Skeleton
                                isLoaded={avatarLoaded}
                                borderRadius="full"
                                boxSize="200px"
                                mb={4}
                            >
                                <Image
                                    src={getCacheBustedUrl(editableValues.avatar || coderDetail.avatar || "/avatarSimmmple.png")}
                                    alt="Coder Avatar"
                                    borderRadius="full"
                                    boxSize="200px"
                                    objectFit="cover"
                                    transition="all 0.2s ease-in-out"
                                    _hover={{ transform: "scale(1.05)" }}
                                    onClick={() => document.getElementById("avatarInput").click()}
                                    onLoad={() => setAvatarLoaded(true)}
                                    onError={() => {
                                        setAvatarLoaded(true); // tránh Skeleton load mãi
                                    }}
                                    cursor="pointer"
                                />
                            </Skeleton>
                            <Input
                                id="avatarInput"
                                type="file"
                                onChange={handleAvatarChange}
                                display="none"
                            />
                        </Flex>
                        <Divider />
                        {/* Responsive Grid: 1 column on mobile, 2 columns on md+ */}
                        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
                            {/* Left Column */}
                            <GridItem>
                                <VStack align="stretch" ps={{ base: "0", md: "20px" }} spacing={4}>
                                    <Flex align="center">
                                        <Text fontSize="lg">
                                            <strong>Tên đăng nhập:</strong> {coderDetail.userName || "Chưa có thông tin"}
                                        </Text>
                                    </Flex>

                                    {["coderName", "coderEmail", "phoneNumber"].map((field) => (
                                        <Flex key={field} align="center">
                                            {editField === field ? (
                                                <Input
                                                    textColor={textColor}
                                                    value={editableValues[field] || ""}
                                                    onChange={(e) => handleInputChange(field, e.target.value)}
                                                    placeholder={`Chỉnh sửa ${field}`}
                                                    onBlur={() => setEditField(null)}
                                                    autoFocus
                                                />
                                            ) : (
                                                <Text fontSize="lg" textColor={textColor}>
                                                    <strong>
                                                        {field === "coderName"
                                                            ? "Họ và tên"
                                                            : field === "coderEmail"
                                                                ? "Email"
                                                                : "Số điện thoại"}
                                                        :
                                                    </strong>{" "}
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
                                                width={{ base: "100%", md: "50%" }}
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
                                    <Flex align="center">
                                        {editField === "birthDay" ? (
                                            <DatePicker
                                                selected={editableValues.birthDay ? new Date(editableValues.birthDay) : null}
                                                onChange={(date) => handleInputChange("birthDay", date ? date.toISOString() : "")}
                                                dateFormat="dd/MM/yyyy"
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                placeholderText="ngày/tháng/năm"
                                                className="custom-datepicker"
                                                onBlur={() => setEditField(null)}
                                                autoFocus
                                            />
                                        ) : (
                                            <Text fontSize="lg">
                                                <strong>Ngày sinh:</strong>{" "}
                                                {editableValues.birthDay
                                                    ? new Date(editableValues.birthDay).toLocaleDateString("vi-VN")
                                                    : "Chưa có"}
                                            </Text>
                                        )}
                                        <IconButton
                                            aria-label="Edit"
                                            icon={<MdEdit />}
                                            ml={2}
                                            size="sm"
                                            onClick={() => handleEdit("birthDay")}
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
                                <VStack align="stretch" ps={{ base: "0", md: "20px" }} spacing={4}>
                                    <Text fontSize="lg">
                                        <strong>Ngày tạo: </strong>{formatDateTime(coderDetail.createdAt)}
                                    </Text>
                                    <Text fontSize="lg">
                                        <strong>Người tạo: </strong> {coderDetail.createdBy}
                                    </Text>
                                    {coderDetail.updatedAt && (
                                        <>
                                            <Text fontSize="lg">
                                                <strong>Ngày cập nhật: </strong>{formatDateTime(coderDetail.updatedAt)}
                                            </Text>
                                            <Text fontSize="lg">
                                                <strong>Người cập nhật: </strong> {coderDetail.updatedBy}
                                            </Text>
                                        </>
                                    )}
                                    <Flex align="center">
                                        {editField === "role" ? (
                                            <Select
                                                value={editableValues.role || ""}
                                                onBlur={() => setEditField(null)}
                                                autoFocus
                                                onChange={(e) => handleInputChange("role", e.target.value)}
                                                placeholder="Chọn vai trò"
                                                width={{ base: "100%", md: "50%" }}
                                            >
                                                <option value="1">Người quản trị</option>
                                                <option value="2">Người dùng</option>
                                                <option value="3">Giáo viên</option>
                                            </Select>
                                        ) : (
                                            <Text fontSize="lg">
                                                <strong>Vai trò:</strong> {roleMapping[coderDetail.role] || "Khác"}
                                            </Text>
                                        )}
                                        <IconButton
                                            aria-label="Edit"
                                            icon={<MdEdit />}
                                            ml={2}
                                            size="sm"
                                            onClick={() => handleEdit("role")}
                                            cursor="pointer"
                                        />
                                    </Flex>
                                    <Text fontSize="lg">
                                        <strong>Tổng điểm: </strong>{coderDetail.totalPoint}
                                    </Text>
                                </VStack>
                            </GridItem>
                        </Grid>
                    </VStack>
                    <Flex justifyContent="flex-end" mt={6}>
                        <Button
                            variant="solid"
                            size="lg"
                            colorScheme="teal"
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
                            isLoading={loading}
                            loadingText="Đang lưu..."

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
