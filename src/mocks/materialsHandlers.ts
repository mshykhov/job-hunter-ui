import { http, HttpResponse } from "msw";

import { API_URL } from "@/config/constants";

const url = (path: string) => `${API_URL}${path}`;

export const materialsHandlers = [
  http.get(url("/jobs/:jobId/materials"), () => HttpResponse.json([])),
  http.get(url("/jobs/:jobId/materials/revisions"), () => HttpResponse.json([])),
  http.post(url("/jobs/:jobId/materials"), () =>
    HttpResponse.json({
      packageId: "mock-package",
      requestId: "mock-request",
      status: "QUEUED",
      mode: "TERRA",
      requestedKinds: ["CV_DOCX", "CV_PDF", "COVER_LETTER", "RECRUITER_MESSAGE"],
      coverLetterPolicy: "OPTIONAL_STANDARD",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  ),
];
