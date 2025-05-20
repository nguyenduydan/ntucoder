import { useState } from "react";
import StepSendCode from "layouts/auth/StepSendCode";
import StepVerifyCode from "layouts/auth/StepVerifyCode";
import StepResetPassword from "layouts/auth/StepResetPassword";
import {
    Box,
    Text,
    Button,
    Step,
    StepIcon,
    StepIndicator,
    StepNumber,
    StepSeparator,
    StepStatus,
    StepTitle,
    Stepper,
    useSteps,
    useToast,
} from "@chakra-ui/react";
import api from "@/config/apiConfig"; // nhớ import api

const steps = [
    { title: "Gửi mã", description: "Nhập email để nhận mã" },
    { title: "Xác nhận mã", description: "Nhập mã đã nhận được" },
    { title: "Đặt lại mật khẩu", description: "Đặt mật khẩu mới" },
    { title: "Hoàn thành", description: "Xong rồi" },
];

const ForgotPassword = () => {
    const toast = useToast();
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [step, setStep] = useState(0);
    const [resendLoading, setResendLoading] = useState(false);
    const [verifyKey, setVerifyKey] = useState(0);

    const { activeStep, setActiveStep } = useSteps({
        index: step,
        count: steps.length,
    });

    const handleCodeSent = (sentEmail) => {
        setEmail(sentEmail);
        setActiveStep(1);
        setStep(1);
    };

    const handleCodeVerified = (verifiedCode) => {
        setCode(verifiedCode);
        setActiveStep(2);
        setStep(2);
    };

    const handleResetSuccess = () => {
        setActiveStep(3);
        setStep(3);
    };

    const handleResendCode = async () => {
        if (!email) {
            toast({
                title: "Email không hợp lệ.",
                status: "warning",
                duration: 3000,
                isClosable: true,
                variant: "top-accent",
                position: "top",
            });
            return;
        }

        setResendLoading(true);
        try {
            await api.post("/auth/send-reset-code", { email });
            toast({
                title: "Mã xác thực đã được gửi lại.",
                status: "success",
                duration: 3000,
                isClosable: true,
                variant: "top-accent",
                position: "top",
            });

            // Reset lại code đã nhập (để clear input ở StepVerifyCode)
            setCode("");
            setVerifyKey(prev => prev + 1);
        } catch (error) {
            toast({
                title: "Gửi lại mã thất bại.",
                description: error.response?.data?.message || "Lỗi không xác định.",
                status: "error",
                duration: 3000,
                isClosable: true,
                variant: "top-accent",
                position: "top",
            });
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <Box maxWidth="100%" mx="auto" p={5}>
            <Stepper index={activeStep} orientation="horizontal" mb={8}>
                {steps.map(({ title }, index) => (
                    <Step key={title}>
                        <StepIndicator>
                            <StepStatus
                                complete={<StepIcon />}
                                incomplete={<StepNumber />}
                                active={<StepNumber />}
                            />
                        </StepIndicator>

                        <Box flexShrink="0">
                            <StepTitle fontSize="sm">{title}</StepTitle>
                        </Box>

                        {index !== steps.length - 1 && <StepSeparator />}
                    </Step>
                ))}
            </Stepper>

            {step === 0 && <StepSendCode onCodeSent={handleCodeSent} />}
            {step === 1 && (
                <>
                    <StepVerifyCode
                        key={verifyKey}  // key thay đổi sẽ làm React tạo lại component mới hoàn toàn
                        email={email}
                        onCodeVerified={handleCodeVerified}
                    />
                    <Text mt={4}>
                        Chưa nhận được mã?{" "}
                        <Button
                            variant="link"
                            colorScheme="blue"
                            onClick={handleResendCode}
                            width="30%"
                            isLoading={resendLoading}
                        >
                            Gửi lại
                        </Button>
                    </Text>
                    <Text ml={2} fontSize="sm" color="red" mt={2} fontStyle={"italic"}>
                        Nếu bạn không nhận được mã, hãy kiểm tra thư mục spam hoặc thử lại.
                    </Text>
                </>
            )}
            {step === 2 && (
                <StepResetPassword email={email} code={code} onResetSuccess={handleResetSuccess} />
            )}
            {step === 3 && (
                <>
                    <Text
                        textAlign="center"
                        color="green.600"
                        fontWeight="bold"
                        mb={4}
                    >
                        Mật khẩu đã được đổi thành công! Vui lòng đăng nhập lại.
                    </Text>
                    <Button width="full" colorScheme="blue" onClick={() => window.location.reload()}>
                        Quay lại trang đăng nhập
                    </Button>
                </>
            )}
        </Box>
    );
};

export default ForgotPassword;
