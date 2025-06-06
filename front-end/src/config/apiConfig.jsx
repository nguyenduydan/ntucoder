import axios from "axios";
import 'nprogress/nprogress.css'; // Import NProgress styles

const url_host = import.meta.env.VITE_API_BASE_URL;

const API_BASE_URL = url_host || "https://localhost:7015/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,

});


export default api;
