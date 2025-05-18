import React from 'react';
import { IconButton } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

export const PrevArrow = ({ className, style, onClick }) => (
    <IconButton
        aria-label="Previous"
        onClick={onClick}
        className={className}
        style={{
            ...style,
            display: 'block',
            backgroundColor: 'rgba(0,0,0,0.5)',
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translate(0, -50%)',
            zIndex: 10,
        }}
    />
);

export const NextArrow = ({ className, style, onClick }) => (
    <IconButton
        aria-label="Next"
        onClick={onClick}
        className={className}
        style={{
            ...style,
            display: 'block',
            backgroundColor: 'rgba(0,0,0,0.5)',
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translate(0, -50%)',
            zIndex: 10,
        }}
    />
);
