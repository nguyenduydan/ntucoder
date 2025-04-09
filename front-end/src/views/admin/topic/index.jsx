import React, { useEffect, useState, useCallback, useRef } from "react";
import { Box, useToast } from "@chakra-ui/react";
import ScrollToTop from "components/scroll/ScrollToTop";
import Pagination from "components/pagination/pagination";
import { useDisclosure } from "@chakra-ui/react";
import Toolbar from "components/menu/ToolBar";
import ColumnsTable from "components/separator/ColumnsTable";
// import data
import { getList } from "config/topicService";
import { columnsData } from "views/admin/topic/components/columnsData";
import Create from "views/admin/topic/components/Create";
import { useTitle } from "contexts/TitleContext";

export default function CoderIndex() {
  useTitle("Quản lý chủ đề");
  // State cho dữ liệu bảng
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prefetchCache, setPrefetchCache] = useState({});

  // Các state khác
  const [sortField, setSortField] = useState("name");
  const [ascending, setAscending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Sử dụng useRef để theo dõi lỗi, tránh hiển thị toast nhiều lần
  const errorShown = useRef(false);

  const fetchPage = useCallback(
    async (page) => {
      setLoading(true);
      try {
        const { data, totalPages: totalPagesResp, totalCount } = await getList({
          page,
          pageSize,
          ascending,
          sortField,
        });
        // Cập nhật tổng số trang và tổng số dòng chỉ từ trang 1
        if (page === 1) {
          setTotalPages(totalPagesResp);
          setTotalRows(totalCount);
        }
        // Reset error flag khi fetch thành công
        errorShown.current = false;

        setPrefetchCache(prev => ({ ...prev, [page]: data }));

        return data;
      } catch (error) {
        console.error("Error fetching data:", error);
        // Chỉ hiển thị toast nếu chưa hiển thị lỗi trước đó
        if (!errorShown.current) {
          errorShown.current = true;
          toast({
            title: "Lỗi khi tải dữ liệu",
            description: "Không thể tải dữ liệu. Vui lòng thử lại sau.",
            status: "error",
            duration: 2000,
            isClosable: true,
            position: "top",
            variant: "left-accent",
          });
        }
        return [];
      } finally {
        setLoading(false);
      }
    },
    [pageSize, ascending, sortField, toast]
  );

  const refreshTable = async () => {
    setPrefetchCache({});
    setCurrentPage(1);
    const data = await fetchPage(1);
    setTableData(data);
    if (totalPages > 1) fetchPage(2);
    if (totalPages > 2) fetchPage(3);
  };

  useEffect(() => {
    setPrefetchCache({});
    setCurrentPage(1);
    fetchPage(1);
    fetchPage(2); // Prefetch trang sau
  }, [fetchPage]);

  useEffect(() => {
    if (prefetchCache[currentPage]) {
      setTableData(prefetchCache[currentPage]);
    } else {
      fetchPage(currentPage).then((data) => setTableData(data));
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


  const handleSort = (field) => {
    if (sortField === field) {
      setAscending(!ascending);
    } else {
      setSortField(field);
      setAscending(true);
    }
    setCurrentPage(1);
    setPrefetchCache({});
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

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
        <Toolbar onAdd={onOpen} onSearch />
        {/* Modal CreateCoder */}
        <Create isOpen={isOpen} onClose={onClose} fetchData={refreshTable} />
        <ColumnsTable
          columnsData={columnsData}
          tableData={tableData}
          loading={loading}
          onSort={handleSort}
          sortField={sortField}
          ascending={ascending}
          fetchData={refreshTable}
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
