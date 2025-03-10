// columnsData.jsx
import React from "react";
import ActionCell from "components/separator/ActionCell"; // Đảm bảo đường dẫn import đúng
import { deleteCourse } from "config/courseService";
import { Badge } from "@chakra-ui/react";

export const columnsData = [
  {
    Header: "STT",
    accessor: "stt",
    Cell: ({ rowIndex }) => rowIndex + 1,
  },
  {
    Header: "Tên khóa học",
    accessor: "courseName",
  },
  {
    Header: "Loại khóa học",
    accessor: "courseCategoryName",
  },
  {
    Header: "Giá hiện tại",
    accessor: "fee",
  },
  {
    Header: "Giá gốc",
    accessor: "originalFee",
  },
  {
    Header: "Nhãn",
    accessor: "badgeName",
  },

  {
    Header: "Trạng thái",
    accessor: "status",
    Cell: ({ value }) => {

    return (
      <Badge
        bg={value === 0 ? "green.400" : "red.400"} // Xanh lá nếu status == 0, Đỏ nếu khác 0
        fontSize="sm"
        textColor="white"
      >
        {value === 0 ? "Online" : "Offline"}
      </Badge>
    );
  },

  },

  {
    Header: "Hành động",
    accessor: "action",
    Cell: (props) => <ActionCell {...props}
      deleteFunction={deleteCourse}
      idData = "courseID"
      detailPath = "course"
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
