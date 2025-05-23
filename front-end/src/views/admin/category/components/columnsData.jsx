// columnsData
import React from "react";
import ActionCell from "components/separator/ActionCell"; // Đảm bảo đường dẫn import đúng
import { deleteItem } from "@/config/apiService";

export const columnsData = [
  {
    Header: "STT",
    accessor: "stt",
    Cell: ({ rowIndex }) => rowIndex + 1,
  },
  {
    Header: "Tên thể loại",
    accessor: "catName",
    sortable: true,
  },
  {
    Header: "Thứ tự",
    accessor: "catOrder",
  },

  {
    Header: "Hành động",
    accessor: "action",
    Cell: (props) => (
      <ActionCell
        {...props}
        controller="Category"
        deleteFunction={deleteItem}
        idData="categoryID"
        deleteSuccessToast={{
          title: "Đã xóa!",
          description: "Thể loại đã được xóa thành công.",
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
