import {
  Box,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { useTitle } from "utils/TitleContext";

export default function UserReports() {
  // Set title for the page
  useTitle("Trang chủ");
  // Chakra Color Mode
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Text>Xin chào mọi người</Text>
    </Box>
  );
}
