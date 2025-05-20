import React, { useState, useRef, useEffect } from "react";
import {
    Modal, ModalOverlay, ModalContent, ModalBody,
    Input, List, ListItem, Text, useColorModeValue, Flex, Kbd, Spinner, Divider
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useTypewriter } from "react-simple-typewriter";
import api from "@/config/apiConfig";
import { toSlug } from "@/utils/utils";

const SearchModal = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const navigate = useNavigate();
    const inputRef = useRef(null);
    const listRefs = useRef([]);

    const modalBg = useColorModeValue("white", "gray.900");
    const inputBorderColor = useColorModeValue("black", "white");
    const listItemHoverColor = useColorModeValue("gray.200", "gray.700");
    const selectedBgColor = useColorModeValue("gray.200", "gray.700");
    const textColor = useColorModeValue("gray.700", "white");

    const debounceTimeout = useRef(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setQuery("");
            setSelectedIndex(null);
            setSuggestions([]);
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

    // Debounced search API call
    useEffect(() => {
        if (!query.trim()) {
            setSuggestions([]);
            setHasSearched(false);
            return;
        }

        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

        debounceTimeout.current = setTimeout(async () => {
            try {
                setLoading(true);
                const res = await api.get("/Searchs/suggestions", {
                    params: { keyword: query }
                });

                const formatted = res.data.map(item => {
                    const slug = toSlug(item.name);
                    let path = "/";

                    if (item.type === "course") {
                        path = `/course/${slug}-${item.id}`;
                    } else if (item.type === "blog") {
                        path = `/blogs/${slug}-${item.id}`;
                    } else if (item.type === "coder") {
                        path = `/profile/${item.id}`;
                    }

                    return { ...item, path };
                });

                setSuggestions(formatted);
                setHasSearched(true); // ✅ Chỉ set true khi gọi xong API
            } catch (error) {
                console.error("Search API error:", error);
                setSuggestions([]);
                setHasSearched(true);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(debounceTimeout.current);
    }, [query]);

    const handleKeyDown = (event) => {
        const flatList = getFlatSuggestions();
        if (event.key === "ArrowDown") {
            setSelectedIndex(prev => (prev === null || prev === flatList.length - 1) ? 0 : prev + 1);
        } else if (event.key === "ArrowUp") {
            setSelectedIndex(prev => (prev === null || prev === 0) ? flatList.length - 1 : prev - 1);
        } else if (event.key === "Enter" && selectedIndex !== null) {
            handleSelect(flatList[selectedIndex]);
        }
    };

    const handleSelect = (item) => {
        navigate(item.path);
        setQuery("");
        setSuggestions([]);
        onClose();
    };

    const handleMouseEnter = (index) => {
        setSelectedIndex(index);
    };

    const getFlatSuggestions = () => {
        return [
            ...groupedSuggestions.course,
            ...groupedSuggestions.coder,
            ...groupedSuggestions.blog,
        ];
    };

    const groupedSuggestions = {
        course: suggestions.filter(s => s.type === "course"),
        coder: suggestions.filter(s => s.type === "coder"),
        blog: suggestions.filter(s => s.type === "blog"),
    };

    const renderGroup = (title, items, typeKey) => {
        if (items.length === 0) return null;

        const baseIndex = getFlatSuggestions().findIndex(s => s.type === items[0]?.type);

        return (
            <React.Fragment key={typeKey}>
                <Text px={4} pt={2} pb={1} bg="blue.300" fontWeight="semibold" color="black" fontSize="sm">
                    {title}
                </Text>
                <Divider mb={2} />
                {items.map((item, i) => {
                    const index = baseIndex + i;
                    return (
                        <ListItem
                            key={`${item.type}-${item.id}`}
                            ref={el => listRefs.current[index] = el}
                            onClick={() => handleSelect(item)}
                            _hover={{ cursor: "pointer", bg: listItemHoverColor }}
                            px={4}
                            py={2}
                            borderRadius="md"
                            bg={selectedIndex === index ? selectedBgColor : "transparent"}
                            onMouseEnter={() => handleMouseEnter(index)}
                        >
                            <Text fontWeight="bold" color={textColor}>
                                {item.name}
                            </Text>
                            {item.path && (
                                <Text fontSize="sm" color="gray.500">
                                    {item.path}
                                </Text>
                            )}

                        </ListItem>
                    );
                })}
                <Divider mb={2} />
            </React.Fragment>
        );
    };

    const words = [
        "Nhập từ khóa...",
        "Phím tắt Ctrl + K",
        "Tìm kiếm người dùng...",
        "Tìm kiếm bài viết...",
        "Tìm kiếm bài học...",
    ];

    const [text] = useTypewriter({
        words,
        loop: true,
        delaySpeed: 1000,
    });

    useEffect(() => {
        if (!isOpen) {
            setQuery("");
            setSelectedIndex(null);
            setSuggestions([]);
        }
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} size="2xl" onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent bg={modalBg} >
                <ModalBody px={2} onKeyDown={handleKeyDown} tabIndex={-1} minH="40vh">
                    <Input
                        ref={inputRef}
                        placeholder={text}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        mb={3}
                        _focusVisible={{ borderColor: inputBorderColor, borderWidth: "2px" }}
                        bg="transparent"
                        color={textColor}
                    />
                    {loading ? (
                        <Flex justify="center" align="center" py={6} minH="20vh">
                            <Spinner size="lg" />
                        </Flex>
                    ) : suggestions.length > 0 ? (
                        <List ps={4} maxH="50vh" overflowY="auto" minH="20vh">
                            {renderGroup("📚 Khóa học", groupedSuggestions.course, "course")}
                            {renderGroup("👤 Người dùng", groupedSuggestions.coder, "coder")}
                            {renderGroup("📝 Bài viết", groupedSuggestions.blog, "blog")}
                        </List>
                    ) : hasSearched && query.trim() !== "" ? (
                        <Flex justify="center" align="center" py={6} minH="20vh">
                            <Text fontSize="md" color="gray.500" textAlign="center">
                                ❌ Không tìm thấy kết quả phù hợp với "{query}"
                            </Text>
                        </Flex>
                    ) : null}

                    <Flex gap="5" px={5} justify="space-evenly" align="center" my={2}>
                        <Text fontSize="sm" color="gray.600" mt={2}>
                            Để chọn mục nhấn <Kbd fontWeight="bold" px={3} py={1} ml={1}>↲</Kbd>
                        </Text>
                        <Text fontSize="sm" color="gray.600" mt={2}>
                            Di chuyển
                            <Kbd px={3} fontWeight="bold" py={1} ml={2}>↓</Kbd>
                            <Kbd fontWeight="bold" px={3} py={1} ml={2}>↑</Kbd>
                        </Text>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default SearchModal;
