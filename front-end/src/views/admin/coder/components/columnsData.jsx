// columnsData
import React from "react";
import ActionCell from "components/separator/ActionCell"; // Đảm bảo đường dẫn import đúng
import { deleteItem } from "@/config/apiService";
import { Badge } from "@chakra-ui/react";

export const columnsData = [
  {
    Header: "STT",
    accessor: "stt",
    Cell: ({ rowIndex }) => rowIndex + 1,
  },
  {
    Header: "Tài khoản",
    accessor: "userName",
    sortable: true,
  },
  {
    Header: "Tên người dùng",
    accessor: "coderName",
    sortable: true,
  },
  {
    Header: "Email",
    accessor: "coderEmail",
  },
  {
    Header: "SĐT",
    accessor: "phoneNumber",
  },

  {
    Header: "Quyền",
    accessor: "role",
    Cell: ({ row }) => {
      const value = row?.role;
      const roleMap = {
        1: { label: "Quản trị viên", color: "blue" },
        2: { label: "Người dùng", color: "red" },
        3: { label: "Giáo viên", color: "orange" }
      };

      const role = roleMap[value] || { label: "Không xác định", color: "yellow" };

      return (
        <Badge colorScheme={role.color} boxShadow="md" px={3} py={1} borderRadius="md">
          {role.label}
        </Badge>
      );
    },
  },

  {
    Header: "Hành động",
    accessor: "action",
    Cell: (props) => <ActionCell {...props}
      controller="Coder"
      deleteFunction={deleteItem}
      idData="coderID"
      detailPath="coder"
      deleteSuccessToast={{
        title: "Đã xóa!",
        description: "Người dùng đã được xóa thành công.",
      }}
      deleteErrorToast={{
        title: "Xóa thất bại!",
        description: "Vui lòng thử lại sau.",
      }}
      fetchData={props.fetchData} // fetchData là hàm lấy dữ liệu mới
    />
  }
];
