import React from "react";
import {
  Box,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";

export default function FlushedInput(props) {
  const {
    id,
    label,
    extra,
    placeholder,
    type,
    mb,
    value,
    onChange,
    boxColor,
    textColor,
    ...rest
  } = props;

  // Sử dụng giá trị mặc định nếu textColor không được truyền
  const defaultTextColor = useColorModeValue("secondaryGray.900", "white");

  return (
    <Box position="relative" w={"100%"} role="group">
      <Input
        {...rest}
        type={type}
        id={id}
        variant="flushed"
        paddingLeft={2}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        textColor={defaultTextColor}
        borderBottomWidth={2}
        borderColor="gray.300"
        _focus={{
          borderColor: "transparent",
          boxShadow: "none",
        }}
      />
      <Box
        position="absolute"
        bottom={0}
        left="50%"
        height="2px"
        width="0"
        bg="#3965FF"
        transition="width 0.3s ease, left 0.3s ease"
        _groupFocusWithin={{
          width: "100%",
          left: 0,
        }}
      />
    </Box>
  );

}
