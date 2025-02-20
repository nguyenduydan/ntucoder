// Chakra imports
import {
  Box,
  Flex,
  FormLabel,
  Switch,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
// Custom components
import React from "react";

export default function Default(props) {
  const {
    id,
    label,
    isChecked,
    onChange,
    desc,
    textWidth,
    reversed,
    fontSize,
    ...rest
  } = props;

  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const [checked, setChecked] = React.useState(isChecked);

  // Handle the switch background color
  const switchBg = checked ? "blue.500" : "gray.300";

  return (
    <Box w="100%" fontWeight="500"{...rest}>
      {reversed ? (
        <Flex align="center" justifyContent="center" borderRadius="16px" >
          <Switch
            isChecked={checked}
            id={id}
            variant="main"
            colorScheme="brandScheme"
            size="md"
            position="static"
            onChange={(e) => {
              setChecked(e.target.checked);
              if (onChange) onChange(e);
            }}
            sx={{
              ".chakra-switch__track": {
                bg: switchBg,
              },
              ".chakra-switch__thumb": {
                position: "static !important",
              },
              ".chakra-switch__thumb[data-checked]": {
                position: "static !important",
              }
            }}
          />
          <FormLabel
            ms="15px"
            htmlFor={id}
            _hover={{ cursor: "pointer" }}
            direction="column"
            mb="0px"
            maxW={textWidth ? textWidth : "75%"}
          >
            <Text color={textColorPrimary} fontSize="md" fontWeight="500">
              {label}
            </Text>
            <Text
              color="secondaryGray.600"
              fontSize={fontSize ? fontSize : "md"}
            >
              {desc}
            </Text>
          </FormLabel>
        </Flex>
      ) : (
        <Flex justify="space-between" align="center" borderRadius="16px">
          <FormLabel
            htmlFor={id}
            _hover={{ cursor: "pointer" }}
            direction="column"
            maxW={textWidth ? textWidth : "75%"}
          >
            <Text color={textColorPrimary} fontSize="md" fontWeight="500">
              {label}
            </Text>
            <Text
              color="secondaryGray.600"
              fontSize={fontSize ? fontSize : "md"}
            >
              {desc}
            </Text>
          </FormLabel>
          <Switch
            isChecked={checked}
            id={id}
            variant="main"
            colorScheme="brandScheme"
            size="md"
            onChange={(e) => {
              setChecked(e.target.checked);
              if (onChange) onChange(e);
            }}
            sx={{
              ".chakra-switch__track": {
                bg: switchBg,
              }
            }}
          />
        </Flex>
      )}
    </Box>
  );
}
