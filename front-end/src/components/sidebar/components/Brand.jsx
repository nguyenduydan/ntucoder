import React from "react";
import { Flex, Link, Img } from "@chakra-ui/react";
import { HSeparator } from "components/separator/Separator";
import NTULogo from "assets/img/logo.png";

export function SidebarBrand() {
  return (
    <Flex align='center' direction='column'>
      <Link href="/admin/dashboard" p={2}>
        <Img src={NTULogo} alt="NTU Logo" h="80px" />
      </Link>
      <HSeparator mb='10px' />
    </Flex>
  );
}

export default SidebarBrand;
