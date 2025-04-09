import React, { useEffect, useState, useCallback, useRef } from "react";
import { Box, useToast } from "@chakra-ui/react";
import ScrollToTop from "components/scroll/ScrollToTop";
import Pagination from "components/pagination/pagination";
import { useDisclosure } from "@chakra-ui/react";
import Toolbar from "components/menu/ToolBar";
import ColumnsTable from "components/separator/ColumnsTable";
// import data
import { getList } from "config/compilerService";
import { columnsData } from "views/admin/compiler/components/columnsData";
import Create from "views/admin/compiler/components/Create";
import { useTitle } from "contexts/TitleContext";

export default function CourseIndex() {
  useTitle("Quản lý biên dịch");
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

        // Cập nhật cache
        setPrefetchCache((prev) => ({ ...prev, [page]: data }));
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

  // Refresh table khi cần thiết
  const refreshTable = async () => {
    setPrefetchCache({});
    setCurrentPage(1);
    const data = await fetchPage(1);
    setTableData(data);
  };

  // Khi component mount hoặc tiêu chí thay đổi, chỉ tải trang 1 và 2
  useEffect(() => {
    const loadData = async () => {
      setPrefetchCache({});
      setCurrentPage(1);
      const data = await fetchPage(1);
      setTableData(data);
    };

    loadData();
  }, [fetchPage]);

  // Khi currentPage thay đổi: nếu dữ liệu đã có trong cache thì cập nhật tableData, nếu không thì fetch
  useEffect(() => {
    const fetchCurrentPage = async () => {
      // Nếu dữ liệu cho currentPage đã có trong cache thì chỉ cần sử dụng cache
      if (prefetchCache[currentPage]) {
        setTableData(prefetchCache[currentPage]);
      } else {
        // Fetch dữ liệu nếu chưa có
        const data = await fetchPage(currentPage);
        setTableData(data);
      }

      // Prefetch trang tiếp theo (currentPage + 1) và trang sau đó (currentPage + 2) nếu cần
      if (currentPage < totalPages) {
        if (!prefetchCache[currentPage + 1]) {
          fetchPage(currentPage + 1);
        }
        if (currentPage + 1 < totalPages && !prefetchCache[currentPage + 2]) {
          fetchPage(currentPage + 2);
        }
      }
    };

    fetchCurrentPage();
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
      setCurrentPage(1); // Reset trang về 1 khi thay đổi pageSize
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
