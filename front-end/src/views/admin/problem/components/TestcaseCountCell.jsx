// TestCaseCountCell.jsx
import { useEffect, useState } from "react";
import { Text, Link } from "@chakra-ui/react";
import api from "config/apiConfig";
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
        <Link as={RouterLink} to={`/admin/testcase/${problemId}`}>
            <Text color="blue">{count ?? "Đang tải..."}</Text>
        </Link>
    );
};

export default TestCaseCountCell;
