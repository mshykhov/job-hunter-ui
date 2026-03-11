import axios, { type AxiosError,isAxiosError } from "axios";
export { isAxiosError };
import { API_URL } from "@/config/constants";
import type { ApiError } from "@/types";

declare module "axios" {
  interface AxiosRequestConfig {
    skipErrorHandler?: boolean;
    _retried?: boolean;
  }
}

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

type ErrorHandler = (title: string, detail: string) => void;
type TokenGetter = () => Promise<string>;
type AuthErrorHandler = () => void;

let errorHandler: ErrorHandler | null = null;
let tokenGetter: TokenGetter | null = null;
let tokenRefresher: TokenGetter | null = null;
let authErrorHandler: AuthErrorHandler | null = null;

export const registerErrorHandler = (handler: ErrorHandler) => {
  errorHandler = handler;
};

export const registerTokenGetter = (getter: TokenGetter) => {
  tokenGetter = getter;
  return () => {
    tokenGetter = null;
  };
};

export const registerTokenRefresher = (refresher: TokenGetter) => {
  tokenRefresher = refresher;
  return () => {
    tokenRefresher = null;
  };
};

export const registerAuthErrorHandler = (handler: AuthErrorHandler) => {
  authErrorHandler = handler;
  return () => {
    authErrorHandler = null;
  };
};

api.interceptors.request.use(async (config) => {
  if (tokenGetter) {
    try {
      const token = await tokenGetter();
      config.headers.Authorization = `Bearer ${token}`;
    } catch {
      // Token unavailable — send request without auth
    }
  }
  return config;
});

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

let refreshPromise: Promise<string> | null = null;

const refreshTokenOnce = (): Promise<string> | null => {
  if (!tokenRefresher) return null;
  if (!refreshPromise) {
    refreshPromise = tokenRefresher().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config;
    const hadToken = !!originalRequest?.headers?.Authorization;

    if (error.response?.status === 401 && hadToken && originalRequest && !originalRequest._retried) {
      const pending = refreshTokenOnce();
      if (pending) {
        originalRequest._retried = true;
        try {
          const freshToken = await pending;
          originalRequest.headers.Authorization = `Bearer ${freshToken}`;
          return api(originalRequest);
        } catch {
          authErrorHandler?.();
          return Promise.reject(error);
        }
      }
      authErrorHandler?.();
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && hadToken && originalRequest?._retried) {
      authErrorHandler?.();
      return Promise.reject(error);
    }

    if (!originalRequest?.skipErrorHandler && error.response?.status !== 401) {
      const { title, detail } = formatError(error);
      errorHandler?.(title, detail);
    }
    return Promise.reject(error);
  }
);

export const API_PATHS = {
  PUBLIC_JOBS: "/public/jobs",
  PUBLIC_VERSION: "/public/version",
  PUBLIC_JOB_SOURCES: "/public/jobs/sources",
  JOBS_SEARCH: "/jobs/search",
  JOB_GROUP_DETAIL: (groupId: string) => `/jobs/groups/${groupId}`,
  JOB_GROUP_STATUS: (groupId: string) => `/jobs/groups/${groupId}/status`,
  JOB_GROUPS_BULK_STATUS: "/jobs/groups/status",
  CRITERIA: "/criteria",
  PREFERENCES: "/preferences",
  PREFERENCES_SEARCH: "/preferences/search",
  PREFERENCES_MATCHING: "/preferences/matching",
  PREFERENCES_TELEGRAM: "/preferences/telegram",
  PREFERENCES_ABOUT: "/preferences/about",
  PREFERENCES_ABOUT_FILE: "/preferences/about/file",
  PREFERENCES_GENERATE: "/preferences/generate",
  AI_PROVIDERS: "/settings/ai-providers",
  AI_SETTINGS: "/settings/ai",
  OUTREACH_SETTINGS: "/settings/outreach",
  OUTREACH_TEST_COVER_LETTER: "/settings/outreach/test/cover-letter",
  OUTREACH_TEST_RECRUITER_MESSAGE: "/settings/outreach/test/recruiter-message",
  JOB_COVER_LETTER: (jobId: string) => `/jobs/${jobId}/outreach/cover-letter`,
  JOB_RECRUITER_MESSAGE: (jobId: string) => `/jobs/${jobId}/outreach/recruiter-message`,
  JOBS_REMATCH: "/jobs/rematch",
  HEALTH: "/actuator/health",
} as const;
