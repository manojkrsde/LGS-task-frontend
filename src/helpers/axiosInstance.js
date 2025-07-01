import axios from "axios";

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const axiosInstance = axios.create({
  baseURL: BACKEND_BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const customMessage =
      error?.response?.data?.message || "Something went wrong";
    error.message = customMessage;
    return Promise.reject(error);
  }
);

export default axiosInstance;
