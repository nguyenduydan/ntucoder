import React, { useEffect, useState, useCallback } from "react";
import { Box, Button, Flex, useToast } from "@chakra-ui/react";
import api from "../../../config/apiConfig";
import ColumnsTable from "views/admin/coder/components/ColumnsTable";
import ScrollToTop from "components/scroll/ScrollToTop";
import Pagination from "components/pagination/pagination";
import { MdAdd } from "react-icons/md";
import { useDisclosure } from "@chakra-ui/react";
import ProgressBar from "components/loading/loadingBar";
import CreateCoder from "views/admin/coder/components/Create";
import SearchInput from "components/fields/searchInput";

export default function CoderIndex() {
  // State cho dữ liệu bảng
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prefetchCache, setPrefetchCache] = useState({}); // Cache dữ liệu theo page

  // Các state khác
  const [sortField, setSortField] = useState("coderName");
  const [ascending, setAscending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Hàm fetchPage: lấy dữ liệu cho 1 trang cụ thể và cập nhật cache
  const fetchPage = useCallback(
    async (page) => {
      setLoading(true);
      try {
        const response = await api.get("/coder/getlist", {
          params: {
            Page: page,
            PageSize: pageSize,
            ascending: ascending,
            sortField: sortField,
          },
        });
        const dataWithStatus = Array.isArray(response.data.data)
          ? response.data.data.map((item) => ({ ...item, status: true }))
          : [];
        // Cập nhật tổng số trang và tổng số dòng chỉ từ trang 1 (hoặc có thể từ response đầu tiên)
        if (page === 1) {
          setTotalPages(response.data.totalPages || 0);
          setTotalRows(response.data.totalCount || 0);
        }
        setPrefetchCache((prev) => ({ ...prev, [page]: dataWithStatus }));
        return dataWithStatus;
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
        return [];
      } finally {
        setLoading(false);
      }
    },
    [pageSize, ascending, sortField, toast]
  );

  // Khi component mount hoặc tiêu chí thay đổi, load trang 1 và 2 cùng lúc
  useEffect(() => {
    // Reset cache khi tiêu chí thay đổi
    setPrefetchCache({});
    setCurrentPage(1);
    fetchPage(1);
    fetchPage(2);
  }, [fetchPage]);

  // Khi currentPage thay đổi: nếu dữ liệu đã có trong cache thì cập nhật tableData, nếu không thì fetch
  useEffect(() => {
    if (prefetchCache[currentPage]) {
      setTableData(prefetchCache[currentPage]);
    } else {
      fetchPage(currentPage).then((data) => {
        setTableData(data);
      });
    }
   // Prefetch trang tiếp theo (currentPage+1)
    if (currentPage < totalPages && !prefetchCache[currentPage + 1]) {
      fetchPage(currentPage + 1);
    }
    // Prefetch trang sau đó (currentPage+2)
    if (currentPage + 1 < totalPages && !prefetchCache[currentPage + 2]) {
      fetchPage(currentPage + 2);
    }
  }, [currentPage, prefetchCache, fetchPage, totalPages]);

  // Sắp xếp dữ liệu
  const handleSort = (field) => {
    if (sortField === field) {
      setAscending(!ascending);
    } else {
      setSortField(field);
      setAscending(true);
    }
    // Khi thay đổi sắp xếp, reset currentPage và cache
    setCurrentPage(1);
    setPrefetchCache({});
  };

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
      setCurrentPage(1);
      setPrefetchCache({});
    }
  };

  return (
    <ScrollToTop>
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <Flex mb="8px" justifyContent="space-between" align="end" px="25px">
          <Box>
            <SearchInput placeholder="Tìm kiếm..." />
          </Box>
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
            _active={{ transform: "scale(0.90)" }}
            onClick={onOpen}
          >
            Thêm <MdAdd size="25" />
          </Button>
        </Flex>
        {/* Modal CreateCoder */}
        <CreateCoder isOpen={isOpen} onClose={onClose} fetchData={fetchPage} />
        {/* Hiển thị loading bar nếu cần */}
        {loading && (
          <Box
            w="100%"
            py="20px"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <ProgressBar />
          </Box>
        )}
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
          totalRows={totalRows}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
        />
      </Box>
    </ScrollToTop>
  );
}
