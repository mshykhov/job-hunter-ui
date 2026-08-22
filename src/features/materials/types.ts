export const MATERIAL_STATUS = {
  QUEUED: "QUEUED",
  CLAIMED: "CLAIMED",
  GENERATING: "GENERATING",
  VALIDATING: "VALIDATING",
  RENDERING: "RENDERING",
  READY: "READY",
  READY_WITH_FALLBACK: "READY_WITH_FALLBACK",
  BLOCKED: "BLOCKED",
  FAILED: "FAILED",
} as const;

export type MaterialStatus = (typeof MATERIAL_STATUS)[keyof typeof MATERIAL_STATUS];

export const MATERIAL_KIND = {
  CV_DOCX: "CV_DOCX",
  CV_PDF: "CV_PDF",
  COVER_LETTER: "COVER_LETTER",
  RECRUITER_MESSAGE: "RECRUITER_MESSAGE",
} as const;

export type MaterialKind = (typeof MATERIAL_KIND)[keyof typeof MATERIAL_KIND];

export interface MaterialRequest {
  packageId: string;
  requestId: string;
  status: MaterialStatus;
  mode: "TERRA" | "SOL_IMPROVE" | "USER_EDIT_VALIDATION";
  requestedKinds: MaterialKind[];
  coverLetterPolicy: "OPTIONAL_STANDARD" | "REQUIRED_STANDARD" | "REQUIRED_EXTENDED";
  createdAt: string | null;
  updatedAt: string | null;
}

export interface MaterialArtifact {
  kind: MaterialKind;
  mediaType: string;
  sha256: string;
  byteSize: number;
}

export interface MaterialRevision {
  id: string;
  revisionNumber: number;
  parentRevisionId: string | null;
  origin: "GENERATED" | "USER_EDITED" | "BASE_FALLBACK" | "LEGACY_IMPORTED";
  generatorModel: string | null;
  rendererVersion: string;
  eligibilityState: string;
  selected: boolean;
  artifacts: MaterialArtifact[];
  createdAt: string | null;
}

export interface CandidateProfile {
  id: string;
  profileVersion: string;
  schemaVersion: string;
  sourceCommit: string;
  active: boolean;
  createdAt: string | null;
}
