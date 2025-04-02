import React, { useState, useRef, useEffect } from "react";
import {
    Modal, ModalOverlay, ModalContent, ModalBody,
    Input, List, ListItem, Text, useColorModeValue
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import routes from 'routes.js';

const SearchModal = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(null);  // Theo dõi mục hiện tại được chọn
    const navigate = useNavigate();
    const inputRef = useRef(null);  // Tham chiếu đến ô Input

    // Danh sách các trang
    const pages = routes
        .filter(route => route.layout === '/admin')
        .map(route => ({
            path: `/admin${route.path}`,
            name: route.name
        }));

    const filteredPages = pages.filter(page =>
        page.name.toLowerCase().includes(query.toLowerCase())
    );

    // Màu sắc cho dark mode và light mode
    const modalBg = useColorModeValue("white", "gray.900");
    const inputBorderColor = useColorModeValue("black", "white");
    const listItemHoverColor = useColorModeValue("gray.200", "gray.700");
    const selectedBgColor = useColorModeValue("gray.200", "gray.700");
    const textColor = useColorModeValue("gray.700", "white");

    // Khi modal mở, tự động focus vào ô input và reset giá trị input
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setQuery("");
            setSelectedIndex(null); // Reset selected index
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Xử lý sự kiện bàn phím
    const handleKeyDown = (event) => {
        if (event.key === "ArrowDown") {
            // Di chuyển xuống mục kế tiếp
            setSelectedIndex(prevIndex =>
                prevIndex === null
                    ? 0
                    : Math.min(filteredPages.length - 1, prevIndex + 1)
            );
        } else if (event.key === "ArrowUp") {
            // Di chuyển lên mục trước đó
            setSelectedIndex(prevIndex =>
                prevIndex === null
                    ? 0
                    : Math.max(0, prevIndex - 1)
            );
        } else if (event.key === "Enter" && selectedIndex !== null) {
            // Điều hướng đến trang khi nhấn Enter
            handleSelect(filteredPages[selectedIndex]);
        }
    };

    const handleSelect = (page) => {
        navigate(page.path);  // Điều hướng đến trang có path
        setQuery("");
        onClose();
    };

    const handleMouseEnter = (index) => {
        setSelectedIndex(index);  // Đổi mục hiện tại khi di chuột vào
    };

    return (
        <Modal isOpen={isOpen} size="2xl" onClose={onClose} key={isOpen ? "open" : "closed"} isCentered>
            <ModalOverlay />
            <ModalContent bg={modalBg} >
                <ModalBody px={2} onKeyDown={handleKeyDown} tabIndex={-1}>
                    <Input
                        ref={inputRef}  // Gắn ref vào Input
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
                                key={page.path}  // Sử dụng path làm key
                                onClick={() => handleSelect(page)}  // Truyền page object vào handleSelect
                                _hover={{ cursor: "pointer", bg: listItemHoverColor }}
                                px={4}
                                py={2}
                                borderRadius="md"
                                bg={selectedIndex === index ? selectedBgColor : "transparent"}  // Đổi màu khi mục được chọn
                                onMouseEnter={() => handleMouseEnter(index)}  // Đổi mục hiện tại khi di chuột vào
                            >
                                <Text fontWeight="bold" color={textColor}>{page.name}</Text>
                                <Text fontSize="sm" color="gray.500">
                                    {page.path}
                                </Text>
                            </ListItem>
                        ))}
                    </List>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default SearchModal;
