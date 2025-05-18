import React, { useState } from 'react';
import {
    Box, FormControl, FormLabel, Input, Button, useToast, VStack,
    InputGroup, InputRightElement, IconButton, FormErrorMessage
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { validatePassword } from '@/utils/utils';
import api from '@/config/apiConfig';

const UpdatePassword = ({ coderID }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [errors, setErrors] = useState({});
    const toast = useToast();

    const handleChangePassword = async () => {
        let newErrors = {};

        if (!currentPassword) newErrors.current = 'Vui lòng nhập mật khẩu hiện tại.';
        if (!newPassword) newErrors.new = 'Vui lòng nhập mật khẩu mới.';
        if (!confirmPassword) newErrors.confirm = 'Vui lòng xác nhận mật khẩu mới.';
        if (newPassword && confirmPassword && newPassword !== confirmPassword) {
            newErrors.confirm = 'Mật khẩu mới không khớp.';
        }

        const validationMsg = validatePassword(newPassword);
        if (newPassword && validationMsg) {
            newErrors.new = validationMsg;
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        setLoading(true);
        try {
            await api.post(`/Account/${coderID}/repassword`, {
                oldPassword: currentPassword,
                password: newPassword,
                repassword: confirmPassword,
            });

            toast({ title: 'Đổi mật khẩu thành công.', status: 'success', variant: 'top-accent', position: 'top' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setErrors({});
        } catch (error) {
            const msg = error?.response?.data?.error || 'Lỗi khi đổi mật khẩu.';
            toast({ title: msg, status: 'error', variant: 'top-accent', position: 'top' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box px={6} py={4}>
            <VStack spacing={4} align="stretch">
                <FormControl isInvalid={!!errors.current}>
                    <FormLabel>Mật khẩu hiện tại</FormLabel>
                    <Input
                        type='password'
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        autoComplete="off"
                    />
                    <FormErrorMessage>{errors.current}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.new}>
                    <FormLabel>Mật khẩu mới</FormLabel>
                    <InputGroup>
                        <Input
                            type={showNew ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <InputRightElement>
                            <IconButton
                                variant="ghost"
                                size="sm"
                                icon={showNew ? <ViewOffIcon /> : <ViewIcon />}
                                onClick={() => setShowNew(!showNew)}
                                aria-label="Toggle password visibility"
                            />
                        </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{errors.new}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.confirm}>
                    <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                    <Input
                        type='password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <FormErrorMessage>{errors.confirm}</FormErrorMessage>
                </FormControl>

                <Button
                    colorScheme="green"
                    onClick={handleChangePassword}
                    isLoading={loading}
                >
                    Đổi mật khẩu
                </Button>
            </VStack>
        </Box>
    );
};

export default UpdatePassword;
