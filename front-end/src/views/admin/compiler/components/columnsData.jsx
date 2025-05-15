// columnsData
import React from "react";
import ActionCell from "components/separator/ActionCell"; // Đảm bảo đường dẫn import đúng
import { deleteCompiler } from "@/config/compilerService";

export const columnsData = [
  {
    Header: "STT",
    accessor: "stt",
    Cell: ({ rowIndex }) => rowIndex + 1,
  },
  {
    Header: "Tên biên dịch",
    accessor: "compilerName",
    sortable: true
  },
  {
    Header: "Đường dẫn",
    accessor: "compilerPath",
    sortable: true,
  },
  {
    Header: "Lựa chọn biên dịch",
    accessor: "compilerOption",
    sortable: true,
  },
  {
    Header: " mở rộng biên dịch",
    accessor: "compilerExtension",
    sortable: true,
  },
  {
    Header: "Hành động",
    accessor: "action",
    Cell: (props) => <ActionCell {...props}
      deleteFunction={deleteCompiler}
      idData="compilerID"
      detailPath="compiler"
      deleteSuccessToast={{
        title: "Đã xóa!",
        description: "Khóa học đã được xóa thành công.",
      }}
      deleteErrorToast={{
        title: "Xóa thất bại!",
        description: "Vui lòng thử lại sau.",
      }}
      fetchData={props.fetchData} // fetchData là hàm lấy dữ liệu mới
    />
  }
];
