import React, { useState, useRef, useEffect } from "react";
import {
    Modal, ModalOverlay, ModalContent, ModalBody,
    Input, List, ListItem, Text, useColorModeValue, Flex, Kbd
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import routes from 'routes.js';

const SearchModal = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(null);
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const listRefs = useRef([]); // Tạo mảng các tham chiếu cho các mục trong danh sách

    const pages = routes
        .filter(route => route.layout === '/admin')
        .map(route => ({
            path: `/admin${route.path}`,
            name: route.name
        }));

    const filteredPages = pages.filter(page =>
        page.name.toLowerCase().includes(query.toLowerCase())
    );

    const modalBg = useColorModeValue("white", "gray.900");
    const inputBorderColor = useColorModeValue("black", "white");
    const listItemHoverColor = useColorModeValue("gray.200", "gray.700");
    const selectedBgColor = useColorModeValue("gray.200", "gray.700");
    const textColor = useColorModeValue("gray.700", "white");

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setQuery("");
            setSelectedIndex(null);
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (selectedIndex !== null && listRefs.current[selectedIndex]) {
            listRefs.current[selectedIndex].scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        }
    }, [selectedIndex]);

    const handleKeyDown = (event) => {
        if (event.key === "ArrowDown") {
            setSelectedIndex(prevIndex =>
                prevIndex === null || prevIndex === filteredPages.length - 1
                    ? 0
                    : prevIndex + 1
            );
        } else if (event.key === "ArrowUp") {
            setSelectedIndex(prevIndex =>
                prevIndex === null || prevIndex === 0
                    ? filteredPages.length - 1
                    : prevIndex - 1
            );
        } else if (event.key === "Enter" && selectedIndex !== null) {
            handleSelect(filteredPages[selectedIndex]);
        }
    };


    const handleSelect = (page) => {
        navigate(page.path);
        setQuery("");
        onClose();
    };

    const handleMouseEnter = (index) => {
        setSelectedIndex(index);
    };

    return (
        <Modal isOpen={isOpen} size="2xl" onClose={onClose} key={isOpen ? "open" : "closed"} isCentered>
            <ModalOverlay />
            <ModalContent bg={modalBg}>
                <ModalBody px={2} onKeyDown={handleKeyDown} tabIndex={-1}>
                    <Input
                        ref={inputRef}
                        placeholder="Nhập tên trang..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        mb={3}
                        _focusVisible={{ borderColor: inputBorderColor, borderWidth: "2px" }}
                        bg="transparent"
                        color={textColor}
                    />
                    <List ps={4} maxH="50vh" overflowY="auto">
                        {filteredPages.map((page, index) => (
                            <ListItem
                                key={page.path}
                                ref={el => listRefs.current[index] = el} // Gán ref cho từng mục
                                onClick={() => handleSelect(page)}
                                _hover={{ cursor: "pointer", bg: listItemHoverColor }}
                                px={4}
                                py={2}
                                borderRadius="md"
                                bg={selectedIndex === index ? selectedBgColor : "transparent"}
                                onMouseEnter={() => handleMouseEnter(index)}
                            >
                                <Text fontWeight="bold" color={textColor}>{page.name}</Text>
                                <Text fontSize="sm" color="gray.500">
                                    {page.path}
                                </Text>
                            </ListItem>
                        ))}
                    </List>
                    <Flex gap="5" px={5} justify="space-evenly" align="center" my={2}>
                        <Text fontSize="sm" color="gray.600" mt={2}>
                            Để chọn trang nhấn <Kbd fontWeight="bold" px={3} py={1} ml={1}>↲</Kbd>
                        </Text>
                        <Text fontSize="sm" color="gray.600" mt={2}>
                            Di chuyển lên
                            <Kbd px={3} fontWeight="bold" py={1} ml={2}>↓</Kbd>
                            <Kbd fontWeight="bold" px={3} py={1} ml={2}>↑</Kbd> để lựa chọn trang
                        </Text>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default SearchModal;
