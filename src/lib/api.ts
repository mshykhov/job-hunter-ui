import axios from "axios";
import { API_URL } from "@/config/constants";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

export const API_PATHS = {
  JOBS: "/jobs",
  JOB_STATUS: (jobId: string) => `/jobs/${jobId}/status`,
  CRITERIA: "/criteria",
  PREFERENCES: "/preferences",
  HEALTH: "/actuator/health",
} as const;
