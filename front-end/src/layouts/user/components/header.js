import { Box, Flex, Spacer, Link, Input, IconButton } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

const Header = () => {
    return (
        <Box bg="transparent" color="white" py={2} px={4}>
            <Flex align="center">
                <Box fontWeight="bold" fontSize="xl" color="blue.300">
                    Đại Học Nha Trang
                </Box>
                <Spacer />
                <Flex gap={4}>
                    <Link href="#" color="white">
                        Đăng nhập
                    </Link>
                    <Link href="#" color="white">
                        Đăng ký
                    </Link>
                    <Input placeholder="Tìm kiếm..." size="sm" width="150px" bg="white" />
                    <IconButton icon={<SearchIcon />} size="sm" aria-label="Search" />
                </Flex>
            </Flex>
        </Box>
    );
};

export default Header;
