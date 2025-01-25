import React, { useEffect, useState, useCallback } from "react";
import { Box, Button, Flex, useToast } from "@chakra-ui/react";
import api from "../../../utils/api";
import ColumnsTable from "views/admin/coder/components/ColumnsTable";
import ScrollToTop from "components/scroll/ScrollToTop";
import Pagination from "components/pagination/pagination";
import { MdAdd } from "react-icons/md";
import { Link } from "react-router-dom";

export default function CoderIndex() {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const toast = useToast(); // Hiển thị thông báo

  // Gọi API lấy danh sách dữ liệu
  const fetchData = useCallback(async () => {
      setLoading(true);
    try {
      const response = await api.get(`/coder/getlist`, {
        params: {
          Page: currentPage,
          PageSize: pageSize,
          ascending: true,
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
  }, [currentPage, pageSize]);



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

  // Điều kiện hiển thị loading chỉ khi dữ liệu lớn hoặc có nhiều trang
  //const shouldShowLoading = loading && (tableData?.length === 0 || totalPages === 0);

  return (
    <ScrollToTop>
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <Flex mb="8px" justifyContent="end" align="end" px="25px">
          <Link to="create">
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
            >
              Thêm <MdAdd size="25" />
            </Button>
          </Link>
        </Flex>

       <ColumnsTable tableData={tableData} loading={loading} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
      />
      </Box>

    </ScrollToTop>
  );
}
