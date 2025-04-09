import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Input, Image, VStack, IconButton, keyframes } from '@chakra-ui/react';
import { FaRegImage, FaTrashAlt } from "react-icons/fa";

// Hiệu ứng lắc và phóng to
const shakeZoom = keyframes`
  0% { transform: scale(1.1) rotate(0deg); }
  20% { transform: scale(1.12) rotate(-10deg); }
  40% { transform: scale(1.12) rotate(10deg); }
  60% { transform: scale(1.12) rotate(-10deg); }
  80% { transform: scale(1.12) rotate(10deg); }
  100% { transform: scale(1.1) rotate(0deg); }
`;

const ImageInput = ({
    onImageChange,
    inputProps = {},
    previewWidth = '150px',
    previewHeight = '150px'
}) => {
    const [preview, setPreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
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

    const handleRemoveImage = () => {
        setPreview(null);
        if (onImageChange) onImageChange(null);
    };

    return (
        <VStack align="center" spacing={2} position="relative">
            <Box position="relative" width={previewWidth} height={previewHeight}>
                <Box
                    width="100%"
                    height="100%"
                    border={preview ? 'none' : '2px dashed'}
                    borderColor="gray.300"
                    rounded="md"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    overflow="hidden"
                    bg="gray.50"
                    _hover={{ borderColor: preview ? 'none' : 'blue.400' }}
                >
                    {preview ? (
                        <Image
                            src={preview}
                            alt="Preview"
                            width="100%"
                            height="100%"
                            objectFit="cover"
                        />
                    ) : (
                        <>
                            <Input
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
                            <Box
                                position="absolute"
                                textAlign="center"
                                pointerEvents="none"
                                color="gray.500"
                            >
                                <FaRegImage fontSize="5vh" />
                            </Box>
                        </>
                    )}
                </Box>

                {preview && (
                    <IconButton
                        icon={<FaTrashAlt />}
                        size="sm"
                        colorScheme="red"
                        position="absolute"
                        top="-10px"
                        right="-10px"
                        borderRadius="full"
                        aria-label="Xóa ảnh"
                        onClick={handleRemoveImage}
                        boxShadow="lg"
                        transformOrigin="center"
                        _hover={{
                            animation: `${shakeZoom} 0.5s ease-in-out`, // rung nhẹ
                        }}
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
