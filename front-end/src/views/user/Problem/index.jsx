import React, { useState } from "react";
import { Box, Button, Flex, Select, VStack } from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import TestRunPanel from "./components/TestRunPanel"; // Giả sử bạn đã tạo TestRunPanel.jsx

export default function Problem() {
  const [code, setCode] = useState(`#include<iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello C++";\n    return 0;\n}`);
  const [language, setLanguage] = useState("cpp");
  const [theme, setTheme] = useState("vs-dark");

  const handleRun = () => {
    // Xử lý chạy thử giả lập (có thể gọi API ở đây)
    alert("Chạy thử code...");
  };

  return (
    <VStack h="100%" spacing={0} align="stretch">
      {/* Thanh điều khiển trên cùng */}
      <Flex bg="gray.800" color="white" px={4} py={2} justify="space-between" align="center">
        <Flex gap={2}>
          <Select
            size="sm"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            bg="gray.700"
            color="white"
            border="none"
            w="100px"
          >
            <option value="cpp">C++</option>
          </Select>
        </Flex>
        <Flex gap={2}>
          <Select
            size="sm"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            bg="gray.700"
            color="white"
            border="none"
            w="100px"
          >
            <option value="vs-dark">Tối</option>
            <option value="light">Sáng</option>
          </Select>
          <Button size="sm" colorScheme="blue" onClick={handleRun}>Chạy thử</Button>
        </Flex>
      </Flex>

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
            <TestRunPanel hasRun={true} />
          </Box>
        </Flex>
      </Box>
    </VStack>
  );
}
