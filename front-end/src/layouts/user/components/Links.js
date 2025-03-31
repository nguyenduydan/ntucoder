import React from "react";
import { NavLink } from "react-router-dom";
import { Flex, Box, Text, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";

// MotionBox cho hiệu ứng di chuyển đường line
const MotionBox = motion(Box);

export default function Links({ routes, direction }) {
  const activeColor = useColorModeValue("blue.500", "blue.300");
  const inactiveColor = useColorModeValue("gray.800", "gray.500");
  return (
    <Flex direction={direction} spacing={2} gap={4} alignItems="center" position="relative">
      {routes &&
        routes.length > 0 &&
        routes.map((route, index) => (
          <NavLink
            key={index}
            to={route.path}
            style={{ textDecoration: "none", position: "relative" }}
          >
            {({ isActive }) => (
              <Box position="relative" textAlign="center">
                <Text
                  fontWeight="bold"
                  fontSize={16}
                  color={isActive ? activeColor : inactiveColor}
                  py={1}
                  px={2}
                  _hover={{ color: activeColor }}
                  transition="all 0.2s ease-in-out"
                >
                  {route.name}
                </Text>
                {/* Đường line dưới chữ, TRƯỢT qua lại thay vì dãn rộng */}
                {isActive && (
                  <MotionBox
                    layoutId="underline"
                    position="absolute"
                    bottom="-2px"
                    left="0"
                    width="100%"
                    height="4px"
                    bg={activeColor}
                    borderRadius="full"
                    initial={false} // Ngăn Framer Motion xử lý layout sai ban đầu
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Box>
            )}
          </NavLink>
        ))}
    </Flex>
  );
}
