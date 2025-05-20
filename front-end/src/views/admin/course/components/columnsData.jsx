import React, { useState } from "react";
import ActionCell from "components/separator/ActionCell"; // Đảm bảo đường dẫn import đúng
import { deleteItem, updateStatus } from "@/config/apiService";
import { useMutation } from '@tanstack/react-query';
import { Badge, useToast } from "@chakra-ui/react";

export const columnsData = [
  {
    Header: "STT",
    accessor: "stt",
    Cell: ({ rowIndex }) => rowIndex + 1,
  },
  {
    Header: "Tên khóa học",
    accessor: "courseName",
    sortable: true
  },
  {
    Header: "Loại khóa học",
    accessor: "courseCategoryName",
    sortable: true,
  },
  {
    Header: "Người tạo",
    accessor: "creatorName",
    sortable: true,

  },
  {
    Header: "Nhãn",
    accessor: "badgeName",
  },

  {
    Header: "Trạng thái",
    accessor: "status",
    Cell: ({ row }) => {
      const [status, setStatus] = useState(row?.status); // Lấy trạng thái từ row.original
      const courseId = row?.courseID;  // Lấy ID từ dữ liệu row
      const toast = useToast(); // Sử dụng useToast

      // Sử dụng useMutation để xử lý cập nhật trạng thái
      const mutation = useMutation({
        mutationFn: (newStatus) => {
          if (!courseId) {
            console.error("Lỗi: Không có courseId");
            return;
          }
          return updateStatus({ controller: "Course", id: courseId, newStatus: newStatus });
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
          bg={status === 1 ? "green.400" : "red.400"}
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
      controller="Course"
      deleteFunction={deleteItem}
      idData="courseID"
      detailPath="course"
      deleteSuccessToast={{
        title: "Đã xóa!",
        description: "Khóa học đã được xóa thành công.",
      }}
      fetchData={props.fetchData} // fetchData là hàm lấy dữ liệu mới
    />
  }
];
