import axios from "axios";
import { useAuthStore } from "../../store/authStore";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api/v1",
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = useAuthStore.getState().accessToken;

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }

        console.log(
            "API Request:",
            config.method?.toUpperCase(),
            config.url
        );

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const response = await axiosInstance.post(
                    "/auth/refresh"
                );

                const { user, accessToken } =
                    response.data.data;

                useAuthStore
                    .getState()
                    .setAuth(user, accessToken);

                originalRequest.headers.Authorization =
                    `Bearer ${accessToken}`;

                return axiosInstance(originalRequest);
            } catch (refreshError) {
                useAuthStore
                    .getState()
                    .clearAuth();

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;