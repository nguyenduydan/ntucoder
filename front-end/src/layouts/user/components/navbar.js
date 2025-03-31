import React, { useState } from "react";
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
    Image
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import Links from "./Links";
import SearchInput from "../../../components/fields/searchInput";
import {
    renderThumb,
    renderTrack,
    renderView,
} from "components/scrollbar/Scrollbar";
import { Scrollbars } from "react-custom-scrollbars-2";
import NTULogo from "assets/img/ntu-coders.png";
import Auth from "./auth";
import { useNavigate } from "react-router-dom";
import LoadingBar from "components/loading/loadingBar";

function Navbar(props) {
    const { routes } = props;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = React.useRef();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleNavigate = (path) => {
        setLoading(true);
        navigate(path);
        setLoading(false);
    };

    const bg = useColorModeValue("white", "blue.200");
    const textColor = useColorModeValue("black", "white");

    return (
        <Box position="sticky" top="0" left="0" right="0" bg={bg} color={textColor} px={{ base: '10px', md: '15px' }} py={4} zIndex='2' boxShadow="lg">
            {/* Hiển thị LoadingBar */}
            {loading && <LoadingBar />}
            <Flex align="center" gap={0} justify="space-between">
                {/* Desktop Navigation Links */}
                <Flex display={{ base: "none", md: "flex" }} gap={1}>
                    {/* Brand */}
                    <Box
                        fontSize="xl"
                        fontWeight="bold"
                        mr={10}
                        cursor="pointer"
                        onClick={() => handleNavigate("/")}
                    >
                        <Image src={NTULogo} h="40px" />
                    </Box>
                    <Links direction="row" routes={routes} />
                </Flex>
                <Box display={{ base: "none", md: "flex" }} gap={5}>
                    <SearchInput placeholder="Tìm kiếm... (Ctrl+K)" />
                    <Auth />
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
                            color="red"
                            bg="white"
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
                                <Stack spacing={3} p={3} my="30px">
                                    <Links direction="column" routes={routes} />
                                    <SearchInput width="100px" placeholder="Tìm kiếm... (Ctrl+K)" />
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
