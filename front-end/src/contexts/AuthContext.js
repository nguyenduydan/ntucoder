import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import api from 'config/apiConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [coder, setCoder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = Cookies.get('token');
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const res = await api.get('/Auth/me', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (res.status === 200) {
                    setCoder(res.data);
                }
            } catch (err) {
                if (err.response?.status === 401) {
                    // Handle unauthorized (token expired or invalid)
                    Cookies.remove('token');
                    setCoder(null);
                    window.location.href = '/'; // Or redirect to login page
                }
                console.log('Lỗi xác thực:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    const logout = async () => {
        try {
            await api.post('/Auth/logout');
        } catch (e) {
            console.log('Lỗi khi đăng xuất:', e);
        }
        Cookies.remove('token');
        setCoder(null);
        window.location.href = '/';
    };

    const isAuthenticated = !!coder;

    return (
        <AuthContext.Provider value={{ coder, setCoder, logout, isLoading, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => useContext(AuthContext);
