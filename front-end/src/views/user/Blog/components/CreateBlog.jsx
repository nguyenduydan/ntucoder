import React, { useState } from 'react';
import {
    Box,
    Avatar,
    Button,
    Flex,
    Text,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Input,
    Switch,
    FormControl,
    FormLabel,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
} from '@chakra-ui/react';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { modules, formats } from '@/utils/formatReactQuill';
import { createItem } from '@/config/apiService';
import ImageInput from '@/components/fields/ImageInput';
import { useDisclosure } from '@chakra-ui/react';

const CreateBlog = ({ isOpen, onClose, onSuccess, authorName, authorAvatar }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [pinHome, setPinHome] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const cancelRef = React.useRef();
    const [loading, setLoading] = useState(false);

    const {
        isOpen: isConfirmOpen,
        onOpen: onConfirmOpen,
        onClose: onConfirmClose,
    } = useDisclosure();

    const toast = useToast();

    const hasChanges = title.trim() || content.trim() !== '' || pinHome;

    const resetForm = () => {
        setTitle('');
        setContent('');
        setPinHome(false);
    };

    const handlePost = async () => {
        if (!title.trim()) {
            toast({
                title: 'Vui lòng nhập tiêu đề.',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            });
            return;
        }

        if (!content || content === '<p><br></p>') {
            toast({
                title: 'Vui lòng nhập nội dung.',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            });
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('published', '1');
        formData.append('pinHome', pinHome ? '1' : '0');

        if (imageFile) {
            formData.append('imageFile', imageFile);
        }

        try {
            setLoading(true);
            await createItem({ controller: 'Blog', data: formData });
            toast({
                title: 'Đăng bài thành công!',
                status: 'success',
                duration: 2000,
                position: 'top',
                variant: 'left-accent',
                isClosable: true,
            });

            resetForm();
            onSuccess();
            onClose();
        } catch (err) {
            toast({
                title: 'Lỗi khi đăng bài.',
                description: err.message || 'Không thể gửi bài',
                status: 'error',
                duration: 3000,
                position: 'top',
                variant: 'left-accent',
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (hasChanges) {
            onConfirmOpen();
        } else {
            resetForm();
            onClose();
        }
    };

    const confirmClose = () => {
        resetForm();
        onConfirmClose();
        onClose();
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={handleClose}
                size="6xl"
                isCentered
                scrollBehavior="inside"
                motionPreset="slideInBottom"
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <FormControl>
                            <FormLabel textAlign="center" fontWeight="bold" fontSize="2xl">Đăng bài viết mới</FormLabel>
                            <Input
                                placeholder="Nhập tiêu đề bài viết"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                autoFocus
                            />
                        </FormControl>
                        <Flex align="center" mt={4} bgGradient="linear(to-r, blue.500, blue.400)" p={2} borderRadius="lg">
                            <Avatar src={authorAvatar} mr={3} />
                            <Text color="white" fontWeight="bold">{authorName}</Text>
                        </Flex>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box mb={3}>
                            <FormControl mb={6}>
                                <FormLabel textAlign="center" fontWeight="bold">Ảnh đại diện</FormLabel>
                                <ImageInput
                                    label="chọn ảnh đại diện"
                                    previewWidth="80vh"
                                    previewHeight="40vh"
                                    onImageChange={file => setImageFile(file)}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel fontWeight="bold">Nội dung</FormLabel>
                                <ReactQuill
                                    value={content}
                                    onChange={setContent}
                                    modules={modules}
                                    formats={formats}
                                    theme="snow"
                                    placeholder="Chia sẻ cảm nghĩ của bạn hoặc thêm hình ảnh vào nội dung..."
                                />
                            </FormControl>
                        </Box>
                    </ModalBody>

                    <ModalFooter justifyContent="space-between">
                        <Flex gap={4} flex={1}>

                            <FormControl display="flex" alignItems="center">
                                <FormLabel htmlFor="pinHome" mb="0" fontWeight="bold">Ghim ở trang chủ</FormLabel>
                                <Switch
                                    id="pinHome"
                                    isChecked={pinHome}
                                    onChange={(e) => setPinHome(e.target.checked)}
                                />
                            </FormControl>
                        </Flex>
                        <Box>
                            <Button variant="ghost" mr={3} onClick={handleClose}>
                                Hủy
                            </Button>
                            <Button colorScheme="blue" onClick={handlePost} isLoading={loading} loadingText="Đang đăng bài...">
                                Đăng bài
                            </Button>
                        </Box>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Dialog xác nhận đóng */}
            <AlertDialog
                isOpen={isConfirmOpen}
                leastDestructiveRef={cancelRef}
                onClose={onConfirmClose}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Cảnh báo
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Bạn có chắc chắn muốn bỏ tạo bài mới?
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onConfirmClose}>
                                Tiếp tục chỉnh sửa
                            </Button>
                            <Button colorScheme="red" onClick={confirmClose} ml={3}>
                                Hủy
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
};

export default CreateBlog;
