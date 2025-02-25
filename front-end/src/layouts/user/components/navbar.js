import React from "react";
import {
    Box,
    Flex,
    IconButton,
    useDisclosure,
    Stack,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import Links from "./Links"; // Import Links component

function Navbar(props) {
    const { routes } = props;
    // Sử dụng useDisclosure để quản lý trạng thái mở/đóng của mobile menu
    const { isOpen, onToggle } = useDisclosure();

    return (
        <Box bg="blue.500" color="white" px={4} py={2}>
            <Flex align="center" justify="space-evenly">
                {/* Brand */}
                <Box fontSize="xl" fontWeight="bold">
                    Brand
                </Box>

                {/* Desktop Navigation Links */}
                <Flex display={{ base: "none", md: "flex" }} gap={6}>
                    <Links routes={routes} />
                </Flex>

                {/* Mobile Hamburger Menu */}
                <IconButton
                    display={{ base: "flex", md: "none" }}
                    aria-label="Toggle Menu"
                    icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                    onClick={onToggle}
                    variant="ghost"
                    color="white"
                />
            </Flex>

            {/* Mobile Navigation Menu */}
            {isOpen && (
                <Box mt={2} display={{ base: "block", md: "none" }}>
                    <Stack as="nav" spacing={2}>
                        <Links routes={routes} />
                    </Stack>
                </Box>
            )}
        </Box>
    );
}
Navbar.propTypes = {
    logoText: PropTypes.string,
    routes: PropTypes.arrayOf(PropTypes.object),
    variant: PropTypes.string,
};

export default Navbar;
