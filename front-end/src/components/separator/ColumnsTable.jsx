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
  Skeleton,
  Image,
} from '@chakra-ui/react';
import * as React from 'react';
import Card from 'components/card/Card';
import { BiSort } from 'react-icons/bi';
import { AiOutlineSortAscending, AiOutlineSortDescending } from "react-icons/ai";
import NodataPng from "assets/img/nodata.png";

export default function ColumnTable({ columnsData, tableData, loading, onSort, sortField, ascending, fetchData }) {
  const { colorMode } = useColorMode(); // Lấy trạng thái chế độ màu
  const textColor = colorMode === 'light' ? 'black' : 'white'; // Đổi màu text
  const borderColor = colorMode === 'light' ? 'gray.200' : 'whiteAlpha.300';

  const maxLength = 100; // Giới hạn ký tự

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

  const CustomCell = ({ column, row, index, fetchData }) => {
    return column.Cell ? column.Cell({ value: row[column.accessor], rowIndex: index, row, fetchData }) : row[column.accessor] || 'N/A';
  };

  return (
    <Card flexDirection="column" w="100%" px="0px" boxShadow="lg" overflowX="hidden" overflowY="hidden">
      <Box
        maxH="45vh" // Đặt chiều cao tối đa cho container của bảng
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
                     {column.sortable && sortField && ( // Chỉ hiển thị biểu tượng sắp xếp nếu column có sortable và sortField có giá trị
                        <Box onClick={() => onSort && onSort(column.accessor)} cursor="pointer">
                          {renderSortIcon(column.accessor)}
                        </Box>
                      )}
                  </Flex>
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <Tr key={`skeleton-${idx}`}>
                  {columnsData.map((column) => (
                    <Td key={column.Header} fontSize={{ sm: '16px' }} width={column.width || 'auto'} borderColor="transparent" padding="12px 15px">
                      <Skeleton height="20px" />
                    </Td>
                  ))}
                </Tr>
              ))
            ) : tableData.length > 0 ? ( // Chỉ hiển thị dữ liệu nếu có
              tableData.map((row, index) => (
                <Tr _hover={{ bg: colorMode === 'dark' ? 'gray.500' : 'gray.200' }} key={index}>
                  {columnsData.map((column) => {
                    const content = row[column.accessor] || 'N/A'; // Lấy giá trị từ row[column.accessor]
                    const truncatedContent = content.length > maxLength ? content.slice(0, maxLength) + '...' : content; // Cắt chuỗi nếu cần

                    return (
                      <Td key={column.Header} fontSize={{ sm: '16px' }} width={column.width || 'auto'} borderColor="transparent">
                        {column.Cell ? (
                          <CustomCell column={column} row={row} index={index} fetchData={fetchData} />
                        ) : (
                          <Text color={textColor}>{truncatedContent}</Text>
                        )}
                      </Td>
                    );
                  })}
                </Tr>
              ))
            ) : (
              <Tr>
                <Td h="40vh" colSpan={columnsData.length} textAlign="center">
                  <Flex justify="center" align="center" height="100%">
                    <Image
                      src={NodataPng}
                      alt="Không có dữ liệu"
                      h="50%"
                      objectFit="contain"
                      backgroundColor="transparent"
                    />
                  </Flex>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
    </Card>
  );
}
