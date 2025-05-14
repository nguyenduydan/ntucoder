import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

const Counter = ({ to }) => {
    const count = useMotionValue(0);
    const spring = useSpring(count, { duration: 2, stiffness: 100, damping: 20 });
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const unsubscribe = spring.on("change", (v) => {
            setDisplayValue(Math.floor(v));
        });
        return () => unsubscribe();
    }, [spring]);

    const handleStart = () => {
        count.set(to);
    };

    return (
        <motion.span
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: { duration: 0.3 },
                },
            }}
            onViewportEnter={handleStart}
        >
            {displayValue.toLocaleString()}
        </motion.span>
    );
};

export default Counter;
