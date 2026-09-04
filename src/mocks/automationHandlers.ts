import { http, HttpResponse } from "msw";

import { API_URL } from "@/config/constants";

import { AUTOMATION_STATUS_MOCK, AUTOMATION_WORKFLOW_MOCK } from "./automationFixture";

const url = (path: string) => `${API_URL}${path}`;

export const automationHandlers = [
  http.get(url("/automation/status"), () => HttpResponse.json(AUTOMATION_STATUS_MOCK)),
  http.get(url("/automation/workflows/runs"), () => HttpResponse.json([AUTOMATION_WORKFLOW_MOCK])),
  http.get(url("/automation/workflows/runs/:runId"), () =>
    HttpResponse.json(AUTOMATION_WORKFLOW_MOCK)
  ),
  http.post(url("/automation/workflows/runs"), () => HttpResponse.json(AUTOMATION_WORKFLOW_MOCK)),
  http.post(url("/automation/workflows/runs/:runId/:action"), () =>
    HttpResponse.json(AUTOMATION_WORKFLOW_MOCK)
  ),
];
