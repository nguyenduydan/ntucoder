import React from "react";

// Chakra imports
import { Flex, useColorModeValue, Link } from "@chakra-ui/react";

// Custom components
import { NTULogo } from "components/icons/Icons";
import { HSeparator } from "components/separator/Separator";

export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue("navy.700", "white");

  return (
    <Flex align='center' direction='column'>
      <Link href="/admin/dashboard">
        <NTULogo h='26px' w='175px' my='20px' color={logoColor} />
      </Link>
      <HSeparator mb='20px' />
    </Flex>
  );
}

export default SidebarBrand;
