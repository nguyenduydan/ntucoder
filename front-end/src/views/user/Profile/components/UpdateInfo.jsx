// UpdateInfo.jsx
import React, { useEffect, useState, useRef } from 'react';
import {
    Box, Button, Divider, Flex, FormControl, FormLabel,
    GridItem, Image, Input, SimpleGrid, Skeleton, Spinner,
    Text, Textarea, Tooltip, Icon, useToast,
} from '@chakra-ui/react';
import { getDetail, updateItem } from '@/config/apiService';
import { getCacheBustedUrl } from '@/utils/utils';
import DatePicker from "react-datepicker";
import { FaCamera } from 'react-icons/fa6';

const UpdateInfo = ({ coderID, onClose, onUpdated }) => {
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
                toast({ title: 'Lỗi khi tải dữ liệu.', status: 'error', duration: 2000, variant: 'top-accent', position: 'top' });
            } finally {
                setLoading(false);
            }
        };

        if (coderID) fetchData();
    }, [coderID]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!formData.coderName || !formData.coderEmail) {
            toast({ title: 'Vui lòng điền đầy đủ thông tin.', status: 'warning', duration: 2000, variant: 'top-accent', position: 'top' });
            return;
        }

        setSaving(true);
        try {
            await updateItem({ controller: 'Coder', id: coderID, data: formData });
            toast({ title: 'Cập nhật thành công!', status: 'success', duration: 2000, variant: 'top-accent', position: 'top' });
            onUpdated?.();
            onClose();
        } catch {
            toast({ title: 'Lỗi khi cập nhật.', status: 'error', duration: 2000, variant: 'top-accent', position: 'top' });
        } finally {
            setSaving(false);
        }
    };

    const handleImgChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    avatar: reader.result,
                    avatarFile: file,
                }));
                setAvatarLoaded(false);
            };
            reader.readAsDataURL(file);
        }
    };

    if (loading) {
        return (
            <Flex minH="40vh" justify="center" alignItems="center">
                <Spinner size="xl" />
            </Flex>
        );
    }

    return (
        <Box px={6}>
            {/* Avatar */}
            <Flex direction="column" align="center" p={5} bgGradient="linear(to-r, purple.400, brand.200)">
                <Skeleton isLoaded={avatarLoaded} borderRadius="md" size="2xl" mb={4}>
                    <Box position="relative" cursor="pointer">
                        <Tooltip label="Thay đổi avatar" hasArrow>
                            <Image
                                src={getCacheBustedUrl(formData.avatar || "/avatarSimmmple.png")}
                                alt="Avatar"
                                borderRadius="full"
                                boxSize="150px"
                                objectFit="cover"
                                onClick={() => inputRef.current.click()}
                                onLoad={() => setAvatarLoaded(true)}
                                onError={() => setAvatarLoaded(true)}
                            />
                        </Tooltip>
                        <Icon as={FaCamera} position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" color="white" fontSize="2xl" pointerEvents="none" />
                    </Box>
                </Skeleton>
                <Input ref={inputRef} type="file" display="none" onChange={handleImgChange} />
            </Flex>

            <Divider my={4} />

            {/* Form */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                <GridItem>
                    <FormControl mb={4}>
                        <FormLabel>Họ và tên</FormLabel>
                        <Input value={formData.coderName || ''} onChange={e => handleChange('coderName', e.target.value)} />
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel>Email</FormLabel>
                        <Input value={formData.coderEmail || ''} onChange={e => handleChange('coderEmail', e.target.value)} />
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl mb={4}>
                        <FormLabel>Số điện thoại</FormLabel>
                        <Input value={formData.phoneNumber || ''} onChange={e => handleChange('phoneNumber', e.target.value)} />
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel>Ngày sinh</FormLabel>
                        <DatePicker
                            selected={formData.birthDay ? new Date(formData.birthDay) : null}
                            onChange={date => handleChange("birthDay", date ? date.toISOString() : "")}
                            dateFormat="dd/MM/yyyy"
                            className="chakra-input css-bq6bms"
                        />
                    </FormControl>
                </GridItem>
            </SimpleGrid>

            <Divider my={4} />
            <Text fontWeight="bold" mb={2} align="center">Giới thiệu</Text>
            <Textarea
                value={formData.description || ''}
                onChange={e => handleChange('description', e.target.value)}
                maxLength={200}
                h="130px"
                resize="none"
            />
            <Text fontSize="sm" color="gray.500" textAlign="right">
                {formData.description?.length || 0} / 200 ký tự
            </Text>

            <Flex justify="flex-end" mt={6} mb={5}>
                <Button variant="ghost" colorScheme="red" mr={3} onClick={onClose}>
                    Hủy
                </Button>
                <Button
                    colorScheme="blue"
                    isLoading={saving}
                    loadingText="Đang lưu..."
                    onClick={handleSave}
                >
                    Lưu
                </Button>
            </Flex>
        </Box>
    );
};

export default UpdateInfo;
