import React from "react";
import ActionCell from "components/separator/ActionCell";
import { deleteItem } from "@/config/apiService";
import { formatDateTime, toSlug, formatViewCount, LimitText } from "@/utils/utils";
import { Badge, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import PublishedToggleCell from "./PublishedToggleCell"; // Đảm bảo đường dẫn import đúng
import PinHomeToggleCell from "./PinHomeToggleCell"; // Đảm bảo đường dẫn import đúng

export const columnsData = (fetchData) => [
  {
    Header: "STT",
    accessor: "stt",
    Cell: ({ rowIndex }) => rowIndex + 1,
  },
  {
    Header: "Tiêu đề bài viết",
    accessor: "title",
    Cell: ({ row }) => (
      <Link to={`/blogs/${toSlug(row.title)}-${row.blogID}`}>
        <Text color="black" cursor="pointer" _hover={{ textDecoration: "underline" }}>
          {LimitText(row?.title, 20)}
        </Text>
      </Link>
    ),
    sortable: true,
  },
  {
    Header: "Ngày đăng",
    accessor: "blogDate",
    Cell: ({ value }) => <p>{formatDateTime(value)}</p>,
    sortable: true,
  },

  {
    Header: "Người viết",
    accessor: "coderName",
  },
  {
    Header: "Lượt xem",
    accessor: "viewCount",
    Cell: ({ value }) => <Badge colorScheme="red" align="center">{formatViewCount(value) || 0}</Badge>,
  },
  {
    Header: "Đã xuất bản",
    accessor: "published",
    Cell: ({ row }) => (
      <PublishedToggleCell
        blogId={row.blogID}
        initialStatus={row.published}
        fetchData={fetchData}
      />
    ),
  },
  {
    Header: "Ghim trang chủ",
    accessor: "pinHome",
    Cell: ({ row }) => (
      <PinHomeToggleCell
        blogId={row.blogID}
        initialStatus={row.pinHome}
        fetchData={fetchData}
      />
    ),
  },
  {
    Header: "Hành động",
    accessor: "action",
    Cell: (props) => (
      <ActionCell
        {...props}
        controller="Blog"
        deleteFunction={deleteItem}
        idData="blogID"
        deleteSuccessToast={{
          title: "Đã xóa!",
          description: "Bài viết đã được xóa thành công.",
        }}
        deleteErrorToast={{
          title: "Xóa thất bại!",
          description: "Vui lòng thử lại sau.",
        }}
        fetchData={props.fetchData}
      />
    ),
  },
];
