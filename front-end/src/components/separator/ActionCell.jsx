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
import { MdDelete, MdEdit } from "react-icons/md";
import EditTestCase from "@/views/admin/testcase/components/Update";

const ActionCell = ({
  row,
  idData,
  controller,
  deleteFunction,
  deleteSuccessToast = {},
  deleteErrorToast = {},
  detailPath,
  isEdit,
  fetchData,
}) => {
  const navigate = useNavigate();
  const toast = useToast();

  // Disclosure riêng cho Edit
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  // Disclosure riêng cho Delete
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const [loading, setLoading] = useState(false);
  const id = row?.original?.[idData] || row?.[idData];

  const handleDetailClick = () => {
    if (id) {
      const basePath = detailPath.startsWith('/admin') ? detailPath : `/admin/${detailPath}`;
      const path = `${basePath}/detail/${id}`;
      navigate(path);
    } else {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy ID",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
        variant: "left-accent",
      });
    }
  };

  const handleEditClick = () => {
    onEditOpen();
  };

  const handleDeleteClick = async () => {
    setLoading(true);
    try {
      await deleteFunction({ controller, id });

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

      onDeleteClose();
      if (fetchData) await fetchData();
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          error.response?.data?.message ||
          error.message ||
          "Có lỗi xảy ra khi thực hiện hành động.",
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
      {detailPath && (
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
      )}

      <Button
        variant="solid"
        size="xs"
        colorScheme="red"
        borderRadius="md"
        minW="auto"
        _active={{ transform: "scale(0.90)" }}
        onClick={onDeleteOpen}
      >
        <MdDelete size="13" />
      </Button>

      {isEdit && (
        <Button
          variant="solid"
          size="xs"
          colorScheme="yellow"
          borderRadius="md"
          minW="auto"
          _active={{ transform: "scale(0.90)" }}
          onClick={handleEditClick}
        >
          <MdEdit size="13" />
        </Button>
      )}

      {/* Modal chỉnh sửa */}
      <EditTestCase
        isOpen={isEditOpen}
        onClose={onEditClose}
        testCaseID={id}
        refetchData={fetchData}
      />

      {/* Modal xác nhận xóa */}
      {isDeleteOpen && (
        <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
          <ModalOverlay bg="none" backdropFilter="auto" backdropBlur="4px" />
          <ModalContent>
            <ModalHeader>Xác nhận xóa</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>Bạn có chắc chắn muốn xóa hay không?</Text>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="gray" mr={3} onClick={onDeleteClose}>
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
