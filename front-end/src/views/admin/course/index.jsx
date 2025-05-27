import React, { useEffect, useState } from "react";
import { Box, useToast, useDisclosure } from "@chakra-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useDebounce from "@/hooks/useDebounce";

import ScrollToTop from "@/components/scroll/ScrollToTop";
import Pagination from "@/components/pagination/pagination";
import Toolbar from "components/menu/ToolBar";
import ColumnsTable from "components/separator/ColumnsTable";
import Create from "@/views/admin/course/components/Create";

import { getList, Search } from "@/config/apiService";
import { columnsData } from "views/admin/course/components/columnsData";
import { useTitle } from "@/contexts/TitleContext";

export default function Index() {
  useTitle("Quản lý khóa học");

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();

  // State filter + search
  const [sortField, setSortField] = useState("name");
  const [ascending, setAscending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 600);

  const isKeywordValid = (k) => typeof k === "string" && k.trim() !== "";

  // Query key cho danh sách thường (không tìm kiếm)
  const listQueryKey = ["courses", currentPage, pageSize, ascending, sortField];
  // Query key cho tìm kiếm
  const searchQueryKey = ["courseSearch", debouncedKeyword, currentPage, pageSize];

  // Query lấy danh sách bình thường khi không có từ khóa tìm kiếm
  const {
    data: listData,
    isFetching: isListFetching,
    isError: isListError,
  } = useQuery({
    queryKey: listQueryKey,
    queryFn: () =>
      getList({
        controller: "Course",
        page: currentPage,
        pageSize,
        ascending,
        sortField,
      }),
    enabled: !isKeywordValid(debouncedKeyword),
    keepPreviousData: true,
    staleTime: 0,
    retry: 1,
    onError: (error) => {
      toast({
        title: "Lỗi khi tải dữ liệu",
        description: error.message || "Không thể tải dữ liệu. Vui lòng thử lại sau.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
        variant: "left-accent",
      });
    },
  });

  // Query tìm kiếm khi có từ khóa
  const {
    data: searchData,
    isFetching: isSearchFetching,
    isError: isSearchError,
  } = useQuery({
    queryKey: searchQueryKey,
    queryFn: () =>
      Search({
        controller: "Course",
        keyword: debouncedKeyword,
        page: currentPage,
        pageSize,
      }),
    enabled: isKeywordValid(debouncedKeyword),
    keepPreviousData: true,
    staleTime: 0,
    retry: 1,
    onError: (error) => {
      toast({
        title: "Lỗi khi tìm kiếm",
        description: error.message || "Không thể tìm kiếm. Vui lòng thử lại sau.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
        variant: "left-accent",
      });
    },
  });

  // Prefetch trang kế tiếp tùy theo có từ khóa hay không
  useEffect(() => {
    const sourceData = isKeywordValid(debouncedKeyword) ? searchData : listData;
    if (sourceData?.totalPages && currentPage < sourceData.totalPages) {
      const nextPage = currentPage + 1;
      if (isKeywordValid(debouncedKeyword)) {
        queryClient.prefetchQuery({
          queryKey: ["courseSearch", debouncedKeyword, nextPage, pageSize],
          queryFn: () =>
            Search({
              controller: "Course",
              keyword: debouncedKeyword,
              page: nextPage,
              pageSize,
            }),
        });
      } else {
        queryClient.prefetchQuery({
          queryKey: ["courses", nextPage, pageSize, ascending, sortField],
          queryFn: () =>
            getList({
              controller: "Course",
              page: nextPage,
              pageSize,
              ascending,
              sortField,
            }),
        });
      }
    }
  }, [
    debouncedKeyword,
    searchData,
    listData,
    currentPage,
    pageSize,
    ascending,
    sortField,
    queryClient,
  ]);

  // Các handler cập nhật state
  const handleSearch = (newKeyword) => {
    setKeyword(newKeyword);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setAscending(!ascending);
    } else {
      setSortField(field);
      setAscending(true);
    }
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0) {
      const totalPages = isKeywordValid(debouncedKeyword)
        ? searchData?.totalPages || 0
        : listData?.totalPages || 0;
      if (newPage <= totalPages) {
        setCurrentPage(newPage);
      }
    }
  };

  const handlePageSizeChange = (value) => {
    const newPageSize = parseInt(value, 10);
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize);
      setCurrentPage(1);
    }
  };

  // Hàm làm mới bảng
  const refreshTable = () => {
    queryClient.invalidateQueries({ queryKey: ["courses"] });
    queryClient.invalidateQueries({ queryKey: ["courseSearch"] });
  };

  // Dữ liệu hiển thị dựa trên keyword có hợp lệ hay không
  const tableData = isKeywordValid(debouncedKeyword) ? searchData?.data : listData?.data;
  const totalPages = isKeywordValid(debouncedKeyword) ? searchData?.totalPages || 0 : listData?.totalPages || 0;
  const totalRows = isKeywordValid(debouncedKeyword) ? searchData?.totalCount || 0 : listData?.totalCount || 0;
  const loading = isKeywordValid(keyword)
    ? isSearchFetching || debouncedKeyword !== keyword
    : isListFetching;

  return (
    <ScrollToTop>
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <Toolbar onAdd={onOpen} onSearch={handleSearch} valueSearch={keyword} title={columnsData} />
        <Create isOpen={isOpen} onClose={onClose} fetchData={refreshTable} />

        <ColumnsTable
          columnsData={columnsData}
          tableData={tableData || []}
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
