// columnsData.jsx
import React from "react";
import ActionCell from "components/separator/ActionCell"; // Đảm bảo đường dẫn import đúng

export const columnsData = [
  {
    Header: "STT",
    accessor: "stt",
    Cell: ({ rowIndex }) => rowIndex + 1,
  },
  {
    Header: "Tên nhãn",
    accessor: "userName",
  },
  {
    Header: "Mô tả",
    accessor: "Description",
  },
   {
    Header: "Màu",
    accessor: "Color",
  },
  {
    Header: "Hành động",
    accessor: "action",
    Cell: (props) => <ActionCell {...props}
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
