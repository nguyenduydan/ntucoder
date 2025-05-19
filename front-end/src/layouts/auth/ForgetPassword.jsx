import { useState } from "react";
import StepSendCode from "layouts/auth/StepSendCode";
import StepVerifyCode from "layouts/auth/StepVerifyCode";
import StepResetPassword from "layouts/auth/StepResetPassword";
import {
    Box,
    Text,
    Button,
    Step,
    StepDescription,
    StepIcon,
    StepIndicator,
    StepNumber,
    StepSeparator,
    StepStatus,
    StepTitle,
    Stepper,
    useSteps,
} from "@chakra-ui/react";

const steps = [
    { title: "Gửi mã", description: "Nhập email để nhận mã" },
    { title: "Xác nhận mã", description: "Nhập mã đã nhận được" },
    { title: "Đặt lại mật khẩu", description: "Đặt mật khẩu mới" },
    { title: "Hoàn thành", description: "Xong rồi" },
];

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [step, setStep] = useState(0); // dùng index 0-based cho useSteps

    const { activeStep, setActiveStep, nextStep, prevStep } = useSteps({
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

    return (
        <Box maxWidth="100%" mx="auto" p={5}>
            <Stepper index={activeStep} orientation="horizontal" mb={8}>
                {steps.map(({ title, description }, index) => (
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
                    <StepVerifyCode email={email} onCodeVerified={handleCodeVerified} />
                    <Text mt={4}>
                        Chưa nhận được mã?{" "}
                        <Button
                            variant="link"
                            colorScheme="blue"
                            onClick={() => {
                                setActiveStep(0);
                                setStep(0);
                            }}
                            width="30%"
                        >
                            Gửi lại
                        </Button>
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
