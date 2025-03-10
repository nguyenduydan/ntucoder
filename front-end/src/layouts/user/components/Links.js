import React from "react";
import { NavLink } from "react-router-dom";
import { Flex, Box, Text, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";

// Tạo MotionBox từ Box của Chakra UI
const MotionBox = motion(Box);

export default function Links({ routes, direction }) {
  // Định nghĩa màu cho active/inactive link
  const activeColor = useColorModeValue("Black", "Black");
  const inactiveColor = useColorModeValue("White", "gray.600");
  const activeBg = useColorModeValue("White", "White");

  // Dùng useLocation nếu cần kiểm tra active path theo cách thủ công
  // const location = useLocation();
  // const activeRoute = (routePath) =>
  //   location.pathname.toLowerCase().includes(routePath.toLowerCase());

  return (
    <Flex direction={direction} spacing={3} gap={2} position="relative">
      {routes &&
        routes.length > 0 &&
        routes.map((route, index) => (
          <NavLink
            key={index}
            to={route.path}
            style={{ textDecoration: "none", position: "relative" }}
          >
            {({ isActive }) => (
              <MotionBox
                px={2}
                py={2}
                borderRadius="md"
                position="relative"
                layout
                transition={{ type: "spring", stiffness: 500, damping: 50 }}
              >
                {/* Nếu link đang active (hoặc activeRoute trả về true) thì render background highlight */}
                {(isActive) && (
                  <MotionBox
                    layoutId="activeBackground"
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg={activeBg}
                    borderRadius="md"
                  />
                )}
                <Text
                  position="relative" fontWeight={"bold"}
                  fontSize={16} color={isActive ? activeColor : inactiveColor}
                  transition="all 0.2s ease-in-out"
                >
                  {route.name}
                </Text>
              </MotionBox>
            )}
          </NavLink>
        ))}
    </Flex>
  );
}
