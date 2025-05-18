import { Button } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { animate, createScope, createSpring } from "animejs";

const NeonButton = ({ children, onClick, ...props }) => {
    const buttonRef = useRef(null);
    const scope = useRef(null);

    useEffect(() => {
        scope.current = createScope({ root: buttonRef }).add(() => {
            animate(buttonRef.current, {
                scale: [
                    { to: 1, ease: createSpring({ stiffness: 200, damping: 10 }), duration: 500 },
                    { to: 0.9, ease: createSpring({ stiffness: 200, damping: 10 }), duration: 500 },
                ],
                loop: true,
                direction: "alternate",
            });
        });

        return () => scope.current.revert();
    }, []);

    return (
        <Button
            ref={buttonRef}
            onClick={onClick}
            size="lg"
            px={8}
            py={6}
            bg="blue.600"
            color="white"
            borderRadius="xl"
            boxShadow="0 0 15px #3b82f6, 0 0 30px #3b82f6"
            _hover={{
                bg: "blue.500",
                boxShadow: "0 0 15px #3b82f6, 0 0 30px #3b82f6",
            }}
            fontWeight="bold"
            {...props}
        >
            {children}
        </Button>
    );
};

export default NeonButton;
