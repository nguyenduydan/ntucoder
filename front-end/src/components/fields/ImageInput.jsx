import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Input, Image, VStack, IconButton } from '@chakra-ui/react';
import { FaRegImage, FaTrashAlt } from "react-icons/fa";

const ImageInput = ({
    onImageChange,
    previewWidth = '150px',
    previewHeight = '150px',
    ...inputProps
}) => {
    const [preview, setPreview] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef(null);

    // Xử lý chọn file upload
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        handleFile(file);
    };

    // Xử lý kéo thả file vào vùng
    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        handleFile(file);
    };

    // Xử lý dán ảnh từ clipboard
    const handlePaste = (e) => {
        if (!e.clipboardData?.items) return;
        for (let i = 0; i < e.clipboardData.items.length; i++) {
            const item = e.clipboardData.items[i];
            if (item.type.indexOf("image") !== -1) {
                const file = item.getAsFile();
                handleFile(file);
                break;
            }
        }
    };

    // Xử lý file chung cho mọi trường hợp (upload, drag, paste)
    const handleFile = (file) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                if (onImageChange) onImageChange(file);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
            if (onImageChange) onImageChange(null);
        }
    };

    const handleRemoveImage = (e) => {
        e?.stopPropagation?.();
        setPreview(null);
        if (onImageChange) onImageChange(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <VStack align="center" spacing={2} position="relative">
            <Box
                position="relative"
                width={previewWidth}
                height={previewHeight}
                tabIndex={0}
                border={dragActive ? '2px solid' : (preview ? 'none' : '2px dashed')}
                borderColor={dragActive ? 'blue.400' : 'gray.300'}
                rounded="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
                overflow="hidden"
                bg={dragActive ? 'blue.50' : 'gray.50'}
                cursor="pointer"
                onClick={() => inputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={e => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={e => { e.preventDefault(); setDragActive(false); }}
                onPaste={handlePaste}
            >
                <Input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    opacity={0}
                    position="absolute"
                    width="100%"
                    height="100%"
                    cursor="pointer"
                    {...inputProps}
                />
                {preview ? (
                    <Image
                        src={preview}
                        alt="Preview"
                        width="100%"
                        height="100%"
                        objectFit="cover"
                        pointerEvents="none"
                    />
                ) : (
                    <Box
                        position="absolute"
                        textAlign="center"
                        pointerEvents="none"
                        color="gray.500"
                        left="0"
                        right="0"
                        top="0"
                        bottom="0"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        flexDir="column"
                        userSelect="none"
                    >
                        <FaRegImage fontSize="5vh" />
                        <Box fontSize="sm" mt={2}>
                            Kéo & thả, copy/paste hoặc click để chọn ảnh
                        </Box>
                    </Box>
                )}
                {preview && (
                    <IconButton
                        icon={<FaTrashAlt />}
                        size="sm"
                        colorScheme="red"
                        position="absolute"
                        top="0"
                        right="0"
                        borderRadius="full"
                        aria-label="Xóa ảnh"
                        onClick={handleRemoveImage}
                        boxShadow="lg"
                        zIndex={2}
                    />
                )}
            </Box>
        </VStack>
    );
};

ImageInput.propTypes = {
    onImageChange: PropTypes.func,
    inputProps: PropTypes.object,
    previewWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    previewHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default ImageInput;
