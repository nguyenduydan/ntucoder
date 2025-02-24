import React, { useState, useRef, useEffect } from "react";
import {
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    IconButton,
    Box,
    useColorMode,
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";

const SearchInput = ({ placeholder = "Search...", onSearch }) => {
    const [value, setValue] = useState("");
    const { colorMode } = useColorMode();
    const textColor = colorMode === "light" ? "black" : "white";
    const backgroundColor = colorMode === "light" ? "gray.100" : "whiteAlpha.300";
    const iconColor = colorMode === "light" ? "black" : "whiteAlpha.700";

    // Tạo ref cho input để có thể focus khi bấm phím tắt
    const inputRef = useRef();

    const handleChange = (e) => setValue(e.target.value);

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && onSearch) {
            onSearch(value);
        }
    };

    const handleClear = () => {
        setValue("");
        if (onSearch) onSearch("");
    };

    // Lắng nghe phím tắt: Window (hoặc Ctrl) + K để focus vào input
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Vì Windows key thường không thể truy cập được, ta dùng metaKey (Cmd trên Mac) hoặc ctrlKey
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                inputRef.current && inputRef.current.focus();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <Box>
            <InputGroup>
                <InputLeftElement pointerEvents="none">
                    <SearchIcon color={textColor} />
                </InputLeftElement>
                <Input
                    ref={inputRef}
                    minW="300px"
                    variant="outline"
                    borderRadius="30px"
                    placeholder={placeholder}
                    value={value}
                    textColor={textColor}
                    bg={backgroundColor}
                    border="none"
                    boxShadow="lg"
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

        </Box>
    );
};

export default SearchInput;
