import React, { useEffect } from "react";
import { animate, svg } from "animejs";

export default function MotionPathAnimator({ targetRef, pathRef, duration = 5000 }) {
    useEffect(() => {
        if (!targetRef.current || !pathRef.current) return;

        const motionPathAnimation = animate(targetRef.current, {
            ...svg.createMotionPath(pathRef.current),
            duration,
            loop: true,
            easing: "linear",
        });

        const drawAnimation = animate(svg.createDrawable(pathRef.current), {
            draw: "0 1",
            duration,
            loop: true,
            easing: "linear",
        });

        return () => {
            motionPathAnimation.pause();
            drawAnimation.pause();
        };
    }, [targetRef, pathRef, duration]);

    return null;
}
