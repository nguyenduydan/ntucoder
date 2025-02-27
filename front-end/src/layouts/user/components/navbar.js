import React from "react";
import {
    Box,
    Flex,
    IconButton,
    useDisclosure,
    useColorModeValue,
    DrawerCloseButton,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerBody,
    Stack,
    Image,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import Links from "./Links"; // Import Links component
import SearchInput from "../../../components/fields/searchInput"; // Import SearchInput component
import {
    renderThumb,
    renderTrack,
    renderView,
} from "components/scrollbar/Scrollbar";
import { Scrollbars } from "react-custom-scrollbars-2";
import NTULogo from "assets/img/ntu-coders.png";

function Navbar(props) {
    const { routes } = props;
    // Sử dụng useDisclosure để quản lý trạng thái mở/đóng của mobile menu
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = React.useRef();

    // Áp dụng màu theo hệ thống (light/dark) từ Chakra UI
    const bg = useColorModeValue("blue.400", "blue.200");
    const textColor = useColorModeValue("white", "black");

    return (
        <Box bg={bg} color={textColor} px={4} py={2}>
            <Flex align="center" justify="space-evenly">
                {/* Brand */}
                <Box fontSize="xl" fontWeight="bold">
                    <Image src={NTULogo} h="40px" />
                </Box>

                {/* Desktop Navigation Links */}
                <Flex display={{ base: "none", md: "flex" }} gap={3}>
                    <Links routes={routes} />
                </Flex>
                <Box display={{ base: "none", md: "block" }}>
                    <SearchInput placeholder="Tìm kiếm... (Ctrl+K)" />
                </Box>
                {/* Mobile Hamburger Menu */}
                <IconButton
                    display={{ base: "flex", md: "none" }}
                    aria-label="Toggle Menu"
                    icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                    onClick={onOpen}
                    variant="ghost"
                    color={textColor}
                />
            </Flex>

            {/* Mobile Navigation Menu */}
            {isOpen && (
                <Drawer placement="right" onClose={onClose} isOpen={isOpen} finalFocusRef={btnRef}>
                    <DrawerOverlay />
                    <DrawerContent w="285px" maxW="285px" bg={bg} color={textColor}>
                        <DrawerCloseButton
                            zIndex="3"
                            onClick={onClose}
                            _focus={{ boxShadow: "none" }}
                            _hover={{ boxShadow: "none" }}
                        />
                        <DrawerBody maxW="285px" px="0" pb="0">
                            <Scrollbars
                                autoHide
                                renderTrackVertical={renderTrack}
                                renderThumbVertical={renderThumb}
                                renderView={renderView}
                            >
                                <Stack spacing={3} p={3}>
                                    <Links routes={routes} />
                                    <SearchInput placeholder="Tìm kiếm... (Ctrl+K)" />
                                </Stack>
                            </Scrollbars>
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>
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
