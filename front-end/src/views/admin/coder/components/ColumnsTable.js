import { columnsData } from '../variables/columnsData';
import {
  useColorMode,
  Box,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Spinner,
  Flex,
} from '@chakra-ui/react';
import * as React from 'react';
import Card from 'components/card/Card';

export default function ColumnTable({ tableData, loading }) {
  const { colorMode } = useColorMode(); // Lấy trạng thái chế độ màu
  const textColor = colorMode === 'light' ? 'black' : 'white'; // Đổi màu text
  const borderColor = colorMode === 'light' ? 'gray.200' : 'whiteAlpha.300';

  return (
    <Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
      <Box
        maxH="50vh" // Đặt chiều cao tối đa cho container của bảng
        maxW="100%"
        overflowY="auto" // Cho phép cuộn dọc khi nội dung vượt quá chiều cao
        borderColor={borderColor}
        borderRadius="md"
        mt="10px"
        mx="15px"
      >
        <Table variant="simple" borderRadius={'full'} color="gray.500" colorScheme="facebook" mb="12px" mt="5px">
          <Thead>
            <Tr>
              {columnsData.map((column) => (
                <Th
                  key={column.Header}
                  borderColor={borderColor}
                  width={column.width || 'fixed'}
                  position="sticky" // Giữ cố định
                  top="0" // Đặt vị trí trên cùng khi cuộn
                  bg={colorMode === 'dark' ? 'navy.800' : 'white'} // Màu nền để tránh bị trong suốt
                  zIndex="1" // Đảm bảo header nằm trên nội dung bảng
                >
                  <Text fontSize={{ sm: '10px', lg: '12px' }} textAlign="left" fontWeight="bold" color={textColor}>
                    {column.Header}
                  </Text>
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              <Tr>
                <Td colSpan={columnsData.length} borderColor="transparent">
                  <Flex justifyContent="center" align="center" py="20px">
                    <Spinner size="lg" color="green.500" /> <Text ml="10px">Đang tải dữ liệu...</Text>
                  </Flex>
                </Td>
              </Tr>
            ) : (
              tableData.map((row, index) => (
                <Tr
                  _hover={{
                    bg: colorMode === 'dark' ? 'gray.500' : 'gray.200', // Chọn màu nền khác nhau cho chế độ sáng và tối
                  }}
                  key={index}
                >
                  {columnsData.map((column) => (
                    <Td
                      key={column.Header}
                      fontSize={{ sm: '16px' }}
                      width={column.width || 'auto'}
                      borderColor="transparent"
                    >
                      {column.Cell ? (
                        column.Cell({ value: row[column.accessor], rowIndex: index, row })
                      ) : (
                        <Text color={textColor}>{row[column.accessor] || 'N/A'}</Text>
                      )}
                    </Td>
                  ))}
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>
    </Card>
  );
}
