import React from "react";
import {
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

export function SearchBar({ onOpen, ...rest }) { // Nhận props onOpen từ cha
  const searchIconColor = useColorModeValue("gray.700", "white");
  const inputBg = useColorModeValue("secondaryGray.300", "navy.900");
  const inputText = useColorModeValue("gray.700", "gray.100");

  return (
    <InputGroup w={{ base: "100%", md: "200px" }} {...rest}>
      <InputLeftElement>
        <IconButton
          bg="inherit"
          borderRadius="inherit"
          _hover="none"
          _active={{ bg: "inherit", transform: "none", borderColor: "transparent" }}
          _focus={{ boxShadow: "none" }}
          icon={<SearchIcon color={searchIconColor} w="15px" h="15px" />}
          onClick={onOpen} // Khi bấm vào icon tìm kiếm, mở modal
        />
      </InputLeftElement>
      <Input
        variant="search"
        fontSize="sm"
        bg={inputBg}
        color={inputText}
        fontWeight="500"
        _placeholder={{ color: "gray.400", fontSize: "14px" }}
        borderRadius="30px"
        placeholder="Search pages..."
        onClick={onOpen} // Khi bấm vào input, mở modal
        readOnly // Tránh gõ vào input (vì nó dùng để mở modal)
      />
    </InputGroup>
  );
}
