import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import ProblemNav from "./components/ProblemNavbar";
import Editor from "@monaco-editor/react";

export default function Prolem() {
  const [code, setCode] = useState("#include<iostream>\nusing namespace std;\n");
  const [theme, setTheme] = useState("vs-dark"); // Khởi tạo theme mặc định là "vs-dark"
  const language = "cpp";

  return (
    <Box h="100%" overflowY="hidden">
      <ProblemNav setTheme={setTheme} /> {/* Truyền setTheme xuống ProblemNav để thay đổi theme */}
      <Box h="calc(80vh - 50px)" borderRadius="md">
        <Editor
          key={language}
          height="100%"
          theme={theme}
          language={language}
          value={code}
          onChange={(value) => setCode(value)}
        />
      </Box>
    </Box>
  );
}
