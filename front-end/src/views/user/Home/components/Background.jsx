"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const Background = () => {
    const [order, setOrder] = useState(initialOrder);

    useEffect(() => {
        const timeout = setTimeout(() => setOrder(shuffle(order)), 1000);
        return () => clearTimeout(timeout);
    }, [order]);

    return (
        <ul style={container}>
            {order.map((backgroundColor) => (
                <motion.li
                    key={backgroundColor}
                    layout
                    transition={spring}
                    style={{ ...item, backgroundColor }}
                />
            ))}
        </ul>
    );
};

const initialOrder = [
    "#ff0088",
    "#dd00ee",
    "#9911ff",
    "#0d63f8",
];

/**
 * ==============   Utils   ================
 */
function shuffle([...array]) {
    return array.sort(() => Math.random() - 0.5);
}

/**
 * ==============   Styles   ================
 */

const spring = {
    type: "spring",
    damping: 20,
    stiffness: 200,
};

const container = {
    listStyle: "none",
    padding: 0,
    margin: 0,
    position: "relative",
    display: "flex",
    flexWrap: "wrap",
    gap: 5,
    width: 80,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
};

const item = {
    width: 30,
    height: 30,
    borderRadius: "10px",
};
