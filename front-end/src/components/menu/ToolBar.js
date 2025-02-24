import { useState } from "react";
import {
    Flex,
    Box,
    Button,
    Select,
    useColorMode,
    Tag,
    TagLabel,
    TagCloseButton,
    IconButton,
    Tooltip,
} from "@chakra-ui/react";
import { MdAdd, MdClear } from "react-icons/md";
import SearchInput from "components/fields/searchInput";

const Toolbar = ({ onSearch, onFilterChange, onAdd }) => {
    const { colorMode } = useColorMode(); // Lấy trạng thái chế độ màu
    const textColor = colorMode === "light" ? "black" : "white"; // Đổi màu text
    const bgColor = colorMode === "light" ? "white" : "gray.600";

    const [selectedFilters, setSelectedFilters] = useState([]);

    // Xử lý khi chọn filter từ Select
    const handleSelectChange = (e) => {
        const value = e.target.value;
        if (value && !selectedFilters.includes(value)) {
            const newFilters = [...selectedFilters, value];
            setSelectedFilters(newFilters);
            if (onFilterChange) onFilterChange(newFilters);
        }
        e.target.value = ""; // Reset lại select về placeholder
    };

    // Xóa từng filter khi nhấn vào nút x của tag
    const removeFilter = (value) => {
        const newFilters = selectedFilters.filter((f) => f !== value);
        setSelectedFilters(newFilters);
        if (onFilterChange) onFilterChange(newFilters);
    };

    // Xóa toàn bộ filter đã chọn
    const clearAllFilters = () => {
        setSelectedFilters([]);
        if (onFilterChange) onFilterChange([]);
    };

    return (
        <Box w="100%">
            <Flex
                w="100%"
                flexDirection={{ base: "column", md: "row" }}
                align="center"
                alignItems="center"
                justifyContent="space-between"
                mb="8px"
                px={{ base: "15px", md: "25px" }}
                gap={{ base: 4, md: 0, lg: 5 }}
            >
                <Box
                    display="flex"
                    flexDirection={{ base: "column", md: "row" }}
                    gap={2}
                    justifyContent="flex-start"
                    w="100%"
                    alignItems="center"
                >
                    <Select
                        placeholder="Lọc theo..."
                        colorScheme="blue"
                        boxShadow="sm"
                        maxW="200px"
                        bg={bgColor}
                        sx={{
                            option: {
                                color: textColor,
                                bg: bgColor,
                            },
                        }}
                        onChange={handleSelectChange}
                    >
                        <option color={textColor} value="option1">
                            Tùy chọn 1
                        </option>
                        <option color={textColor} value="option2">
                            Tùy chọn 2
                        </option>
                        <option color={textColor} value="option3">
                            Tùy chọn 3
                        </option>
                        <option color={textColor} value="option4">
                            Tùy chọn 4
                        </option>
                        <option color={textColor} value="option5">
                            Tùy chọn 5
                        </option>
                        <option color={textColor} value="option6">
                            Tùy chọn 6
                        </option>
                    </Select>
                    {selectedFilters.length > 0 && (
                        <Tooltip label="Xóa toàn bộ filter" hasArrow>
                            <IconButton
                                icon={<MdClear />}
                                onClick={clearAllFilters}
                                variant="ghost"
                                color="red"
                                size="sm"
                                fontSize={20}
                            />
                        </Tooltip>
                    )}
                    {selectedFilters.length > 0 && (
                        <Flex wrap="wrap" gap={2} >
                            {selectedFilters.map((filter) => (
                                <Tag key={filter} size="md" borderRadius="full" variant="solid" bgGradient="linear(to-r, blue.300, blue.500)">
                                    <TagLabel color="white">{filter}</TagLabel>
                                    <TagCloseButton onClick={() => removeFilter(filter)} />
                                </Tag>
                            ))}
                        </Flex>
                    )}
                </Box>
                <Box
                    display="flex"
                    flexDirection={{ base: "column", md: "row" }}
                    gap={5}
                    w="100%"
                    justifyContent="flex-end"
                    alignItems="center"
                >
                    <SearchInput
                        placeholder="Tìm kiếm...(Phím tắt: Ctrl+K)"
                        color={textColor}
                        onChange={onSearch}
                    />
                    <Button
                        variant="solid"
                        size="lg"
                        colorScheme="blackAlpha"
                        bgGradient="linear(to-l, green.500, green.300)"
                        borderRadius="xl"
                        boxShadow="lg"
                        transition="all 0.3s ease-in-out"
                        _hover={{
                            bgGradient: "linear(to-r, green.500, green.300)",
                            color: "white",
                        }}
                        _active={{ transform: "scale(0.90)" }}
                        onClick={onAdd}
                    >
                        Thêm <MdAdd size="25" />
                    </Button>
                </Box>
            </Flex>

        </Box>
    );
};

export default Toolbar;
