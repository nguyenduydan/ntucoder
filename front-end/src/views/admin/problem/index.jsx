import React, { useEffect, useState } from "react";
import { Box, useToast, useDisclosure } from "@chakra-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import ScrollToTop from "@/components/scroll/ScrollToTop";
import Pagination from "@/components/pagination/pagination";
import Toolbar from "components/menu/ToolBar";
import ColumnsTable from "components/separator/ColumnsTable";
import Create from "@/views/admin/problem/components/Create";

import { getList, Search } from "@/config/apiService"; // giả sử Search api có sẵn
import { columnsData } from "views/admin/problem/components/columnsData";
import { useTitle } from "@/contexts/TitleContext";
import useDebounce from "@/hooks/useDebounce"; // debounce hook
import api from "@/config/apiConfig";

export default function Index() {
  useTitle("Quản lý bài tập");

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();

  // Filter & pagination
  const [sortField, setSortField] = useState("name");
  const [ascending, setAscending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Search
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 600);

  const isKeywordValid = (k) => typeof k === "string" && k.trim() !== "";

  // Query keys
  const listQueryKey = ["problems", currentPage, pageSize, ascending, sortField];
  const searchQueryKey = ["problemsSearch", debouncedKeyword, currentPage, pageSize];

  const [testcaseCounts, setTestcaseCounts] = useState({});

  // Load list (không search)
  const {
    data: listData,
    isLoading: isListLoading,
  } = useQuery({
    queryKey: listQueryKey,
    queryFn: () =>
      getList({
        controller: "Problem",
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

  // Load search
  const {
    data: searchData,
    isLoading: isSearchLoading,
  } = useQuery({
    queryKey: searchQueryKey,
    queryFn: () =>
      Search({
        controller: "Problem",
        keyword: debouncedKeyword,
        page: currentPage,
        pageSize,
      }),
    enabled: isKeywordValid(debouncedKeyword),
    keepPreviousData: true,
    staleTime: 0,
    retry: 1,
    onError: () => {
      toast({
        title: "Lỗi khi tìm kiếm",
        description: "Không thể tìm kiếm. Vui lòng thử lại sau.",
        status: "error",
        duration: 2000,
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
          queryKey: ["problemsSearch", debouncedKeyword, nextPage, pageSize],
          queryFn: () =>
            Search({
              controller: "Problem",
              keyword: debouncedKeyword,
              page: nextPage,
              pageSize,
            }),
          staleTime: 0,
          retry: 1,
        });
      } else {
        queryClient.prefetchQuery({
          queryKey: ["problems", nextPage, pageSize, ascending, sortField],
          queryFn: () =>
            getList({
              controller: "Problem",
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

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setAscending(!ascending);
    } else {
      setSortField(field);
      setAscending(true);
    }
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    const totalPages = isKeywordValid(debouncedKeyword)
      ? searchData?.totalPages || 0
      : listData?.totalPages || 0;

    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle page size change
  const handlePageSizeChange = (value) => {
    const newPageSize = parseInt(value, 10);
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize);
      setCurrentPage(1);
    }
  };

  // Handle search input
  const handleSearch = (newKeyword) => {
    setKeyword(newKeyword);
    setCurrentPage(1);
  };

  // Refresh data
  const refreshTable = () => {
    queryClient.invalidateQueries({ queryKey: ["problems"] });
    queryClient.invalidateQueries({ queryKey: ["problemsSearch"] });
  };

  // Data cho table
  const tableData = isKeywordValid(debouncedKeyword) ? searchData?.data : listData?.data;

  const totalPages = isKeywordValid(debouncedKeyword)
    ? searchData?.totalPages || 0
    : listData?.totalPages || 0;

  const totalRows = isKeywordValid(debouncedKeyword)
    ? searchData?.totalCount || 0
    : listData?.totalCount || 0;

  const loading = isKeywordValid(debouncedKeyword) ? isSearchLoading : isListLoading;

  // Fetch testcase counts whenever data thay đổi
  useEffect(() => {
    const sourceData = isKeywordValid(debouncedKeyword) ? searchData : listData;
    const problemIds = sourceData?.data?.map((item) => item.problemID);

    if (problemIds && problemIds.length > 0) {
      api.post("/TestCase/count", problemIds, {
        headers: { "Content-Type": "application/json" }
      })
        .then((res) => setTestcaseCounts(res.data))
        .catch(() => setTestcaseCounts({}));

    }
  }, [searchData, listData, debouncedKeyword]);

  // Tạo dữ liệu mới với count đính kèm
  const tableDataWithCount = React.useMemo(() => {
    if (!tableData) return [];

    return tableData.map((item) => ({
      ...item,
      testCaseCount: testcaseCounts[item.problemID] ?? null,
    }));
  }, [tableData, testcaseCounts]);

  return (
    <ScrollToTop>
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <Toolbar onAdd={onOpen} onSearch={handleSearch} valueSearch={keyword} title={columnsData} />
        <Create isOpen={isOpen} onClose={onClose} fetchData={refreshTable} />

        <ColumnsTable
          columnsData={columnsData}
          tableData={tableDataWithCount || []}
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
