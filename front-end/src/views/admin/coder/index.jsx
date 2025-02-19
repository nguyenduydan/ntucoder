import React, { useEffect, useState, useCallback } from "react";
import { Box, Button, Flex, useToast } from "@chakra-ui/react";
import api from "../../../utils/api";
import ColumnsTable from "views/admin/coder/components/ColumnsTable";
import ScrollToTop from "components/scroll/ScrollToTop";
import Pagination from "components/pagination/pagination";
import { MdAdd } from "react-icons/md";
import { useDisclosure } from "@chakra-ui/react";
import CreateCoder from "views/admin/coder/components/Create";

export default function CoderIndex() {
  //Biến cho dữ liệu bảng
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortField, setSortField] = useState("coderName");
  const [ascending, setAscending] = useState(true);
  // Biến cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  // Toast and modal
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Gọi API lấy danh sách dữ liệu
  const fetchData = useCallback(async () => {
      setLoading(true);
    try {
      const response = await api.get('/coder/getlist', {
        params: {
          Page: currentPage,
          PageSize: pageSize,
          ascending: ascending,
          sortField: sortField,
        },
      });
      const dataWithStatus = Array.isArray(response.data.data)
        ? response.data.data.map((item) => ({
            ...item,
            status: true,
          }))
        : [];
      setTableData(dataWithStatus);
      setTotalPages(response.data.totalPages || 0); // Mặc định là 0 nếu không có
      setTotalRows (response.data.totalCount || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Lỗi khi tải dữ liệu",
        description: "Không thể tải dữ liệu. Vui lòng thử lại sau.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
        variant: "left-accent",
      });
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortField, ascending,currentPage, pageSize]);

  // Sắp xếp dữ liệu
  const handleSort = (field) => {
    if (sortField === field) {
      setAscending(!ascending);
    } else {
      setSortField(field);
      setAscending(true);
    }
  };

  // Fetch data khi currentPage hoặc pageSize thay đổi
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Thay đổi trang hiện tại
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Thay đổi số lượng phần tử trên mỗi trang
  const handlePageSizeChange = (value) => {
    const newPageSize = parseInt(value, 10);
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize);
      setCurrentPage(1); // Quay về trang 1 khi thay đổi số lượng phần tử
    }
  };

  return (
    <ScrollToTop>
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <Flex mb="8px" justifyContent="end" align="end" px="25px">
          <Button
            variant="solid"
            size="lg"
            colorScheme="blackAlpha"
            bgGradient="linear(to-l, green.500, green.300)"
            borderRadius="xl"
            boxShadow="lg"
            transition="all 0.3s ease-in-out"
            _hover={{
              bgGradient: "linear(to-r, green.500, green.300)",
              color: "white",
            }}
            _active={{
              transform: "scale(0.90)",
            }}
            onClick={onOpen} // Mở modal khi nhấn nút
          >
            Thêm <MdAdd size="25" />
          </Button>
        </Flex>

        {/* Hiển thị modal CreateCoder */}
        <CreateCoder isOpen={isOpen} onClose={onClose} fetchData={fetchData} />

       <ColumnsTable
        tableData={tableData}
        loading={loading}
        onSort={handleSort}
        sortField={sortField}
        ascending={ascending}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalRows = {totalRows}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
        />
      </Box>
    </ScrollToTop>
  );
}
