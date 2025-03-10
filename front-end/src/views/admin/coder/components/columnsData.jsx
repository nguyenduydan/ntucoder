// columnsData.jsx
import React from "react";
import SwitchField from "components/fields/SwitchField";
import ActionCell from "components/separator/ActionCell"; // Đảm bảo đường dẫn import đúng
import { deleteCoder } from "config/coderService";

export const columnsData = [
  {
    Header: "STT",
    accessor: "stt",
    Cell: ({ rowIndex }) => rowIndex + 1,
  },
  {
    Header: "Tài khoản",
    accessor: "userName",
  },
  {
    Header: "Tên người dùng",
    accessor: "coderName",
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
    Header: "Trạng thái",
    accessor: "status",
    Cell: ({ value }) => (
      <SwitchField isChecked={value || false} reversed={true} fontSize="sm" />
    ),
  },
  {
    Header: "Hành động",
    accessor: "action",
    Cell: (props) => <ActionCell {...props}
      deleteFunction={deleteCoder}
      idData = "coderID"
      detailPath = "coder"
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
