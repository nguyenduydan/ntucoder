// columnsData.jsx
import React from "react";
import ActionCell from "components/separator/ActionCell"; // Đảm bảo đường dẫn import đúng
import { deletecoursecategory } from "config/courseCategoryService";

export const columnsData = [
  {
    Header: "STT",
    accessor: "stt",
    Cell: ({ rowIndex }) => rowIndex + 1,
  },
  {
    Header: "Tên loại khóa học",
    accessor: "name",
  },
  {
    Header: "Thứ tự",
    accessor: "order",
  },

  {
    Header: "Hành động",
    accessor: "action",
    Cell: (props) => (
      <ActionCell
        {...props}
        deleteFunction={deletecoursecategory}
        idData = "courseCategoryID"
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
