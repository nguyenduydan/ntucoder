import { Text, Link, Tooltip } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const TestCaseCountCell = ({ problemId, count }) => {
    return (
        <Tooltip label="Xem chi tiết" placement="top" hasArrow>
            <Link as={RouterLink} to={`/admin/testcase/${problemId}`}>
                <Text align="center" color="blue">{count === null ? "…" : count}</Text>
            </Link>
        </Tooltip>
    );
};

export default TestCaseCountCell;
