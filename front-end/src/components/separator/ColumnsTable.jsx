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
  Spinner,
  Image,
} from '@chakra-ui/react';
import * as React from 'react';
import Card from 'components/card/Card';
import { BiSort } from 'react-icons/bi';
import { AiOutlineSortAscending, AiOutlineSortDescending } from "react-icons/ai";
import NodataPng from "assets/img/nodata.png";
import NProgress from 'nprogress';
import { useEffect } from 'react';

export default function ColumnsTable({ columnsData, tableData = [], loading, onSort, sortField, ascending, fetchData }) {
  const { colorMode } = useColorMode();
  const textColor = colorMode === 'light' ? 'black' : 'white';
  const borderColor = colorMode === 'light' ? 'gray.200' : 'whiteAlpha.300';

  const maxLength = 100;

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

  useEffect(() => {
    if (loading) {
      NProgress.start();
    } else {
      NProgress.done();
    }

    // Cleanup khi component unmount
    return () => {
      NProgress.done();
    };
  }, [loading]);

  const CustomCell = ({ column, row, index, fetchData }) => {
    return column.Cell ? column.Cell({ value: row[column.accessor], rowIndex: index, row, fetchData }) : row[column.accessor] || 'N/A';
  };

  return (
    <Card flexDirection="column" w="100%" px="0px" boxShadow="lg" overflowX="hidden" overflowY="hidden" position="relative">
      <Box
        maxH="45vh"
        maxW="100%"
        overflowY="auto"
        borderColor={borderColor}
        borderRadius="md"
        mt="10px"
        mx="15px"
        position="relative"
      >
        <Table variant="simple" borderRadius={'full'} color="gray.500" colorScheme="facebook" mb="12px" mt="5px">
          <Thead>
            <Tr>
              {columnsData.map((column) => (
                <Th
                  position="sticky"
                  top="0"
                  key={column.Header}
                  borderColor={borderColor}
                  width={column.width || 'fixed'}
                  bg={colorMode === 'dark' ? 'navy.800' : 'white'}
                  zIndex={1}
                >
                  <Flex>
                    <Text fontSize={{ sm: '10px', lg: '12px' }} textAlign="left" fontWeight="bold" color={textColor}>
                      {column.Header}
                    </Text>
                    {column.sortable && onSort && (
                      <Box onClick={() => onSort(column.accessor)} cursor="pointer">
                        {renderSortIcon(column.accessor)}
                      </Box>
                    )}
                  </Flex>
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {tableData.length > 0 ? (
              tableData.map((row, index) => (
                <Tr _hover={{ bg: colorMode === 'dark' ? 'gray.500' : 'gray.200' }} key={row.id || index}>
                  {columnsData.map((column) => {
                    const content = row[column.accessor] || 'N/A';
                    const truncatedContent = typeof content === 'string' && content.length > maxLength ? content.slice(0, maxLength) + '...' : content;

                    return (
                      <Td
                        key={column.Header}
                        fontSize="clamp(12px, 2vw, 16px)"
                        width={column.width || 'auto'}
                        borderColor="transparent"
                        padding="12px 20px"
                      >
                        {column.Cell ? (
                          <CustomCell column={column} row={row} index={index} fetchData={fetchData} />
                        ) : (
                          <Text color={textColor} maxW="200px">{truncatedContent}</Text>
                        )}
                      </Td>
                    );
                  })}
                </Tr>
              ))
            ) : loading ? (
              // Nếu không có dữ liệu và đang loading thì hiện spinner chính giữa
              <Tr>
                <Td colSpan={columnsData.length}>
                  <Flex justify="center" align="center" height="200px">
                    <Spinner size="lg" />
                  </Flex>
                </Td>
              </Tr>
            ) : (
              // Không có dữ liệu và không loading thì show ảnh No Data
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

        {loading && tableData.length > 0 && (
          <Box position="absolute" top="10px" right="20px" zIndex={10}>
            {/*Không hiển thị gì*/}
          </Box>
        )}
      </Box>
    </Card>
  );
}
