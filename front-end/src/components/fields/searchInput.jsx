import React, { useRef, useEffect, useMemo } from "react";
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
    value,
    onChange = () => { },
    onSearch,
    suggestions = [],
    ...props
}) => {
    const { colorMode } = useColorMode();
    const iconColor = colorMode === "light" ? "black" : "whiteAlpha.700";
    const inputRef = useRef();

    const filteredSuggestions = useMemo(() => {
        if (!value) return [];
        return suggestions.filter((s) =>
            s.toLowerCase().includes(value.toLowerCase())
        );
    }, [value, suggestions]);

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && onSearch) {
            onSearch(value);
        }
    };

    const handleClear = () => {
        onChange({ target: { value: "" } });
        if (onSearch) onSearch("");
    };

    const handleSuggestionClick = (suggestion) => {
        onChange({ target: { value: suggestion } });
        if (onSearch) onSearch(suggestion);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <Box position="relative" {...props}>
            <InputGroup>
                <InputLeftElement pointerEvents="none">
                    <SearchIcon />
                </InputLeftElement>
                <Input
                    ref={inputRef}
                    value={value}
                    onChange={onChange}
                    onKeyPress={handleKeyPress}
                    width="100%"
                    {...props}
                />
                {value && (
                    <InputRightElement>
                        <IconButton
                            size="sm"
                            aria-label="Clear input"
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
                    bg={colorMode === "light" ? "gray.100" : "black"}
                    mt={2}
                    width="100%"
                    borderRadius="md"
                    boxShadow="md"
                    zIndex={1000}
                    maxHeight="200px"
                    overflowY="auto"
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
