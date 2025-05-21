import { motion, useMotionValue, useSpring, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const Counter = ({ to }) => {
    const count = useMotionValue(0);
    const spring = useSpring(count, { duration: 2, stiffness: 100, damping: 20 });
    const [displayValue, setDisplayValue] = useState(0);

    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.6 });

    useEffect(() => {
        const unsubscribe = spring.on("change", (v) => {
            setDisplayValue(Math.floor(v));
        });
        return () => unsubscribe();
    }, [spring]);

    useEffect(() => {
        if (isInView) {
            count.set(to);
        }
    }, [isInView, to, count]);

    return (
        <motion.span
            ref={ref}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.3 }}
        >
            {displayValue.toLocaleString()}
        </motion.span>
    );
};

export default Counter;
