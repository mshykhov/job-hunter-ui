import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, API_PATHS } from "@/lib/api";

import type {
  CoverLetterResponse,
  OutreachSettings,
  OutreachTestRequest,
  RecruiterMessageResponse,
  SaveOutreachSettings,
} from "../types";

const QUERY_KEY = ["outreach-settings"];

export const useOutreachSettings = () => {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data } = await api.get<OutreachSettings>(API_PATHS.OUTREACH_SETTINGS);
      return data;
    },
    staleTime: 300_000,
  });
};

export const useSaveOutreachSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: SaveOutreachSettings) => {
      const { data } = await api.put<OutreachSettings>(API_PATHS.OUTREACH_SETTINGS, settings);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData<OutreachSettings>(QUERY_KEY, data);
    },
  });
};

export const useTestCoverLetter = () => {
  return useMutation({
    mutationFn: async (request: OutreachTestRequest) => {
      const { data } = await api.post<CoverLetterResponse>(
        API_PATHS.OUTREACH_TEST_COVER_LETTER,
        request,
      );
      return data;
    },
  });
};

export const useTestRecruiterMessage = () => {
  return useMutation({
    mutationFn: async (request: OutreachTestRequest) => {
      const { data } = await api.post<RecruiterMessageResponse>(
        API_PATHS.OUTREACH_TEST_RECRUITER_MESSAGE,
        request,
      );
      return data;
    },
  });
};
