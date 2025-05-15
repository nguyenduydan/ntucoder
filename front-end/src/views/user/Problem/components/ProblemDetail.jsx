// ProblemDetail.js
import React from 'react';
import { Box, Button } from '@chakra-ui/react';
import { MdArrowBackIos } from 'react-icons/md';
import sanitizeHtml from "@/utils/sanitizedHTML";


const ProblemDetail = ({ problem, onBack }) => {
    return (
        <Box>
            <Button
                leftIcon={<MdArrowBackIos />}
                color="blue.500"
                size="md"
                variant="link"
                onClick={onBack}
                _hover={{
                    transform: "translateX(-5px)",
                    transition: "transform 0.3s ease",
                }}
                mb={3}
            >
                Quay lại danh sách bài tập
            </Button>
            <Box fontSize="xl" fontWeight="bold" mb={2}>
                {problem?.problemName}
            </Box>
            <Box sx={{ wordBreak: "break-word" }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(problem?.problemContent) }} />
        </Box>
    );
};

export default ProblemDetail;
