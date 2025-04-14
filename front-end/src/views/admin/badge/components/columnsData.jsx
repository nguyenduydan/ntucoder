// columnsData.jsx
import React from "react";
import ActionCell from "components/separator/ActionCell"; // Đảm bảo đường dẫn import đúng
import { Box } from "@chakra-ui/react";
import { deleteItem } from "config/apiService";

export const columnsData = [
  {
    Header: "STT",
    accessor: "stt",
    Cell: ({ rowIndex }) => rowIndex + 1,
  },
  {
    Header: "Tên nhãn",
    accessor: "name",
    sortable: true,
  },
  {
    Header: "Mô tả",
    accessor: "description",
  },
  {
    Header: "Mã màu",
    accessor: "color",
  },
  {
    Header: "Review",
    accessor: "color",
    Cell: ({ value }) => (
      <Box
        w="40px"
        h="20px"
        bg={value}
        border="none"
        borderColor="gray.300"
        borderRadius="md"
      />
    ),
  },

  {
    Header: "Hành động",
    accessor: "action",
    Cell: (props) => (
      <ActionCell
        {...props}
        controller="Badge"
        deleteFunction={deleteItem}
        idData="badgeID"
        deleteSuccessToast={{
          title: "Đã xóa!",
          description: "Nhãn đã được xóa thành công.",
        }}
        deleteErrorToast={{
          title: "Xóa thất bại!",
          description: "Vui lòng thử lại sau.",
        }}
        fetchData={props.fetchData}
      />
    ),
  }
];
