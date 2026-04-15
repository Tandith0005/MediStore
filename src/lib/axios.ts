// src/lib/axios.ts
import { envVars } from "@/config/envVars";
import axios from "axios";


const api = axios.create({
  baseURL: envVars.API_URL || "/api/v1",
  withCredentials: true,         
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // add auth token here later if needed
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;

    // Handle common errors
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        console.warn("Unauthorized - Session expired");
      }

      if (status === 403) {
        console.warn("Forbidden access");
      }

      if (status === 500) {
        console.error("Server error occurred");
      }
    }

    // Format error message nicely
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";

    return Promise.reject({
      ...error,
      message: errorMessage,
      status: error.response?.status,
    });
  }
);

export default api;