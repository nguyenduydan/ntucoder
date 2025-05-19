import React, { useEffect, useRef } from "react";
import { Box, Button } from "@chakra-ui/react";
import { animate } from "animejs";

export default function NeonRunButton({ children, onClick }) {
    const pathRef = useRef(null);

    useEffect(() => {
        if (!pathRef.current) return;

        const length = pathRef.current.getTotalLength();

        // Dash dài 30, gap là phần còn lại (tạo dải sáng nhỏ chạy vòng quanh)
        pathRef.current.style.strokeDasharray = `60 50`;
        pathRef.current.style.strokeDashoffset = 0;

        animate(pathRef.current, {
            strokeDashoffset: [0, length + 35], // stroke chạy liên tục vòng quanh
            duration: 2000,
            loop: true,
            easing: "linear",
        });

        animate('#neonGradient', {
            attr: { x1: [0, 4], x2: [4, 8] },
            duration: 3000,
            easing: 'linear',
            loop: true,
        });
    }, []);

    return (
        <Box position="relative" display="inline-block" width="180px" height="60px">
            <svg
                width="180"
                height="60"
                style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
                viewBox="0 0 180 60"
                fill="none"
            >
                <linearGradient id="neonGradient" x1="0" y1="0" x2="4" y2="1">
                    <stop offset="0%" stopColor="#00f" />
                    <stop offset="10%" stopColor="#0ff" />
                    <stop offset="30%" stopColor="#0f0" />
                    <stop offset="50%" stopColor="#ff0" />
                    <stop offset="70%" stopColor="#f80" />
                    <stop offset="90%" stopColor="#f00" />
                    <stop offset="100%" stopColor="#00f" />
                </linearGradient>
                <rect
                    ref={pathRef}
                    x="3"
                    y="3"
                    width="150"
                    height="48px"
                    rx="15"
                    ry="15"
                    stroke="url(#neonGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    filter="drop-shadow(0 0 2px #0ff)"
                />
            </svg>

            <Button
                variant="outline"
                size="lg"
                colorScheme="white"
                onClick={onClick}
                style={{
                    width: "150px",
                    height: "50px",
                    position: "relative",
                    zIndex: 1,
                    borderRadius: "12px",
                    fontWeight: "bold",
                }}
                _hover={{ color: "blue.200" }}
                border="none"
            >
                {children}
            </Button>
        </Box>
    );
}
