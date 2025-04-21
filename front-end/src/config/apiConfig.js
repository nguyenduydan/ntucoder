import axios from "axios";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'; // Import NProgress styles

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://localhost:7015/api";
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 3000,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    NProgress.start();
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
