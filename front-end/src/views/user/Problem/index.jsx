import React, { useEffect, useState } from "react";
import {
  Box, Flex, VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  useToast,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import TestRunPanel from "./components/TestRunPanel";
import CodeNavbar from "./components/CodeNavBar";
import { useLocation } from "react-router-dom";
import { getDetail } from "config/apiService";
import api from "config/apiConfig";

export default function Problem() {
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalStyles, setModalStyles] = useState({ bg: "gray.100", colorScheme: "gray" });
  const [isLoading, setLoading] = useState(false);
  const toast = useToast();

  const searchParams = new URLSearchParams(location.search);
  const problemID = searchParams.get("problemID");

  const [code, setCode] = useState(`#include<iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello C++";\n    return 0;\n}`);
  const [language, setLanguage] = useState("cpp");
  const [theme, setTheme] = useState("vs-dark");
  const [error, setError] = useState(null);
  const [testResults, setTestResults] = useState({
    input: "",
    actualOutput: "",
    expectedOutput: "",
    timeLimit: "",
    execTime: "",
  });
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [isTestRunSuccess, setIsTestRunSuccess] = useState(false);

  const getCompilerExtension = (lang) => {
    switch (lang) {
      case "cpp":
        return ".cpp";
      case "py":
        return ".py";
      case "java":
        return ".java";
      default:
        return lang.toLowerCase(); // fallback
    }
  };

  const handleTestRun = async () => {
    setLoading(true);
    try {
      const res = await api.post("/CodeExecute/try-run", {
        sourceCode: code,
        compilerExtension: getCompilerExtension(language),
        problemId: parseInt(problemID)
      });

      const data = res.data;

      if (data.error) {
        toast({
          title: "Lỗi kết nối",
          status: "error",
          duration: 2000,
          isClosable: true,
          variant: "left-accent",
          position: "top",
        });
        setLoading(false);
      } else {
        setTestResults({
          input: data.input || '',
          actualOutput: data.output || '',
          expectedOutput: data.expectedOutput || '',
          timeLimit: data.timeLimit || '',
          execTime: data.timeDuration || '',
        });
        setError(data.error || '');

        switch (data.result) {
          case "Accepted":
          case "Success":
            setModalTitle("✅ Chạy thử thành công");
            setModalMessage("Chúc mừng! Bài làm đúng hoặc không có lỗi.");
            setModalStyles({ bg: "green.100", colorScheme: "green" });
            setIsTestRunSuccess(true);
            break;
          case "Wrong Answer":
            setModalTitle("❌ Sai kết quả");
            setModalMessage("Đầu ra không trùng khớp với kết quả mong đợi.");
            setModalStyles({ bg: "yellow.100", colorScheme: "yellow" });
            break;
          case "Runtime Error":
            setModalTitle("💥 Runtime Error");
            setModalMessage("Chương trình gặp lỗi khi thực thi.");
            setModalStyles({ bg: "red.100", colorScheme: "red" });
            break;
          case "Compilation Error":
            setModalTitle("🔧 Compilation Error");
            setModalMessage("Có lỗi biên dịch. Hãy kiểm tra lại cú pháp.");
            setModalStyles({ bg: "orange.100", colorScheme: "orange" });
            break;
          default:
            setModalTitle("⚠️ Không xác định");
            setModalMessage("Không thể xác định trạng thái kết quả.");
            setModalStyles({ bg: "gray.100", colorScheme: "gray" });
            setIsTestRunSuccess(false);
            break;
        }
      }
      onOpen(); // mở modal
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu chạy thử:", error);
      toast({
        title: "Lỗi kết nối",
        status: "error",
        duration: 2000,
        isClosable: true,
        variant: "left-accent",
        position: "top",
      });
      setLoading(false);
    } finally {
      setLoading(false);
    }
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
      <CodeNavbar
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        setTheme={setTheme}
        onRun={handleTestRun}
        loading={isLoading}
        isProblemId={problemID}
        isTestRunSuccess={isTestRunSuccess}
      />

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
            <TestRunPanel hasRun={true} id={problemID} errors={error} testCaseResult={testResults} />
          </Box>
        </Flex>
      </Box>
      {/* Thông báo*/}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg={modalStyles.bg}>
          <ModalHeader textAlign="center">{modalTitle}</ModalHeader>
          <ModalBody textAlign="center">{modalMessage}</ModalBody>
          <ModalFooter>
            <Flex w="100%" justify="center">
              <Button colorScheme={modalStyles.colorScheme} onClick={onClose}>
                Đóng
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </VStack>
  );
}
