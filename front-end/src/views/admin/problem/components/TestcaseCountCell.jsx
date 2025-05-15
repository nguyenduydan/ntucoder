// TestCaseCountCell
import { useEffect, useState } from "react";
import { Text, Link, Tooltip } from "@chakra-ui/react";
import api from "@/config/apiConfig";
import { Link as RouterLink } from "react-router-dom";

const TestCaseCountCell = ({ problemId }) => {
    const [count, setCount] = useState(null);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const res = await api.get("/TestCase/count", {
                    params: { problemId },
                });
                setCount(res.data.totalTestCases);
            } catch (error) {
                setCount("Lỗi");
            }
        };

        fetchCount();
    }, [problemId]);

    return (
        <Tooltip label="Xem chi tiết" placement="top" hasArrow>
            <Link as={RouterLink} to={`/admin/testcase/${problemId}`}>
                <Text align="center" color="blue">{count}</Text>
            </Link>
        </Tooltip>
    );
};

export default TestCaseCountCell;
