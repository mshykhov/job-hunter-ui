import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, API_PATHS } from "@/lib/api";

import {
  type CandidateProfile,
  MATERIAL_STATUS,
  type MaterialKind,
  type MaterialRequest,
  type MaterialRevision,
  type MaterialStatus,
} from "../types";

const requestKey = (jobId: string) => ["application-materials", jobId, "requests"] as const;
const revisionKey = (jobId: string) => ["application-materials", jobId, "revisions"] as const;
const profileKey = ["application-materials", "profiles"] as const;

export interface CreateApplicationMaterialsInput {
  requestedKinds: MaterialKind[];
  regenerate: boolean;
}

const ACTIVE_STATUSES = new Set<MaterialStatus>([
  MATERIAL_STATUS.QUEUED,
  MATERIAL_STATUS.CLAIMED,
  MATERIAL_STATUS.GENERATING,
  MATERIAL_STATUS.VALIDATING,
  MATERIAL_STATUS.RENDERING,
]);

const isActive = (requests: MaterialRequest[] | undefined) =>
  requests?.some((request) => ACTIVE_STATUSES.has(request.status)) ?? false;

export const useApplicationMaterials = (jobId: string) => {
  const requests = useQuery({
    queryKey: requestKey(jobId),
    queryFn: async () => (await api.get<MaterialRequest[]>(API_PATHS.JOB_MATERIALS(jobId))).data,
    refetchInterval: (query) => (isActive(query.state.data) ? 2_000 : false),
  });
  const revisions = useQuery({
    queryKey: revisionKey(jobId),
    queryFn: async () =>
      (await api.get<MaterialRevision[]>(API_PATHS.JOB_MATERIAL_REVISIONS(jobId))).data,
    refetchInterval: () => (isActive(requests.data) ? 2_000 : false),
  });
  return {
    requests: requests.data ?? [],
    revisions: revisions.data ?? [],
    isLoading: requests.isLoading || revisions.isLoading,
    error: requests.error ?? revisions.error,
  };
};

export const useCreateApplicationMaterials = (jobId: string) => {
  const queryClient = useQueryClient();
  return useMutation<MaterialRequest, Error, CreateApplicationMaterialsInput>({
    mutationFn: async (request) =>
      (await api.post<MaterialRequest>(API_PATHS.JOB_MATERIALS(jobId), request)).data,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: requestKey(jobId) });
    },
  });
};

export const useCandidateProfiles = () => {
  const profiles = useQuery({
    queryKey: profileKey,
    queryFn: async () => (await api.get<CandidateProfile[]>(API_PATHS.MATERIAL_PROFILES)).data,
    staleTime: 60_000,
  });
  return {
    profiles: profiles.data ?? [],
    isLoading: profiles.isLoading,
    error: profiles.error,
  };
};

export const useImproveApplicationMaterials = (jobId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (revisionId: string) =>
      (await api.post<MaterialRequest>(API_PATHS.MATERIAL_IMPROVE_SOL(revisionId))).data,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: requestKey(jobId) });
    },
  });
};

export const useSelectMaterialRevision = (jobId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (revisionId: string) => {
      await api.post(API_PATHS.MATERIAL_SELECT(revisionId));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: revisionKey(jobId) });
    },
  });
};

export const useMaterialText = (
  revisionId: string | undefined,
  kind: MaterialKind,
  enabled: boolean
) =>
  useQuery({
    queryKey: ["application-materials", "artifact", revisionId, kind],
    queryFn: async () =>
      (
        await api.get<string>(API_PATHS.MATERIAL_ARTIFACT(revisionId ?? "", kind), {
          responseType: "text",
        })
      ).data,
    enabled: enabled && revisionId !== undefined,
    staleTime: Infinity,
  });

export const downloadMaterialArtifact = async (revisionId: string, kind: MaterialKind) => {
  const response = await api.get<Blob>(API_PATHS.MATERIAL_ARTIFACT(revisionId, kind), {
    responseType: "blob",
  });
  const url = URL.createObjectURL(response.data);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = kind === "CV_PDF" ? "cv.pdf" : "cv.docx";
  anchor.click();
  URL.revokeObjectURL(url);
};
