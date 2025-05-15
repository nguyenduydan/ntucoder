// Update.js
import React, { useEffect, useState, useRef } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    Button,
    Input,
    FormControl,
    FormLabel,
    useToast,
    Spinner,
    Flex,
    Box,
    Skeleton,
    Divider,
    Image,
    SimpleGrid,
    GridItem,
    Textarea,
    Text,
    Tooltip,
    Icon,
} from '@chakra-ui/react';
import { getDetail, updateItem } from '@/config/apiService';
import { getCacheBustedUrl } from '@/utils/utils';
import DatePicker from "react-datepicker";
import IconBox from '@/components/icons/IconBox';
import { FaCamera } from 'react-icons/fa6';

const UpdateModal = ({ coderID, isOpen, onClose, onUpdated }) => {
    const toast = useToast();
    const inputRef = useRef(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [avatarLoaded, setAvatarLoaded] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await getDetail({ controller: 'Coder', id: coderID });
                if (res) setFormData(res);
            } catch (error) {
                toast({
                    title: 'Lỗi khi tải dữ liệu.',
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                    variant: 'top-accent',
                    position: 'top'
                });
            } finally {
                setLoading(false);
            }
        };

        if (isOpen && coderID) fetchData();
    }, [isOpen, coderID, toast]);


    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!formData.coderName || !formData.coderEmail) {
            toast({
                title: 'Vui lòng điền đầy đủ thông tin.',
                status: 'warning',
                duration: 2000,
                isClosable: true,
                variant: 'top-accent',
                position: 'top'
            });
            return;
        }

        setSaving(true);
        try {
            await updateItem({
                controller: 'Coder',
                id: coderID,
                data: formData,
            });

            toast({
                title: 'Cập nhật thành công!',
                status: 'success',
                duration: 2000,
                isClosable: true,
                variant: 'top-accent',
                position: 'top'
            });

            onUpdated?.();
            onClose();
        } catch (err) {
            toast({
                title: 'Lỗi khi cập nhật.',
                status: 'error',
                duration: 2000,
                isClosable: true,
                variant: 'top-accent',
                position: 'top'
            });
        } finally {
            setSaving(false);
        }
    };

    const handleImgChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Chuyển file sang base64
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result;

                // Cập nhật state: avatar (base64 preview) và avatarFile (gửi server)
                setFormData((prev) => ({
                    ...prev,
                    avatar: base64,       // Base64 chỉ dùng để hiển thị preview
                    avatarFile: file,     // File sẽ được gửi lên server
                }));

                setAvatarLoaded(false); // Đợi ảnh load xong
            };
            reader.readAsDataURL(file); // Đọc file ảnh thành base64
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="3xl" isCentered scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Cập nhật thông tin</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {loading ? (
                        <Flex
                            minH="40vh"
                            justify="center"
                            alignItems="center"
                        >
                            <Spinner size="xl" />
                        </Flex>
                    ) : (
                        <Box>
                            {/* Avatar */}
                            <Flex direction="column" align="center" p={5} position="relative" bgGradient={"linear(to-r, purple.400, brand.200)"}>
                                <Skeleton
                                    isLoaded={avatarLoaded}
                                    borderRadius="md"
                                    size="2xl"
                                    mb={4}
                                >
                                    <Box position="relative" display="inline-block" cursor="pointer">
                                        <Tooltip label="Thay đổi avatar" placement="top" hasArrow>
                                            <Image
                                                src={getCacheBustedUrl(formData.avatar || "/avatarSimmmple.png")}
                                                alt="Avatar"
                                                borderRadius="full"
                                                boxSize="150px"
                                                objectFit="cover"
                                                transition="all 0.2s ease-in-out"
                                                _hover={{ transform: "scale(1.05)" }}
                                                onClick={() => inputRef.current.click()}
                                                onLoad={() => setAvatarLoaded(true)}
                                                onError={() => setAvatarLoaded(true)}
                                                aria-label="Thay đổi avatar"
                                            />
                                        </Tooltip>

                                        <Icon
                                            as={FaCamera}
                                            zIndex={10}
                                            position="absolute"
                                            top="50%"
                                            left="50%"
                                            transform="translate(-50%, -50%)"
                                            color="white"
                                            fontSize="2xl"
                                            pointerEvents="none" // tránh icon chặn event click bên dưới
                                        />
                                    </Box>
                                </Skeleton>
                                <Input
                                    id="avatarInput"
                                    type="file"
                                    onChange={handleImgChange}
                                    display="none"
                                    ref={inputRef}
                                />
                            </Flex>
                            <Divider my={4} />
                            {/* Thống tin cơ bản */}
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 0, md: 5 }}>
                                <GridItem>
                                    <FormControl mb={4}>
                                        <FormLabel fontWeight="bold">Họ và tên</FormLabel>
                                        <Input
                                            value={formData.coderName || ''}
                                            onChange={e => handleChange('coderName', e.target.value)}
                                        />
                                    </FormControl>
                                    <FormControl mb={4}>
                                        <FormLabel fontWeight="bold">Email</FormLabel>
                                        <Input
                                            value={formData.coderEmail || ''}
                                            onChange={e => handleChange('coderEmail', e.target.value)}
                                        />
                                    </FormControl>

                                </GridItem>
                                <GridItem>
                                    <FormControl mb={4}>
                                        <FormLabel fontWeight="bold">Số điện thoại</FormLabel>
                                        <Input
                                            value={formData.phoneNumber || ''}
                                            onChange={e => handleChange('phoneNumber', e.target.value)}
                                        />
                                    </FormControl>
                                    <FormControl mb={4}>
                                        <FormLabel fontWeight="bold">Ngày sinh</FormLabel>
                                        <DatePicker
                                            selected={formData.birthDay ? new Date(formData.birthDay) : null}
                                            onChange={(date) =>
                                                handleChange("birthDay", date ? date.toISOString() : "")
                                            }
                                            dateFormat="dd/MM/yyyy"
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                            placeholderText="ngày/tháng/năm"
                                            className="chakra-input css-bq6bms"
                                            wrapperClassName=".react-datepicker-wrapper"
                                        />
                                    </FormControl>
                                </GridItem>
                            </SimpleGrid>
                            <Divider my={4} />
                            {/* Giới thiệu */}
                            <Text fontWeight="bold" mb={2} align="center">
                                Giới thiệu
                            </Text>
                            <Textarea
                                value={formData.description || ''}
                                onChange={e => handleChange('description', e.target.value)}
                                maxLength={200}
                                h="130px"
                                resize="none"
                            />
                            <Text fontSize="sm" color="gray.500" textAlign="right">
                                {formData.description.length} / 200 ký tự
                            </Text>
                        </Box>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" colorScheme='red' mr={3} onClick={onClose}>
                        Hủy
                    </Button>
                    <Button
                        px={10}
                        bg="blue.500"
                        color="white"
                        w="25%"
                        onClick={handleSave}
                        isLoading={saving}
                        loadingText="Đang lưu..."
                        _hover={{
                            bg: "blue.400",
                            transform: "translateY(-5px)",
                        }}
                        _active={{
                            transform: "scale(0.90)",
                        }}
                    >
                        Lưu
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default UpdateModal;
