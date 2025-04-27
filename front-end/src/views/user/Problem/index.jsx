import React, { useEffect, useState } from "react";
import { Box, Flex, VStack } from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import TestRunPanel from "./components/TestRunPanel";
import ProblemNavbar from "./components/CodeNavBar";
import { useLocation } from "react-router-dom";
import { getDetail } from "config/apiService";

export default function Problem() {
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const problemID = searchParams.get("problemID");

  const [code, setCode] = useState(`#include<iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello C++";\n    return 0;\n}`);
  const [language, setLanguage] = useState("cpp");
  const [theme, setTheme] = useState("vs-dark");

  const handleRun = () => {
    // Xử lý chạy thử giả lập (có thể gọi API ở đây)
    alert("Chạy thử code...");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDetail({
          controller: "Problem",
          id: problemID,
        });
        setCode(res.testCode || "");
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu bài tập:", error);
      }
    };

    fetchData();
  }, [problemID]);


  return (
    <VStack h="100%" spacing={0} align="stretch">
      {/* Thanh điều khiển trên cùng */}
      <ProblemNavbar
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        setTheme={setTheme}
        onRun={handleRun} />

      {/* Trình biên tập code */}
      <Box h="100%" overflow="hidden" overflowY="hidden">
        <Flex direction="column" h="100%" >
          <Box flex="6" overflow="hidden" borderBottom="1px solid #555">
            <Editor
              height="100%"
              language={language}
              theme={theme}
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
              }}
            />
          </Box>
          <Box flex="3" overflow="hidden" bg="gray.900">
            <TestRunPanel hasRun={true} id={problemID} />
          </Box>
        </Flex>
      </Box>
    </VStack>
  );
}
