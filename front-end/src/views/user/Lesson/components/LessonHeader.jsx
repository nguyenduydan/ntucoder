import { Box, Flex, Button, Text } from "@chakra-ui/react";
import { MdArrowBackIos } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";

const LessonHeader = ({ lesson }) => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <Box bgGradient="linear(to-r,rgb(8, 84, 156),rgb(10, 35, 75),rgb(1, 2, 40))" h="8vh">
      <Flex justifyContent="space-between" h="100%" py={2} px={4} alignItems="center">
        {/* Nút quay lại */}
        <Flex textColor="white" fontSize="xl" align="center">
          <Button
            leftIcon={<MdArrowBackIos />}
            color="white"
            size="md"
            variant="link"
            onClick={() => navigate(`${location.pathname.replace(/\/\d+$/, '')}`)}
            _hover={{
              transform: "translateX(-5px)",
              transition: "transform 0.3s ease",
            }}
          />
          <Text fontWeight="none" >{lesson.lessonTitle}</Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default LessonHeader;
