import React, { useEffect, useState } from "react";
import { Box, useToast, useDisclosure } from "@chakra-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import ScrollToTop from "@/components/scroll/ScrollToTop";
import Pagination from "@/components/pagination/pagination";
import Toolbar from "components/menu/ToolBar";
import ColumnsTable from "components/separator/ColumnsTable";
import Create from "@/views/admin/badge/components/Create";

import { getList, Search } from "@/config/apiService"; // cần có Search api
import { columnsData } from "views/admin/badge/components/columnsData";
import { useTitle } from "@/contexts/TitleContext";
import useDebounce from "@/hooks/useDebounce"; // debounce hook

export default function Index() {
  useTitle("Quản lý nhãn");

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();

  // Filter và phân trang
  const [sortField, setSortField] = useState("name");
  const [ascending, setAscending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Search và debounce
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 600);

  const isKeywordValid = (k) => typeof k === "string" && k.trim() !== "";

  // Query keys
  const listQueryKey = ["badges", currentPage, pageSize, ascending, sortField];
  const searchQueryKey = ["badgesSearch", debouncedKeyword, currentPage, pageSize];

  // Query list bình thường (không search)
  const {
    data: listData,
    isLoading: isListLoading,
  } = useQuery({
    queryKey: listQueryKey,
    queryFn: () =>
      getList({
        controller: "Badge",
        page: currentPage,
        pageSize,
        ascending,
        sortField,
      }),
    enabled: !isKeywordValid(debouncedKeyword),
    keepPreviousData: true,
    staleTime: 0,
    retry: 1,
    onError: () => {
      toast({
        title: "Lỗi khi tải dữ liệu",
        description: "Không thể tải dữ liệu. Vui lòng thử lại sau.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
        variant: "left-accent",
      });
    },
  });

  // Query search (có keyword)
  const {
    data: searchData,
    isLoading: isSearchLoading,
  } = useQuery({
    queryKey: searchQueryKey,
    queryFn: () =>
      Search({
        controller: "Badge",
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

  // Prefetch trang tiếp theo
  useEffect(() => {
    const sourceData = isKeywordValid(debouncedKeyword) ? searchData : listData;

    if (sourceData?.totalPages && currentPage < sourceData.totalPages) {
      const nextPage = currentPage + 1;
      if (isKeywordValid(debouncedKeyword)) {
        queryClient.prefetchQuery({
          queryKey: ["badgesSearch", debouncedKeyword, nextPage, pageSize],
          queryFn: () =>
            Search({
              controller: "Badge",
              keyword: debouncedKeyword,
              page: nextPage,
              pageSize,
            }),
          staleTime: 0,
          retry: 1,
        });
      } else {
        queryClient.prefetchQuery({
          queryKey: ["badges", nextPage, pageSize, ascending, sortField],
          queryFn: () =>
            getList({
              controller: "Badge",
              page: nextPage,
              pageSize,
              ascending,
              sortField,
            }),
          staleTime: 0,
          retry: 1,
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

  // Xử lý sort
  const handleSort = (field) => {
    if (sortField === field) {
      setAscending(!ascending);
    } else {
      setSortField(field);
      setAscending(true);
    }
    setCurrentPage(1);
  };

  // Xử lý thay đổi trang
  const handlePageChange = (newPage) => {
    const totalPages = isKeywordValid(debouncedKeyword)
      ? searchData?.totalPages || 0
      : listData?.totalPages || 0;

    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Xử lý thay đổi page size
  const handlePageSizeChange = (value) => {
    const newPageSize = parseInt(value, 10);
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize);
      setCurrentPage(1);
    }
  };

  // Xử lý search từ Toolbar
  const handleSearch = (newKeyword) => {
    setKeyword(newKeyword);
    setCurrentPage(1);
  };

  // Refresh dữ liệu
  const refreshTable = () => {
    queryClient.invalidateQueries({ queryKey: ["badges"] });
    queryClient.invalidateQueries({ queryKey: ["badgesSearch"] });
  };

  // Dữ liệu hiển thị
  const tableData = isKeywordValid(debouncedKeyword) ? searchData?.data : listData?.data;

  const totalPages = isKeywordValid(debouncedKeyword)
    ? searchData?.totalPages || 0
    : listData?.totalPages || 0;

  const totalRows = isKeywordValid(debouncedKeyword)
    ? searchData?.totalCount || 0
    : listData?.totalCount || 0;

  const loading = isKeywordValid(debouncedKeyword) ? isSearchLoading : isListLoading;

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
