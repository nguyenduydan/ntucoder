import React, { useEffect, useState } from "react";
import { Box, useToast, useDisclosure } from "@chakra-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import ScrollToTop from "components/scroll/ScrollToTop";
import Pagination from "components/pagination/pagination";
import Toolbar from "components/menu/ToolBar";
import ColumnsTable from "components/separator/ColumnsTable";
import Create from "views/admin/category/components/Create";

import { getList } from "config/apiService";
import { columnsData } from "views/admin/category/components/columnsData";
import { useTitle } from "contexts/TitleContext";

export default function Index() {
  useTitle("Quản lý danh mục");

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();

  // State for filter
  const [sortField, setSortField] = useState("name");
  const [ascending, setAscending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const queryKey = ["categorys", currentPage, pageSize, ascending, sortField];

  // Query load category list
  const { data, isLoading, } = useQuery({
    queryKey,
    queryFn: () =>
      getList({
        controller: "Category",
        page: currentPage,
        pageSize,
        ascending,
        sortField,
      }),
    keepPreviousData: true,
    staleTime: 1000 * 60, // cache in 1 minute
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

  // Prefetch next page data
  useEffect(() => {
    if (data?.totalPages) {
      if (currentPage < data.totalPages) {
        queryClient.prefetchQuery({
          queryKey: ["categorys", currentPage + 1, pageSize, ascending, sortField],
          queryFn: () =>
            getList({
              controller: "Category",
              page: currentPage + 1,
              pageSize,
              ascending,
              sortField,
            }),
        });
      }
    }
  }, [data, currentPage, pageSize, ascending, sortField, queryClient]);

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
    if (newPage > 0 && newPage <= data?.totalPages) {
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

  const refreshTable = () => {
    queryClient.invalidateQueries({ queryKey: ["categorys"] });
  };

  return (
    <ScrollToTop>
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <Toolbar onAdd={onOpen} onSearch />
        <Create isOpen={isOpen} onClose={onClose} fetchData={refreshTable} />

        <ColumnsTable
          columnsData={columnsData}
          tableData={data?.data || []}
          loading={isLoading}
          onSort={handleSort}
          sortField={sortField}
          ascending={ascending}
          fetchData={refreshTable}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={data?.totalPages || 0}
          totalRows={data?.totalCount || 0}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
        />
      </Box>
    </ScrollToTop>
  );
}
