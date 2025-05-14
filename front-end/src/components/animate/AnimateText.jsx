import React, { useEffect, useRef } from "react";
import { animate } from 'animejs';

const AnimateText = ({ text }) => {
    const textRef = useRef(null);

    useEffect(() => {
        // Chờ đến khi phần tử đã được render và textRef có giá trị
        if (textRef.current) {
            animate('.animateText', {
                y: [
                    { to: '-2.75rem', ease: 'outExpo', duration: 600 },
                    { to: 0, ease: 'outBounce', duration: 800, delay: 100 }
                ],
                // Property specific parameters
                rotate: {
                    from: '-1turn',
                    delay: 0
                },
                delay: (_, i) => i * 50, // Function based value
                ease: 'inOutCirc',
                loopDelay: 1000,
                loop: true
            });
        }
    }, [text]);  // Chạy lại khi text thay đổi

    return (
        <div ref={textRef} style={{ display: "inline-block", margin: "0px 8px" }}>
            {text.split("").map((char, index) => (
                <span
                    className="animateText"
                    key={index}
                    style={{
                        display: "inline-block",
                        marginRight: char === " " ? "0.25rem" : "0px",
                        fontSize: "2.5rem",
                        color: "#007bff",
                        fontWeight: "bold"
                    }}
                >
                    {char}
                </span>
            ))}
        </div>
    );
};

export default AnimateText;
