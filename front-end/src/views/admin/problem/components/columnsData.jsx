// columnsData
import React, { useState } from "react";
import ActionCell from "components/separator/ActionCell"; // Đảm bảo đường dẫn import đúng
import { deleteItem, updateStatus } from "@/config/apiService";
import { Badge, useToast } from "@chakra-ui/react";
import { useMutation } from '@tanstack/react-query';
import TestCaseCountCell from "./TestcaseCountCell";
import api from "@/config/apiConfig";

export const columnsData = [
  {
    Header: "STT",
    accessor: "stt",
    Cell: ({ rowIndex }) => rowIndex + 1,
  },
  {
    Header: "Mã bài tập",
    accessor: "problemCode",
  },
  {
    Header: "Tên bài tập",
    accessor: "problemName",
    sortable: true
  },
  {
    Header: "Nội dung bài tập",
    accessor: "problemContent",
  },
  {
    Header: "Testcase",
    accessor: "testCase",
    Cell: ({ row }) => {
      return <TestCaseCountCell problemId={row.problemID} count={row.testCaseCount} />;
    },
  },

  {
    Header: "Trạng thái",
    accessor: "published",
    Cell: ({ row }) => {
      const [status, setStatus] = useState(row?.published); // Lấy trạng thái từ row.original
      const problemId = row?.problemID;  // Lấy ID từ dữ liệu row
      const toast = useToast(); // Sử dụng useToast

      // Sử dụng useMutation để xử lý cập nhật trạng thái
      const mutation = useMutation({
        mutationFn: (newStatus) => {
          if (!problemId) {
            console.error("Lỗi: Không có problemId");
            return;
          }
          const formData = new FormData();
          formData.append('Published', newStatus.toString());

          return api.put(`/Problem/${problemId}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        },
        onSuccess: () => {
          toast({
            title: "Cập nhật thành công",
            description: "Cập nhật trạng thái thành công",
            status: "success",
            duration: 1000,
            isClosable: true,
            position: 'top',
            variant: "left-accent",
          });
        },
        onError: (error) => {
          console.error("Lỗi cập nhật trạng thái:", error);
          setStatus(status); // Khôi phục lại trạng thái cũ nếu có lỗi
          toast({
            title: "Cập nhật thất bại",
            description: "Không thể cập nhật trạng thái, vui lòng thử lại.",
            status: "error",
            duration: 1000,
            isClosable: true,
            position: 'top',
            variant: "left-accent",
          });
        },
      });

      const handleClick = () => {
        const newStatus = status === 0 ? 1 : 0;
        setStatus(newStatus);  // Cập nhật trạng thái local trước khi gọi API

        // Gọi mutation để cập nhật trạng thái trên server
        mutation.mutate(newStatus);
      };

      return (
        <Badge
          bg={status === 1 ? "green.400" : "gray.400"}
          fontSize="sm"
          textColor="white"
          cursor="pointer"
          onClick={handleClick}
        >
          {status === 1 ? "Online" : "Offline"}
        </Badge>
      );
    }
  },

  {
    Header: "Hành động",
    accessor: "action",
    Cell: (props) => <ActionCell {...props}
      controller="Problem"
      deleteFunction={deleteItem}
      idData="problemID"
      detailPath="problem"
      deleteSuccessToast={{
        title: "Đã xóa!",
        description: "Bài học đã được xóa thành công.",
      }}
      deleteErrorToast={{
        title: "Xóa thất bại!",
        description: "Vui lòng thử lại sau.",
      }}
      fetchData={props.fetchData} // fetchData là hàm lấy dữ liệu mới
    />
  }
];
