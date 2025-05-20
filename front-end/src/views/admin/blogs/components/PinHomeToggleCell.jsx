// components/PublishedToggleCell.js
import React, { useState, useEffect } from "react";
import { Switch, Spinner, useToast, Box, Text, Flex } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import api from "@/config/apiConfig";

const PublishedToggleCell = ({ blogId, initialStatus, fetchData }) => {
    const [status, setStatus] = useState(Boolean(initialStatus));
    const toast = useToast();

    // Sync state nếu initialStatus thay đổi từ parent
    useEffect(() => {
        setStatus(Boolean(initialStatus));
    }, [initialStatus]);

    const mutation = useMutation({
        mutationFn: (newStatus) =>
            api.patch(`/Blog/${blogId}/status`, { pinHome: newStatus ? 1 : 0 }),
        onSuccess: (_, newStatus) => {
            setStatus(newStatus); // Cập nhật state sau khi API thành công
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

    const handleToggle = () => {
        if (mutation.isLoading) return;
        mutation.mutate(!status);
    };

    return (
        <Flex alignItems="center" justifyContent="center" cursor={mutation.isLoading ? "not-allowed" : "pointer"}>
            <Switch
                isChecked={status}
                onChange={handleToggle}
                isDisabled={mutation.isLoading}
                colorScheme="blue"
            />
        </Flex>
    );
};

export default PublishedToggleCell;
