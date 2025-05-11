// columnsData.jsx
import React from "react";
import ActionCell from "components/separator/ActionCell"; // Đảm bảo đường dẫn import đúng
import { deleteItem } from "config/apiService";

export const columnsData = [
  {
    Header: "STT",
    accessor: "stt",
    Cell: ({ rowIndex }) => rowIndex + 1,
  },
  {
    Header: "Mã testcase",
    accessor: "testCaseID",
  },
  {
    Header: "Sample Test",
    accessor: "sampleTest",
  },
  {
    Header: "Input",
    accessor: "input",
  },
  {
    Header: "Output",
    accessor: "output",
  },

  {
    Header: "Hành động",
    accessor: "action",
    Cell: (props) =>
      <ActionCell {...props}
        controller="TestCase"
        deleteFunction={deleteItem}
        idData="testCaseID"
        deleteSuccessToast={{
          title: "Đã xóa!",
          description: "Testcase đã được xóa thành công.",
        }}
        deleteErrorToast={{
          title: "Xóa thất bại!",
          description: "Vui lòng thử lại sau.",
        }}
        fetchData={props.fetchData} // fetchData là hàm lấy dữ liệu mới
        isEdit
      />
  }
];
