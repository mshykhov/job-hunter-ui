import axios, { type AxiosError } from "axios";
import { API_URL } from "@/config/constants";
import type { ApiError } from "@/types";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

type ErrorHandler = (title: string, detail: string) => void;

let errorHandler: ErrorHandler | null = null;

export const registerErrorHandler = (handler: ErrorHandler) => {
  errorHandler = handler;
};

const formatError = (error: AxiosError<ApiError>): { title: string; detail: string } => {
  if (!error.response) {
    return { title: "Network Error", detail: "Cannot reach the server. Check your connection." };
  }

  const { status, data } = error.response;
  const message = data?.message ?? error.message;

  if (status === 403) return { title: "Access Denied", detail: message };
  if (status === 404) return { title: "Not Found", detail: message };
  if (status === 400) return { title: "Bad Request", detail: message };
  if (status >= 500) return { title: "Server Error", detail: message };

  return { title: `Error ${status}`, detail: message };
};

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const { title, detail } = formatError(error);
    errorHandler?.(title, detail);
    return Promise.reject(error);
  }
);

export const API_PATHS = {
  JOBS: "/jobs",
  JOB_STATUS: (jobId: string) => `/jobs/${jobId}/status`,
  CRITERIA: "/criteria",
  PREFERENCES: "/preferences",
  HEALTH: "/actuator/health",
} as const;
