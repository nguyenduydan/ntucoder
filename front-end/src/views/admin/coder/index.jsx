import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { Box, Button, Flex, useToast } from "@chakra-ui/react";
import api from "../../../config/apiConfig";
import ColumnsTable from "views/admin/coder/components/ColumnsTable";
import ScrollToTop from "components/scroll/ScrollToTop";
import Pagination from "components/pagination/pagination";
import { MdAdd } from "react-icons/md";
import { useDisclosure } from "@chakra-ui/react";
import CreateCoder from "views/admin/coder/components/Create";
import { debounce } from "lodash";
import ProgressBar from 'components/loading/loadingBar';

export default function CoderIndex() {
  // Biến cho dữ liệu bảng
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortField, setSortField] = useState("coderName");
  const [ascending, setAscending] = useState(true);
  // Biến cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  // Toast và modal
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  // Ref cho sentinel (dùng cho infinite scroll)
  const sentinelRef = useRef(null);

  // Định nghĩa fetchData với useCallback
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/coder/getlist", {
        params: {
          Page: currentPage,
          PageSize: pageSize,
          ascending: ascending,
          sortField: sortField,
        },
      });
      const newData = Array.isArray(response.data.data)
        ? response.data.data.map((item) => ({
            ...item,
            status: true,
          }))
        : [];
      // Nếu đang load trang 1 thì reset, ngược lại thêm dữ liệu mới vào mảng đã có
      setTableData((prevData) =>
        currentPage === 1 ? newData : [...prevData, ...newData]
      );
      setTotalPages(response.data.totalPages || 0);
      setTotalRows(response.data.totalCount || 0);
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
  }, [sortField, ascending, currentPage, pageSize, toast]);

  // Tạo phiên bản debounce của fetchData bằng useMemo
  const debouncedFetchData = useMemo(() => debounce(fetchData, 500), [fetchData]);

  // Gọi debouncedFetchData mỗi khi các dependencies thay đổi
  useEffect(() => {
    debouncedFetchData();
    return () => {
      debouncedFetchData.cancel();
    };
  }, [debouncedFetchData]);

  // Sử dụng Intersection Observer cho Infinite Scrolling
  useEffect(() => {
    const currentSentinel = sentinelRef.current;
    if (!currentSentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && currentPage < totalPages) {
          setCurrentPage((prev) => prev + 1);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      }
    );
    observer.observe(currentSentinel);
    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [loading, currentPage, totalPages]);

  // Sắp xếp dữ liệu: reset trang và dữ liệu khi thay đổi sắp xếp
  const handleSort = (field) => {
    if (sortField === field) {
      setAscending(!ascending);
    } else {
      setSortField(field);
      setAscending(true);
    }
    setCurrentPage(1);
    setTableData([]);
  };

  // Thay đổi trang thủ công
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      if (newPage === 1) {
        setTableData([]);
      }
    }
  };

  // Thay đổi số lượng phần tử trên mỗi trang
  const handlePageSizeChange = (value) => {
    const newPageSize = parseInt(value, 10);
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize);
      setCurrentPage(1);
      setTableData([]);
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
            onClick={onOpen}
          >
            Thêm <MdAdd size="25" />
          </Button>
        </Flex>

        {/* Hiển thị modal CreateCoder */}
        <CreateCoder isOpen={isOpen} onClose={onClose} fetchData={debouncedFetchData} />

        <ColumnsTable
          tableData={tableData}
          loading={loading}
          onSort={handleSort}
          sortField={sortField}
          ascending={ascending}
        />

        {/* Sentinel element cho Infinite Scrolling */}
        <div ref={sentinelRef} />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalRows={totalRows}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
        />

        {/* Hiển thị Loading Bar*/}
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
      </Box>
    </ScrollToTop>
  );
}
