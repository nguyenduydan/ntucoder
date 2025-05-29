import React, { useEffect, useState } from "react";
import { Box, useToast, useDisclosure } from "@chakra-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import ScrollToTop from "@/components/scroll/ScrollToTop";
import Pagination from "@/components/pagination/pagination";
import Toolbar from "components/menu/ToolBar";
import ColumnsTable from "components/separator/ColumnsTable";
import Create from "@/views/admin/testcase/components/Create";

import { getListTestCase } from "@/config/apiService";
import { columnsData } from "views/admin/testcase/components/columnsData";
import { useTitle } from "@/contexts/TitleContext";
import { useParams } from "react-router-dom";

export default function Index() {
  useTitle("Quản lý testcase");
  const { problemId } = useParams();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();

  // State for filter
  const [sortField, setSortField] = useState("name");
  const [ascending, setAscending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const queryKey = ["testcases", problemId, currentPage, pageSize, ascending, sortField];

  // Query load problem list
  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () =>
      getListTestCase({
        problemId,
        page: currentPage,
        pageSize,
        ascending,
        sortField,
      }),
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

  // Prefetch next page data
  useEffect(() => {
    if (data?.totalPages && currentPage < data.totalPages) {
      queryClient.prefetchQuery({
        queryKey: ["testcases", problemId, currentPage + 1, pageSize, ascending, sortField],
        queryFn: () =>
          getListTestCase({
            problemId,
            page: currentPage + 1,
            pageSize,
            ascending,
            sortField,
          }),
      });
    }
  }, [data, problemId, currentPage, pageSize, ascending, sortField, queryClient]);

  const handleSort = (field) => {
    if (sortField === field) setAscending(!ascending);
    else {
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
    queryClient.invalidateQueries({ queryKey: ["testcases", problemId] });
  };

  return (
    <ScrollToTop>
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <Toolbar onAdd={onOpen} onSearch={(keyword) => console.log(keyword)} />
        <Create isOpen={isOpen} onClose={onClose} fetchData={refreshTable} problemID={problemId} />

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
