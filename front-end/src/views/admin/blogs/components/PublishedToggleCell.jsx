// components/PublishedToggleCell.js
import React, { useState } from "react";
import { Badge, Spinner, useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import api from "@/config/apiConfig";

const PublishedToggleCell = ({ blogId, initialStatus, fetchData }) => {
    const [status, setStatus] = useState(initialStatus);
    const toast = useToast();

    const mutation = useMutation({
        mutationFn: (newStatus) =>
            api.patch(`/Blog/${blogId}/status`, { published: newStatus }),
        onSuccess: (_, newStatus) => {
            setStatus(newStatus); // Cập nhật sau khi API OK
            toast({
                title: "Cập nhật thành công",
                description: "Cập nhật trạng thái thành công",
                status: "success",
                duration: 1000,
                isClosable: true,
                position: "top",
                variant: "left-accent",
            });
            fetchData?.();
        },
        onError: () => {
            toast({
                title: "Cập nhật thất bại",
                description: "Không thể cập nhật trạng thái",
                status: "error",
                duration: 1000,
                isClosable: true,
                position: "top",
                variant: "left-accent",
            });
        },
    });

    const handleClick = () => {
        const newStatus = status === 1 ? 0 : 1;
        mutation.mutate(newStatus); // KHÔNG setStatus trước
    };

    return (
        <Badge
            bg={status === 1 ? "green.400" : "gray.400"}
            fontSize="sm"
            textColor="white"
            cursor="pointer"
            onClick={mutation.isLoading ? null : handleClick}
            opacity={mutation.isLoading ? 0.6 : 1}
            pointerEvents={mutation.isLoading ? "none" : "auto"}
        >
            {mutation.isLoading ? (
                <Spinner size="xs" color="white" />
            ) : status === 1 ? "Online" : "Offline"}
        </Badge>
    );
};

export default PublishedToggleCell;
