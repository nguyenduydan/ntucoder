import { Box, Flex, Spacer, Link } from "@chakra-ui/react";

const Header = () => {
    return (
        <Box bg="transparent" color="white" py={2} px={4}>
            <Flex align="center">
                <Box fontWeight="bold" fontSize="xl" color="blue.300">
                    Đại Học Nha Trang
                </Box>
                <Spacer />
                <Flex gap={4}>
                    <Link href="#" color="black">
                        Đăng nhập
                    </Link>
                    <Link href="#" color="black">
                        Đăng ký
                    </Link>
                </Flex>
            </Flex>
        </Box>
    );
};

export default Header;
