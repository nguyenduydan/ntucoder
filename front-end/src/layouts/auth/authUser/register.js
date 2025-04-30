// components/auth/Register.js
import React, { useState } from "react";
import {
    FormControl,
    FormLabel,
    InputGroup,
    InputRightElement,
    IconButton,
    Button
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import FlushedInput from "../../../components/fields/InputField";

const Register = ({ onSubmit, onSwitch }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repassword, setRepassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <FormControl>
                <FormLabel fontWeight="bold">Tên</FormLabel>
                <FlushedInput
                    type="text"
                    placeholder="Nhập tên"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>

            <FormControl mt={4}>
                <FormLabel fontWeight="bold">Email</FormLabel>
                <FlushedInput
                    type="email"
                    placeholder="Nhập email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>

            <FormControl mt={4}>
                <FormLabel fontWeight="bold">Mật khẩu</FormLabel>
                <InputGroup>
                    <FlushedInput
                        type={showPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement>
                        <IconButton
                            variant="link"
                            icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                            onClick={() => setShowPassword(!showPassword)}
                        />
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl mt={4}>
                <FormLabel fontWeight="bold">Xác nhận mật khẩu</FormLabel>
                <FlushedInput
                    type={showPassword ? "text" : "password"}
                    placeholder="Xác nhận mật khẩu"
                    value={repassword}
                    onChange={(e) => setRepassword(e.target.value)}
                />
            </FormControl>

            <Button colorScheme="blue" width="full" mt={4} onClick={() => onSubmit({ name, email, password, repassword })}>
                Đăng ký
            </Button>
        </>
    );
};

export default Register;
