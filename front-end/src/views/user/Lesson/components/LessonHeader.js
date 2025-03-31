import { useState, useEffect } from "react";
import { Box, Flex, Button, Text } from "@chakra-ui/react";
import { MdArrowBackIos } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { getList } from "config/lessonService";

const LessonHeader = ({ lesson }) => {
  const navigate = useNavigate();
  //const [lessons, setLessons] = useState([]);

  // useEffect(() => {
  //   const fetchLessons = async () => {
  //     try {
  //       const response = await getList({ page: 1, pageSize: 5, ascending: true, sortField: "title" });
  //       if (response.data && response.data.length > 0) {
  //         setLessons(response.data);
  //       } else {
  //         console.log("No lessons available");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching lessons:", error);
  //     }
  //   };

  //   fetchLessons();
  // }, []);

  return (
    <Box background="rgb(14 38 67)" h="8vh">
      <Flex justifyContent="space-between" h="100%" py={2} px={4} alignItems="center">
        {/* Nút quay lại */}
        <Flex textColor="white" fontSize="xl" align="center">
          <Button
            leftIcon={<MdArrowBackIos />}
            color="white"
            size="md"
            variant="link"
            onClick={() => navigate(-1)}
            _hover={{
              transform: "translateX(-5px)",
              transition: "transform 0.3s ease",
            }}
          />
          <Text fontWeight="none" letterSpacing={1}>{lesson.lessonTitle}</Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default LessonHeader;
