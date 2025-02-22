// columnsData.jsx
import React from "react";
import SwitchField from "components/fields/SwitchField";
import ActionCell from "components/separator/ActionCell";
import { BiSolidDetail } from "react-icons/bi";
import { MdDelete } from "react-icons/md";

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
    Cell: (props) => (
      <ActionCell
        {...props}
        actionsConfig={[
          {
            key: "detail",
            type: "detail", // định nghĩa loại hành động detail
            label: "Chi tiết",
            icon: <BiSolidDetail size="13" />,
            colorScheme: "facebook",
            // Bạn có thể truyền thêm endpoint hoặc callback nếu cần
            onAction: (row, navigate, toast) => {
              const coderID = row?.original?.coderID || row?.coderID;
              if (coderID) {
                navigate(`/admin/coder/detail/${coderID}`);
              } else {
                toast({
                  title: "Lỗi",
                  description: "Không tìm thấy ID của người dùng.",
                  status: "error",
                  duration: 2000,
                  isClosable: true,
                  position: "top",
                  variant: "left-accent",
                });
              }
            },
          },
          {
            key: "delete",
            type: "delete", // định nghĩa loại hành động delete
            label: "Xóa",
            icon: <MdDelete size="13" />,
            colorScheme: "red",
            loadingText: "Đang xóa...",
            // Định nghĩa endpoint khác nhau nếu cần, hoặc truyền callback xử lý riêng
            endpoint: (row) =>
              `/coder/delete/${row?.original?.coderID || row?.coderID}`,
            method: "DELETE",
            onSuccess: () => window.location.reload(),
          },
          // Có thể thêm các action khác với API link khác nhau
          {
            key: "updateStatus",
            type: "update", // ví dụ: cập nhật trạng thái
            label: "Cập nhật",
            colorScheme: "blue",
            endpoint: (row) =>
              `/coder/updateStatus/${row?.original?.coderID || row?.coderID}`,
            method: "PUT",
            payload: { status: true }, // ví dụ payload tĩnh hoặc có thể truyền callback để lấy dữ liệu động
            onSuccess: () => {
              // Có thể cập nhật lại giao diện hoặc gọi callback reload dữ liệu
            },
          },
        ]}
      />
    ),
  },
];
