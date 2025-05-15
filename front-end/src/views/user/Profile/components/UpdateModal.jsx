// Update.js
import React, { useEffect, useState } from 'react';
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
    Image
} from '@chakra-ui/react';
import { getDetail, updateItem } from '@/config/apiService';
import { getCacheBustedUrl } from '@/utils/utils';

const UpdateModal = ({ coderID, isOpen, onClose, onUpdated }) => {
    const toast = useToast();
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
                            <Flex direction="column" align="center" p={5}>
                                <Skeleton
                                    isLoaded={avatarLoaded}
                                    borderRadius="md"
                                    size="2xl"
                                    mb={4}
                                >
                                    <Image
                                        src={getCacheBustedUrl(formData.avatar || "/avatarSimmmple.png")}
                                        alt="Avatar"
                                        borderRadius="full"
                                        boxSize="150px"
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
                                    onChange={handleImgChange}
                                    display="none"
                                />

                            </Flex>
                            <Divider my={4} />
                            <FormControl mb={4}>
                                <FormLabel>Họ và tên</FormLabel>
                                <Input
                                    value={formData.coderName || ''}
                                    onChange={e => handleChange('coderName', e.target.value)}
                                />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    value={formData.coderEmail || ''}
                                    onChange={e => handleChange('coderEmail', e.target.value)}
                                />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Số điện thoại</FormLabel>
                                <Input
                                    value={formData.phoneNumber || ''}
                                    onChange={e => handleChange('phoneNumber', e.target.value)}
                                />
                            </FormControl>

                        </Box>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose}>
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
