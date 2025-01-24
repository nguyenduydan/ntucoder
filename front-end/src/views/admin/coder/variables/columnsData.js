import React, { useState } from 'react';
import {
  Flex,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { BiSolidDetail } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import SwitchField from 'components/fields/SwitchField';
import api from 'utils/api';

export const columnsData = [
  {
    Header: 'STT',
    accessor: 'stt',
    Cell: ({ rowIndex }) => rowIndex + 1,
    minWidth: '20px',
  },
  {
    Header: 'Tài khoản',
    accessor: 'userName',
  },
  {
    Header: 'Tên người dùng',
    accessor: 'coderName',
  },
  {
    Header: 'Email',
    accessor: 'coderEmail',
  },
  {
    Header: 'SĐT',
    accessor: 'phoneNumber',
  },
  {
    Header: 'Trạng thái',
    accessor: 'status',
    Cell: ({ value }) => (
      <SwitchField
        isChecked={value || false}
        reversed={true}
        fontSize="sm"
      />
    ),
  },
  {
    Header: 'Hành động',
    accessor: 'action',
    Cell: ({ row }) => {
      const navigate = useNavigate(); // Di chuyển ra ngoài loop
      const toast = useToast();
      const { coderID } = row; // Lấy dữ liệu gốc từ React Table
      const { isOpen, onOpen, onClose } = useDisclosure();
      const [loading, setLoading] = useState(false);

      const handleDetailClick = () => {
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
      };

      const handleDeleteClick = async () => {
        try {
          setLoading(true);
          const response = await api.delete(`/coder/delete/${coderID}`);
          if (response.status === 200) {
            toast({
              title: "Xóa thành công!",
              description: "Người dùng đã bị xóa.",
              status: "success",
              duration: 2000,
              isClosable: true,
              position: "top",
              variant: "left-accent",
            });
            onClose();
            window.location.reload();
          } else {
            throw new Error("Có lỗi xảy ra khi xóa");
          }
        } catch (error) {
          toast({
            title: "Lỗi",
            description: error.message || "Có lỗi xảy ra khi xóa.",
            status: "error",
            duration: 2000,
            isClosable: true,
            position: "top",
            variant: "left-accent",
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

          {/* Nút xóa */}
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
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay bg="none" backdropFilter="auto" backdropBlur="4px" />
            <ModalContent>
              <ModalHeader>Xác nhận xóa</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text fontWeight="bold" fontSize="xl">
                  Bạn có chắc chắn muốn xóa hay không?
                </Text>
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
        </Flex>
      );
    },
  },
];
