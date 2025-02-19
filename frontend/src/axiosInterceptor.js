import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Fix import

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000", // Use env variable with fallback
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = sessionStorage.getItem("logintoken");
        const role = sessionStorage.getItem("role");

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
            
            try {
                const decodedToken = jwtDecode(accessToken); // Properly decoding token
                sessionStorage.setItem("userId", decodedToken.userId);
                console.log("Stored userId in sessionStorage:", decodedToken.userId);
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }

        if (role) {
            config.headers.role = role;
        }

        console.log("Final Request Headers:", config.headers);
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
