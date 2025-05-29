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
  Select,
} from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import TestRunPanel from "./components/TestRunPanel";
import { useLocation, useNavigate } from "react-router-dom";
import { getDetail } from "@/config/apiService";
import api from "@/config/apiConfig";
import { useAuth } from "@/contexts/AuthContext";
import { FaHandPointUp } from "react-icons/fa";
import { getList } from "@/config/apiService";


export default function Problem() {
  const location = useLocation();
  const { coder } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalStyles, setModalStyles] = useState({ bg: "gray.100", colorScheme: "gray" });
  const [loading, setLoading] = useState({ status: false, type: "" });

  const toast = useToast();
  const navigate = useNavigate();
  const [compilers, setCompiler] = useState([]);
  const [selectCompiler, setSelectCompiler] = useState("cpp");
  const searchParams = new URLSearchParams(location.search);
  const problemID = searchParams.get("problemID");
  const [code, setCode] = useState(`#include<iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello C++";\n    return 0;\n}`);
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
  const [isSubmissionSuccess, setIsSubmissionSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (problemID === null) { return; }
      else {
        try {
          const res = await getDetail({
            controller: "Problem",
            id: problemID,
          });
          const compiler = await getList({ controller: "Compiler", page: 1, pageSize: 10 });
          const compilerData = compiler.data;

          setCompiler(compilerData);
          if (compilerData.length > 0) {
            const first = compilerData[0];
            setSelectCompiler(first);
          }

          setCode(res.testCode || "");
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu bài tập:", error);
        }
      }
    };

    fetchData();
  }, [problemID]);

  const ResultModal = (result) => {
    switch (result) {
      case "Accepted":
      case "Success":
        setModalTitle("✅ Nộp bài thành công");
        setModalMessage("Chúc mừng! Bài làm đúng hoặc không có lỗi.");
        setModalStyles({ bg: "green.100", colorScheme: "green" });
        setIsTestRunSuccess(true);
        break;
      case "Wrong Answer":
        setModalMessage("❌ Sai kết quả");
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
  };

  const handleTestRun = async () => {
    setLoading({ status: true, type: "test" });

    try {
      const res = await api.post("/CodeExecute/try-run", {
        sourceCode: code,
        compilerExtension: selectCompiler.compilerExtension,
        problemId: parseInt(problemID),
      });

      const data = res.data;

      if (!data.results || data.results.length === 0) {
        setError("Không có kết quả test case nào được trả về.");
        toast({
          title: "Không có kết quả",
          status: "warning",
          duration: 2000,
          isClosable: true,
          variant: "left-accent",
          position: "top",
        });
        return;
      }

      setTestResults(data.results);
      console.log(data.results);
      const firstWrong = data.results.find((r) => r.result !== "Accepted");

      if (firstWrong) {
        setError(firstWrong.error || firstWrong.result || "Có lỗi xảy ra.");
        toast({
          title: "Có test case bị sai",
          status: "error",
          duration: 2000,
          isClosable: true,
          variant: "left-accent",
          position: "top",
        });
      } else {
        setError(null);
        toast({
          title: "Tất cả test case đều đúng 🎉",
          status: "success",
          duration: 2000,
          isClosable: true,
          variant: "left-accent",
          position: "top",
        });
        setIsTestRunSuccess(true);
      }

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
    } finally {
      setLoading({ status: false, type: "" });
    }
  };



  const handleSubmission = async () => {
    setLoading({ status: true, type: "submit" });
    try {
      const submissionData = {
        problemId: problemID,
        compilerID: selectCompiler.compilerID,
        submissionCode: code,
        coderID: coder.coderID
      };

      const res = await api.post("/Submission/submit", submissionData);

      if (res.status === 200) {
        ResultModal(res.data.testRuns[0].result);
        onOpen();
        setIsSubmissionSuccess(true);
      }

    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu nộp bài:", error);

      const errorMessage =
        error.response?.data?.errors?.[0] || // lấy thông báo cụ thể nếu có
        error.response?.data?.message || // fallback message
        "Lỗi không xác định.";

      toast({
        title: "Lỗi nộp bài",
        status: "warning",
        variant: "solid",
        description: errorMessage,
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setLoading({ status: false, type: "" });
    }
  };


  const handleCompilerChange = (e) => {
    const id = Number(e.target.value);
    const compiler = compilers.find((c) => c.compilerID === id);
    if (compiler) {
      setSelectCompiler(compiler);
    }
  };
  // const handleNextProblem = () => {
  //   if (!problemID) return;
  //   const nextProblemID = parseInt(problemID) + 1;

  //   const searchParams = new URLSearchParams(location.search);
  //   searchParams.set("problemID", nextProblemID);

  //   navigate(`${location.pathname}?${searchParams.toString()}`);
  //   onClose();
  // };


  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  return (
    <VStack h="100%" spacing={0} align="stretch">
      {/* Thanh điều khiển trên cùng */}
      <Box p={4} bg="gray.900" color="white">
        <Flex justifyContent="space-between" alignItems="center">
          <Select
            w="20%"
            value={selectCompiler?.compilerID || ''}
            onChange={handleCompilerChange}
            bg="transparent"
            color="white"
            sx={{
              option: {
                color: "white",
                bg: "gray.900",
              },
            }}
            isDisabled={loading.status}
            cursor="pointer"
          >
            {compilers.map((compiler) => (
              <option key={compiler.compilerID} value={compiler.compilerID}>
                {compiler.compilerName}
              </option>
            ))}
          </Select>
          <Flex width="70%" justify="end" align="center" gap={4}>
            <Select
              w="20%"
              value={theme}
              onChange={handleThemeChange}
              bg="transparent"
              color="white"
              sx={{
                option: {
                  color: "white",
                  bg: "gray.900",
                },
              }}
              isDisabled={loading.status}
              cursor="pointer"
            >
              <option value="vs-dark">Tối</option>
              <option value="vs-light">Sáng</option>
            </Select>

            <Button
              colorScheme="blue"
              borderRadius="md"
              onClick={handleTestRun}
              isLoading={loading.status && loading.type === "test"}
              loadingText="Đang chạy..."
              isDisabled={loading.status || problemID === null}
            >
              Chạy thử
            </Button>

            <Button
              leftIcon={<FaHandPointUp />}
              color={isTestRunSuccess ? "green" : "gray.500"}
              borderRadius="md"
              onClick={handleSubmission}
              isLoading={loading.status && loading.type === "submit"}
              loadingText="Đang chạy..."
              isDisabled={!isTestRunSuccess || loading.status || problemID === null}
            >
              Nộp bài
            </Button>

          </Flex>
        </Flex>
      </Box>

      {/* Trình biên tập code */}
      <Box h="100%" overflow="hidden" overflowY="hidden">
        <Flex direction="column" h="100%" >
          <Box flex="6" overflow="hidden" borderBottom="1px solid #555" >
            <Editor
              height="100%"
              language={
                selectCompiler?.compilerExtension
                  ? selectCompiler.compilerExtension.replace(".", "")
                  : "plaintext"
              }
              theme={theme}
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                readOnly: loading.status,
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
          <ModalHeader textAlign="center">{modalTitle || ""}</ModalHeader>
          <ModalBody textAlign="center" fontSize="lg">{modalMessage || ""}</ModalBody>
          <ModalFooter>
            <Flex w="100%" justify="center" gap={2}>
              <Button colorScheme={modalStyles.colorScheme} onClick={onClose}>
                Đóng
              </Button>
              {/* {isSubmissionSuccess && (
                <Button colorScheme="teal" onClick={handleNextProblem}>
                  Bài tiếp theo
                </Button>
              )} */}
            </Flex>
          </ModalFooter>

        </ModalContent>
      </Modal>

    </VStack>
  );
}
