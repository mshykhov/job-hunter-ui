export interface OutreachSourceConfig {
  coverLetterEnabled: boolean;
  recruiterMessageEnabled: boolean;
  coverLetterPrompt: string | null;
  recruiterMessagePrompt: string | null;
}

export interface OutreachSettings {
  coverLetterPrompt: string | null;
  recruiterMessagePrompt: string | null;
  sourceConfig: Record<string, OutreachSourceConfig>;
  defaultCoverLetterPrompt: string;
  defaultRecruiterMessagePrompt: string;
}

export interface SaveOutreachSettings {
  coverLetterPrompt: string | null;
  recruiterMessagePrompt: string | null;
  sourceConfig: Record<string, OutreachSourceConfig>;
}

export interface OutreachJobInfo {
  id: string;
  title: string;
  company: string | null;
  url: string;
  source: string;
}

export interface CoverLetterResponse {
  coverLetter: string;
  job: OutreachJobInfo;
}

export interface RecruiterMessageResponse {
  recruiterMessage: string;
  job: OutreachJobInfo;
}

export interface OutreachTestRequest {
  source: string;
}

export const EMPTY_OUTREACH_SETTINGS: SaveOutreachSettings = {
  coverLetterPrompt: null,
  recruiterMessagePrompt: null,
  sourceConfig: {},
};
