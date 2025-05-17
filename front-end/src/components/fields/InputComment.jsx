import {
    HStack,
    InputGroup,
    Input,
    InputRightElement,
    IconButton,
    Avatar,
} from '@chakra-ui/react';
import { GrSend } from 'react-icons/gr';

const CommentInput = ({ coder, newComment, setNewComment, handleAddComment, ...props }) => {
    const handleSelectEmoji = (emojiChar) => {
        setNewComment((prev) => prev + emojiChar);
    };

    return (
        <HStack mt={3} align="center" spacing={3} px={5}>
            <Avatar
                size="sm"
                name={coder?.name || 'Bạn'}
                src={coder?.avatar || 'https://bit.ly/prosper-baba'}
            />
            <InputGroup bg="white">
                <Input
                    pr="5.5rem"
                    placeholder="Viết bình luận..."
                    boxShadow="md"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                    {...props}
                />
                <InputRightElement width="3rem">
                    <IconButton
                        icon={<GrSend />}
                        colorScheme="green"
                        size="sm"
                        onClick={handleAddComment}
                        aria-label="Gửi bình luận"
                    />
                </InputRightElement>
            </InputGroup>
        </HStack>
    );
};

export default CommentInput;
