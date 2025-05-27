import React, { useEffect, useState } from "react";
import { Box, useToast, useDisclosure } from "@chakra-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import ScrollToTop from "@/components/scroll/ScrollToTop";
import Pagination from "@/components/pagination/pagination";
import Toolbar from "components/menu/ToolBar";
import ColumnsTable from "components/separator/ColumnsTable";

import { getList, Search } from "@/config/apiService";
import { columnsData } from "views/admin/coder/components/columnsData";
import { useTitle } from "@/contexts/TitleContext";
import useDebounce from "@/hooks/useDebounce";

export default function Index() {
  useTitle("Quản lý người dùng");

  const toast = useToast();
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // State filter + search
  const [sortField, setSortField] = useState("coderName");
  const [ascending, setAscending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 600);

  const isKeywordValid = (k) => typeof k === "string" && k.trim() !== "";

  // Query keys
  const listQueryKey = ["coder", currentPage, pageSize, ascending, sortField];
  const searchQueryKey = ["coderSearch", debouncedKeyword, currentPage, pageSize];

  // Query for list (no keyword)
  const listQuery = useQuery({
    queryKey: listQueryKey,
    queryFn: () =>
      getList({
        controller: "Coder",
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

  // Query for search (with keyword)
  const searchQuery = useQuery({
    queryKey: searchQueryKey,
    queryFn: () =>
      Search({
        controller: "Coder",
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

  // Prefetch next page data
  useEffect(() => {
    const dataSource = isKeywordValid(debouncedKeyword) ? searchQuery.data : listQuery.data;
    if (dataSource?.totalPages && currentPage < dataSource.totalPages) {
      const nextPage = currentPage + 1;
      if (isKeywordValid(debouncedKeyword)) {
        queryClient.prefetchQuery({
          queryKey: ["coderSearch", debouncedKeyword, nextPage, pageSize],
          queryFn: () =>
            Search({
              controller: "Coder",
              keyword: debouncedKeyword,
              page: nextPage,
              pageSize,
            }),
        });
      } else {
        queryClient.prefetchQuery({
          queryKey: ["coder", nextPage, pageSize, ascending, sortField],
          queryFn: () =>
            getList({
              controller: "Coder",
              page: nextPage,
              pageSize,
              ascending,
              sortField,
            }),
        });
      }
    }
  }, [debouncedKeyword, searchQuery.data, listQuery.data, currentPage, pageSize, ascending, sortField, queryClient]);

  // Handlers
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
    const totalPages = isKeywordValid(debouncedKeyword)
      ? searchQuery.data?.totalPages || 0
      : listQuery.data?.totalPages || 0;
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handlePageSizeChange = (value) => {
    const newPageSize = parseInt(value, 10);
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize);
      setCurrentPage(1);
    }
  };

  const handleSearch = (newKeyword) => {
    setKeyword(newKeyword);
    setCurrentPage(1);
  };

  const refreshTable = () => {
    queryClient.invalidateQueries({ queryKey: ["coder"] });
    queryClient.invalidateQueries({ queryKey: ["coderSearch"] });
  };

  // Data for rendering
  const tableData = isKeywordValid(debouncedKeyword) ? searchQuery.data?.data : listQuery.data?.data;

  const totalPages = isKeywordValid(debouncedKeyword)
    ? searchQuery.data?.totalPages || 0
    : listQuery.data?.totalPages || 0;

  const totalRows = isKeywordValid(debouncedKeyword)
    ? searchQuery.data?.totalCount || 0
    : listQuery.data?.totalCount || 0;

  const loading = isKeywordValid(debouncedKeyword) ? searchQuery.isFetching : listQuery.isFetching;

  return (
    <ScrollToTop>
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <Toolbar onSearch={handleSearch} valueSearch={keyword} title={columnsData} />

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
