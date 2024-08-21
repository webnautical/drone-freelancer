import axios from "../../node_modules/axios/index";
import { apiBaseURL, getAllLocatData } from "./Utility";

export const axiosInstance = axios.create({
    // baseURL: 'http://170.64.131.134',
    baseURL: apiBaseURL(),
    // baseURL: 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
function getAuthToken() {
    return getAllLocatData()?.jwt || localStorage.getItem('jwt')
}