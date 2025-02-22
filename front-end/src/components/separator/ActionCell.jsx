// ActionCell.jsx
import React, { useState } from "react";
import {
  Flex,
  Button,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { BiSolidDetail } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import api from "config/apiConfig";

const ActionCell = ({
  row,
  deleteEndpoint,      // Prop để thay đổi endpoint API
  deleteSuccessToast = {},
  deleteErrorToast = {},
  detailPath,          // Đường dẫn chi tiết tùy chỉnh
  fetchData,
}) => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);

  const coderID = row?.original?.coderID || row?.coderID;

  const handleDetailClick = () => {
    if (coderID) {
      const path = detailPath ? `${detailPath}/${coderID}` : `/admin/coder/detail/${coderID}`;
      navigate(path);
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
  };

  const handleDeleteClick = async () => {
    try {
      setLoading(true);
      // Xây dựng endpoint dựa trên prop deleteEndpoint
      const endpoint =
        deleteEndpoint
          ? typeof deleteEndpoint === "function"
            ? deleteEndpoint(row)
            : deleteEndpoint
          : `/coder/delete/${coderID}`;
      const response = await api.delete(endpoint);
      if (response.status === 200) {
        toast({
          title: "Xóa thành công!",
          description: "Người dùng đã bị xóa.",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
          variant: "left-accent",
          ...deleteSuccessToast,
        });
        onClose();
        if (fetchData) await fetchData(); // Gọi hàm fetchData để tải lại dữ liệu
      } else {
        toast({
        title: "Lỗi",
        description:"Có lỗi xảy ra khi thực hiện hành động.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
        variant: "left-accent",
        ...deleteErrorToast,
      });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          error.message || "Có lỗi xảy ra khi thực hiện hành động.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
        variant: "left-accent",
        ...deleteErrorToast,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex gap={4} justify="left" align="center">
      <Button
        variant="solid"
        size="xs"
        colorScheme="facebook"
        borderRadius="md"
        minW="auto"
        _active={{ transform: "scale(0.90)" }}
        onClick={handleDetailClick}
      >
        <BiSolidDetail size="13" />
      </Button>
      <Button
        variant="solid"
        size="xs"
        colorScheme="red"
        borderRadius="md"
        minW="auto"
        _active={{ transform: "scale(0.90)" }}
        onClick={onOpen}
      >
        <MdDelete size="13" />
      </Button>
      {/* Modal xác nhận xóa */}
      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay bg="none" backdropFilter="auto" backdropBlur="4px" />
          <ModalContent>
            <ModalHeader>Xác nhận xóa</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>Bạn có chắc chắn muốn xóa hay không?</Text>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="gray" mr={3} onClick={onClose}>
                Hủy
              </Button>
              <Button
                colorScheme="red"
                isLoading={loading}
                loadingText="Đang xóa..."
                onClick={handleDeleteClick}
              >
                Xóa
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Flex>
  );
};

export default ActionCell;
