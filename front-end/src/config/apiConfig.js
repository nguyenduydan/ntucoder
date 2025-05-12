import axios from "axios";
import NProgress from 'nprogress';
import Cookies from 'js-cookie';
import 'nprogress/nprogress.css'; // Import NProgress styles

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://localhost:7015/api";
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 3000,
});

api.interceptors.request.use((config) => {
    NProgress.start();
    const token = Cookies.get('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.request.use((config) => {
    NProgress.start();
    const token = Cookies.get('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Ngăn cache (nếu server có cơ chế cache)
    config.headers['Cache-Control'] = 'no-cache';
    config.headers['Pragma'] = 'no-cache';
    config.headers['Expires'] = '0';

    return config;
});

export default api;
