import axios from "axios";
import NProgress from 'nprogress';
import Cookies from 'js-cookie';
import 'nprogress/nprogress.css'; // Import NProgress styles

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://localhost:7015/api";

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
    NProgress.start();
    const token = Cookies.get('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => {
        NProgress.done();
        return response;
    },
    (error) => {
        NProgress.done();
        return Promise.reject(error);
    }
);

export default api;
