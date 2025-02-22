// ActionCell.jsx
import React, { useState } from "react";
import { Flex, Button, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import api from "config/apiConfig";

const ActionCell = ({ row, actionsConfig }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState({});

  const handleAction = async (action) => {
    setLoading((prev) => ({ ...prev, [action.key]: true }));
    try {
      // Nếu có callback tùy chỉnh, ưu tiên sử dụng
      if (action.onAction && typeof action.onAction === "function") {
        await action.onAction(row, navigate, toast);
      } else if (action.endpoint && action.method) {
        // Nếu có endpoint và method, thực hiện gọi API
        const endpoint =
          typeof action.endpoint === "function"
            ? action.endpoint(row)
            : action.endpoint;
        let response;
        switch (action.method.toUpperCase()) {
          case "DELETE":
            response = await api.delete(endpoint);
            break;
          case "PUT":
            response = await api.put(endpoint, action.payload);
            break;
          case "POST":
            response = await api.post(endpoint, action.payload);
            break;
          // Các phương thức khác nếu cần
          default:
            throw new Error("Phương thức API không được hỗ trợ");
        }
        if (response && response.status === 200) {
          toast({
            title: `${action.label} thành công!`,
            description: action.successMessage || "",
            status: "success",
            duration: 2000,
            isClosable: true,
            position: "top",
            variant: "left-accent",
          });
          if (action.onSuccess) {
            action.onSuccess();
          }
        } else {
          throw new Error("Có lỗi xảy ra");
        }
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.message || "Có lỗi xảy ra khi thực hiện hành động.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
        variant: "left-accent",
      });
    } finally {
      setLoading((prev) => ({ ...prev, [action.key]: false }));
    }
  };

  return (
    <Flex gap={4} justify="left" align="center">
      {actionsConfig.map((action) => (
        <Button
          key={action.key}
          variant="solid"
          size="xs"
          colorScheme={action.colorScheme || "gray"}
          borderRadius="md"
          minW="auto"
          _active={{ transform: "scale(0.90)" }}
          onClick={() => handleAction(action)}
          isLoading={loading[action.key]}
          loadingText={action.loadingText || "Đang xử lý..."}
        >
          {action.icon ? action.icon : action.label}
        </Button>
      ))}
    </Flex>
  );
};

export default ActionCell;
