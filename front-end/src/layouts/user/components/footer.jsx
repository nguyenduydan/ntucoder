import React from "react";
import { NavLink } from "react-router-dom";
import {
    Box,
    Container,
    Divider,
    Flex,
    Grid,
    GridItem,
    HStack,
    Icon,
    Link,
    Text,
    VStack,
    useColorModeValue,
} from "@chakra-ui/react";
import {
    FaFacebook,
    FaLinkedin,
    FaYoutube,
    FaGithub,
} from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

export default function Footer() {
    const bgColor = useColorModeValue("gray.50", "gray.900");
    const textColor = useColorModeValue("gray.600", "gray.300");
    const headingColor = useColorModeValue("gray.800", "white");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const linkHoverColor = useColorModeValue("blue.500", "blue.300");

    const socialLinks = [
        { icon: FaFacebook, href: "https://www.facebook.com/nguyenthietduydan", label: "Facebook" },
        { icon: FaLinkedin, href: "https://www.linkedin.com/in/nguyenthietduydan", label: "LinkedIn" },
        { icon: FaYoutube, href: "https://www.youtube.com/@fogvn-gaming9545", label: "YouTube" },
        { icon: FaGithub, href: "https://github.com/nguyenduydan", label: "GitHub" },
    ];

    const quickLinks = [
        { name: "Trang chủ", href: "/" },
        { name: "Khóa học", href: "/course" },
        { name: "Xếp hạng", href: "/ranking" },
        { name: "Bài viết", href: "/blogs" },
    ];

    return (
        <Box
            as="footer"
            bg={bgColor}
            borderTop="1px solid"
            borderColor={borderColor}
            mt="auto"
        >
            <Container maxW="7xl" py={10}>
                <Grid
                    templateColumns={{
                        base: "1fr",
                        md: "repeat(2, 1fr)",
                        lg: "repeat(3, 1fr)",
                    }}
                    gap={8}
                >
                    {/* Company Info */}
                    <GridItem>
                        <VStack align="flex-start" spacing={4}>
                            <Text
                                fontSize="xl"
                                fontWeight="bold"
                                color={headingColor}
                            >
                                NTU-CODER-LMS
                            </Text>
                            <Text color={textColor} fontSize="sm">
                                Chúng tôi chuyên cung cấp các giải pháp công nghệ
                                hiện đại, giúp doanh nghiệp phát triển bền vững
                                trong thời đại số.
                            </Text>

                            {/* Contact Info */}
                            <VStack align="flex-start" spacing={2}>
                                <HStack>
                                    <Icon as={MdEmail} color={textColor} />
                                    <Text fontSize="sm" color={textColor}>
                                        duydan.cv@gmail.com
                                    </Text>
                                </HStack>
                                <HStack>
                                    <Icon as={MdPhone} color={textColor} />
                                    <Text fontSize="sm" color={textColor}>
                                        0898394312
                                    </Text>
                                </HStack>
                                <HStack>
                                    <Icon as={MdLocationOn} color={textColor} />
                                    <Text fontSize="sm" color={textColor}>
                                        Khánh Hòa, Việt Nam
                                    </Text>
                                </HStack>
                            </VStack>
                        </VStack>
                    </GridItem>

                    {/* Quick Links */}
                    <GridItem>
                        <VStack align="center" spacing={4}>
                            <Text
                                fontSize="lg"
                                fontWeight="semibold"
                                color={headingColor}
                            >
                                Menu
                            </Text>
                            <VStack align="flex-start" spacing={2}>
                                {quickLinks.map((link, index) => (
                                    <NavLink
                                        key={index}
                                        to={link.href}
                                    >
                                        <Text
                                            fontSize="15px"
                                            color={textColor}
                                            textDecoration="none"
                                            transition="all 0.2s ease-in-out"

                                            _hover={{
                                                color: linkHoverColor,
                                            }}
                                        >
                                            {link.name}
                                        </Text>
                                    </NavLink>
                                ))}
                            </VStack>
                        </VStack>
                    </GridItem>

                    {/* Social Media */}
                    <GridItem>
                        <VStack align="flex-start" spacing={4}>
                            <Text
                                fontSize="lg"
                                fontWeight="semibold"
                                color={headingColor}
                            >
                                Kết nối với chúng tôi
                            </Text>

                            {/* Social Icons */}
                            <HStack spacing={3}>
                                {socialLinks.map((social, index) => (
                                    <Link
                                        key={index}
                                        href={social.href}
                                        isExternal
                                        _hover={{ transform: "translateY(-2px)" }}
                                        transition="all 0.2s"
                                    >
                                        <Icon
                                            as={social.icon}
                                            w={5}
                                            h={5}
                                            color={textColor}
                                            _hover={{ color: linkHoverColor }}
                                        />
                                    </Link>
                                ))}
                            </HStack>

                            <Text fontSize="sm" color={textColor}>
                                Theo dõi chúng tôi trên các mạng xã hội để cập nhật
                                những thông tin mới nhất về công nghệ và dịch vụ.
                            </Text>
                        </VStack>
                    </GridItem>
                </Grid>

                {/* Divider */}
                <Divider my={8} borderColor={borderColor} />

                {/* Bottom Section */}
                <Flex
                    direction={{ base: "column", md: "row" }}
                    justify="space-between"
                    align="center"
                    gap={4}
                >
                    <Text fontSize="sm" color={textColor}>
                        © {new Date().getFullYear()} FogVN. All rights reserved.
                        Designed with ❤️ in Vietnam.
                    </Text>
                </Flex>
            </Container>
        </Box>
    );
}
