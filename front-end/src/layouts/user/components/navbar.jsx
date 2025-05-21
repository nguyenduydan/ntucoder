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
} from "@/components/scrollbar/Scrollbar";
import { Scrollbars } from "react-custom-scrollbars-2";
import NTULogo from "assets/img/logo.png";
import Auth from "./auth";
import { useNavigate } from "react-router-dom";
import SearchModal from "@/components/fields/Search";
import { useTypewriter } from "react-simple-typewriter";
import { useEffect } from "react";

function Navbar(props) {
    const { routes } = props;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isOpenSearch, onOpen: onOpenSearch, onClose: onCloseSearch } = useDisclosure();
    const btnRef = React.useRef();
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
    };

    const bg = useColorModeValue("white", "blue.200");
    const textColor = useColorModeValue("black", "white");


    const words = [
        "Nhập từ khóa...",
        "Phím tắt Ctrl + K",
        "Tìm kiếm bài viết...",
        "Tìm kiếm bài học...",
    ];

    const [text] = useTypewriter({
        words,
        loop: true,
        delaySpeed: 1000,
    });

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.ctrlKey && event.key === "K" || event.key === "k") {
                event.preventDefault();
                onOpenSearch(); // Mở modal
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onOpenSearch]);

    return (
        <Box position="sticky" top="0" left="0" right="0" bg={bg} color={textColor} px={{ base: '10px', md: '15px' }} py={4} zIndex='2' boxShadow="lg">
            {/* Hiển thị LoadingBar */}
            <Flex align="center" gap={0} justify="space-between">
                {/* Desktop Navigation Links */}
                <Flex display={{ base: "none", lg: "flex" }} gap={1}>
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
                <Box display={{ base: "none", lg: "flex" }} gap={5}>
                    <SearchInput
                        placeholder={text}
                        boxShadow="lg"
                        borderRadius="full"
                        onClick={onOpenSearch}
                        readOnly
                    />
                    <SearchModal isOpen={isOpenSearch} onClose={onCloseSearch} />
                    <Auth />
                </Box>
                {/* Mobile Hamburger Menu */}
                <Flex w="100%" display={{ base: "flex", lg: "none" }} justifyContent="space-between">
                    <IconButton
                        aria-label="Toggle Menu"
                        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                        onClick={onOpen}
                        variant="ghost"
                        color={textColor}
                    />
                    <Box
                        fontSize="xl"
                        fontWeight="bold"
                        mr={10}
                        cursor="pointer"
                        onClick={() => handleNavigate("/")}
                    >
                        <Image src={NTULogo} h="40px" />
                    </Box>
                </Flex>

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
                                    <Auth />
                                    <Links direction="column" routes={routes} />
                                    <SearchInput
                                        placeholder={text}
                                        boxShadow="lg"
                                        borderRadius="full"
                                        onClick={onOpenSearch}
                                        readOnly
                                    />

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
