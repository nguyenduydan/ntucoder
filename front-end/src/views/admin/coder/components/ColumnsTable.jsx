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
  Flex,
} from '@chakra-ui/react';
import * as React from 'react';
import Card from 'components/card/Card';
import { BiSort } from 'react-icons/bi';
import { AiOutlineSortAscending, AiOutlineSortDescending } from "react-icons/ai";


export default function ColumnTable({ tableData, loading, onSort, sortField, ascending, fetchData }) {
  const { colorMode } = useColorMode(); // Lấy trạng thái chế độ màu
  const textColor = colorMode === 'light' ? 'black' : 'white'; // Đổi màu text
  const borderColor = colorMode === 'light' ? 'gray.200' : 'whiteAlpha.300';

  const renderSortIcon = (field) => {
    if (sortField !== field) return <BiSort size="20px" />;
    return ascending ? (
      <Box as="span" fontWeight="bold">
        <AiOutlineSortAscending size="20px" />
      </Box>
    ) : (
      <Box as="span" fontWeight="bold">
        <AiOutlineSortDescending size="20px" />
      </Box>
    );
  };

  return (
    <Card flexDirection="column" w="100%" px="0px" boxShadow="lg" overflowX={{ sm: 'hidden', lg: 'hidden' }} overflowY="hidden">
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
                  position="sticky" // Giữ cố định
                  top="0" // Đặt vị trí trên cùng khi cuộn
                  key={column.Header}
                  borderColor={borderColor}
                  width={column.width || 'fixed'}
                  bg={colorMode === 'dark' ? 'navy.800' : 'white'} // Màu nền để tránh bị trong suốt
                  zIndex={1}
                >
                  <Flex>
                    <Text fontSize={{ sm: '10px', lg: '12px' }} textAlign="left" fontWeight="bold" color={textColor}>
                      {column.Header}
                    </Text>
                    {(column.accessor === 'userName' || column.accessor === 'coderName') && onSort && (
                      <Box onClick={() => onSort(column.accessor)} cursor="pointer">
                        {renderSortIcon(column.accessor)}
                      </Box>
                    )}
                  </Flex>
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody >
            {!loading && tableData.length === 0 && (
              <Tr >
                <Td h="40vh" colSpan={columnsData.length} textAlign="center">
                  <Text fontSize="20px">Không có dữ liệu, vui lòng thử lại.</Text>
                </Td>
              </Tr>
            )}
            {!loading && tableData.length > 0 && tableData.map((row, index) => (
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
                    padding="10px 15px"

                  >
                    {column.Cell ? (
                      column.Cell({ value: row[column.accessor], rowIndex: index, row, fetchData })
                    ) : (
                      <Text color={textColor}>{row[column.accessor] || 'N/A'}</Text>
                    )}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Card>
  );
}
