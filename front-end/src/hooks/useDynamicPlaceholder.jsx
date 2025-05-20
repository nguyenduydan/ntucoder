import { useTypewriter } from "react-simple-typewriter";

export default function useDynamicPlaceholder(words, options = {}) {
    const [text] = useTypewriter({
        words,
        loop: true,
        delaySpeed: 1000,
        ...options, // cho phép ghi đè config nếu cần
    });

    return text;
}
