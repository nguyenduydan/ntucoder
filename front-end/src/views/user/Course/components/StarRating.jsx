import { HStack, IconButton } from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';
import { useState } from 'react';

function StarRating({ value, onChange }) {
    const [hover, setHover] = useState(0);

    return (
        <HStack spacing={0.5}>
            {[1, 2, 3, 4, 5].map((star) => (
                <IconButton
                    key={star}
                    icon={<FaStar fontSize="24px" />}
                    variant="ghost"
                    color={star <= (hover || value) ? 'yellow.400' : 'gray.300'}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => onChange(star)}
                    aria-label={`Chọn ${star} sao`}
                    size="lg"
                    boxSize="40px"
                    _hover={{ transform: 'scale(1.2)' }}
                />
            ))}
        </HStack>
    );
}

export default StarRating;
