import { createContext, useContext, useState, useEffect } from "react";

// Khởi tạo Context
const TitleContext = createContext();

// Provider để bọc toàn bộ ứng dụng
export const TitleProvider = ({ children }) => {
    const [title, setTitle] = useState("NTU-CODER");

    // Cập nhật `document.title` khi `title` thay đổi
    useEffect(() => {
        document.title = title;
    }, [title]);

    return (
        <TitleContext.Provider value={{ title, setTitle }}>
            {children}
        </TitleContext.Provider>
    );
};

// Hook để sử dụng TitleContext
export const useTitle = (newTitle) => {
    const { setTitle } = useContext(TitleContext);

    useEffect(() => {
        if (newTitle) {
            setTitle(`${newTitle} | NTU-CODER`);
        }
    }, [newTitle, setTitle]);
};

export default TitleContext;
