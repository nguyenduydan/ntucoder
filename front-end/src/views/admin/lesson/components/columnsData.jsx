// columnsData.jsx
import React,{useState} from "react";
import ActionCell from "components/separator/ActionCell"; // Đảm bảo đường dẫn import đúng
import { deleteLesson,updateStatus } from "config/lessonService";
import { Badge,useToast } from "@chakra-ui/react";

export const columnsData = [
  {
    Header: "STT",
    accessor: "stt",
    Cell: ({ rowIndex }) => rowIndex + 1,
  },
  {
    Header: "Tên bài học",
    accessor: "lessonTitle",
    sortable: true,
  },
  {
    Header: "Nội dung",
    accessor: "lessonContent",
  },
  {
    Header: "Cấp",
    accessor: "order",
  },

  {
    Header: "Trạng thái",
    accessor: "status",
    Cell: ({ row }) => {
      const [status, setStatus] = useState(row?.status);
      const lessonID = row?.lessonID; // Đảm bảo lấy ID đúng
      const toast = useToast(); // Sử dụng useToast

      const handleClick = async () => {
        const newStatus = status === 0 ? 1 : 0;
        setStatus(newStatus);
        try {
          await updateStatus(lessonID, newStatus);
          toast({
            title: "Cập nhật thành công",
            description: `Cập nhật trạng thái thành công`,
            status: "success",
            duration: 1000,
            isClosable: true,
            position: 'top',
            variant: "left-accent",
          });
        } catch (error) {
          console.error("Lỗi cập nhật trạng thái:", error);
          setStatus(status);
          toast({
            title: "Cập nhật thất bại",
            description: "Không thể cập nhật trạng thái, vui lòng thử lại.",
            status: "error",
            duration: 1000,
            isClosable: true,
            position: 'top',
            variant: "left-accent",
          });
        }
      };

      return (
        <Badge
          bg={status === 1 ? "green.400" : "red.400"}
          fontSize="sm"
          textColor="white"
          cursor="pointer"
          onClick={handleClick}
        >
          {status === 1 ? "Online" : "Offline"}
        </Badge>
      );
    }
  },

  {
    Header: "Hành động",
    accessor: "action",
    Cell: (props) => <ActionCell {...props}
      deleteFunction={deleteLesson}
      idData = "lessonID"
      detailPath = "lesson"
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
