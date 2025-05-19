import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import api from '@/config/apiConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [coder, setCoder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Tách fetchUserInfo ra bên ngoài useEffect
    const fetchUserInfo = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/Auth/me'); // cookie sẽ tự gửi đi
            if (res.status === 200) {
                setCoder(res.data);
            }
        } catch (err) {
            if (err.response?.status === 401) {
                Cookies.remove('token');
                setCoder(null);
                if (window.location.pathname !== '/') {
                    window.location.href = '/';
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    // Thêm hàm login thành công gọi fetchUserInfo lại
    const loginSuccessHandler = () => {
        fetchUserInfo();
    };

    const logout = async () => {
        try {
            await api.post('/Auth/logout', {}, { withCredentials: true });
        } catch (e) {
            console.log('Lỗi khi đăng xuất:', e);
        } finally {
            setCoder(null);
            window.location.reload();
        }
    };

    const isAuthenticated = !!coder;

    return (
        <AuthContext.Provider value={{ coder, setCoder, logout, isLoading, isAuthenticated, loginSuccessHandler }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => useContext(AuthContext);
