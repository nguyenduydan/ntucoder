import axios from "axios";
import 'nprogress/nprogress.css'; // Import NProgress styles

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://localhost:7015/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,

});


export default api;
