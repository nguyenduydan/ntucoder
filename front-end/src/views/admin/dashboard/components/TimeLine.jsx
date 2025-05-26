import { useState, useEffect } from "react";
import { Flex, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import useDynamicPlaceholder from "@/hooks/useDynamicPlaceholder";
import { Cursor } from "react-simple-typewriter";

dayjs.extend(utc);
dayjs.extend(timezone);

const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return dayjs(dateString).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY HH:mm:ss");
};

const TimeDisplay = ({ coder }) => {
    const [now, setNow] = useState(new Date());
    const typing = useDynamicPlaceholder([
        `Xin chào ${coder?.coderName || "bạn"}`,
        "bạn một ngày tốt lành",
        "bạn học tốt",
        "bạn vui vẻ",
        "bạn thành công",
        "bạn sức khỏe",
        "bạn hạnh phúc",
    ], 5000);

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());
        }, 1000); // cập nhật mỗi giây

        return () => clearInterval(timer); // cleanup khi component unmount
    }, []);

    return (
        <Flex justify="space-between" align="center" mb={8} display={{ base: "none", md: "flex" }}>
            <Text fontSize="md" color="gray.600" fontWeight="bold">
                Chào {typing}<Cursor cursorColor="black" /> , hôm nay là ngày {formatDateTime(now)}
            </Text>
        </Flex>
    );
};

export default TimeDisplay;
