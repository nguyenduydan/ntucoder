import React, { useState } from "react";
import { Input, InputGroup, InputLeftElement, Box, useColorMode } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

const SearchInput = ({ placeholder = "Tìm kiếm...", onSearch }) => {
    const [value, setValue] = useState("");
    const { colorMode } = useColorMode(); // Lấy trạng thái chế độ màu
    const textColor = colorMode === 'light' ? 'black' : 'white'; // Đổi màu text
    const backgroundColor = colorMode === 'light' ? 'gray.200' : 'whiteAlpha.300';
    const handleChange = (e) => setValue(e.target.value);

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && onSearch) {
            onSearch(value);
        }
    };

    return (
        <Box>
            <InputGroup >
                <InputLeftElement pointerEvents="none">
                    <SearchIcon color={textColor} />
                </InputLeftElement>
                <Input
                    variant="outline"
                    borderRadius="30px"
                    border={"none"}
                    placeholder={placeholder}
                    value={value}
                    textColor={textColor}
                    bg={backgroundColor}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                />
            </InputGroup>
        </Box>
    );
};

export default SearchInput;
