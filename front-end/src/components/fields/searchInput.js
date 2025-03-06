import React, { useState, useRef, useEffect } from "react";
import {
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    IconButton,
    Box,
    useColorMode,
    List,
    ListItem,
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";

const SearchInput = ({
    placeholder = "Search...",
    onSearch,
    onQuickSearch,
    suggestions = [],
    width = "300px",
    variant = "outline",
    borderRadius = "30px",
    bgColor,
    textColor,
    border = "none",
    boxShadow = "lg"
}) => {
    const [value, setValue] = useState("");
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const { colorMode } = useColorMode();
    const defaultTextColor = textColor || (colorMode === "light" ? "black" : "white");
    const defaultBackgroundColor = bgColor || (colorMode === "light" ? "gray.100" : "black");
    const iconColor = colorMode === "light" ? "black" : "whiteAlpha.700";
    const inputRef = useRef();

    const handleChange = (e) => {
        const inputValue = e.target.value;
        setValue(inputValue);
        if (onQuickSearch) {
            onQuickSearch(inputValue);
        }
        setFilteredSuggestions(
            suggestions.filter((s) => s.toLowerCase().includes(inputValue.toLowerCase()))
        );
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && onSearch) {
            onSearch(value);
        }
    };

    const handleClear = () => {
        setValue("");
        setFilteredSuggestions([]);
        if (onSearch) onSearch("");
    };

    const handleSuggestionClick = (suggestion) => {
        setValue(suggestion);
        setFilteredSuggestions([]);
        if (onSearch) onSearch(suggestion);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                inputRef.current && inputRef.current.focus();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <Box position="relative">
            <InputGroup>
                <InputLeftElement pointerEvents="none">
                    <SearchIcon color={defaultTextColor} />
                </InputLeftElement>
                <Input
                    ref={inputRef}
                    minW={width}
                    variant={variant}
                    borderRadius={borderRadius}
                    placeholder={placeholder}
                    value={value}
                    textColor={defaultTextColor}
                    bg={defaultBackgroundColor}
                    border={border}
                    boxShadow={boxShadow}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                />
                {value && (
                    <InputRightElement>
                        <IconButton
                            size="sm"
                            aria-label="Xóa nội dung"
                            icon={<CloseIcon />}
                            onClick={handleClear}
                            variant="ghost"
                            color={iconColor}
                            fontSize={10}
                            fontWeight={600}
                            transition="all 0.1s ease-in-out"
                            _hover={{ bg: "transparent", color: "red", fontSize: "14px" }}
                        />
                    </InputRightElement>
                )}
            </InputGroup>
            {filteredSuggestions.length > 0 && (
                <List
                    position="absolute"
                    bg={defaultBackgroundColor}
                    mt={2}
                    width={width}
                    borderRadius="md"
                    boxShadow="md"
                    zIndex={1000}
                >
                    {filteredSuggestions.map((suggestion, index) => (
                        <ListItem
                            key={index}
                            padding={2}
                            cursor="pointer"
                            _hover={{ bg: "gray.200" }}
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            {suggestion}
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
};

export default SearchInput;
