export const PREFERENCES_MOCK = {
  about:
    "Senior Java/Kotlin backend engineer with 8 years in fintech and high-load systems. Remote-first, open to EU relocation.",
  search: {
    categories: ["Java", "Kotlin", "Backend"],
    locations: ["Kyiv", "Remote", "EU"],
    disabledSources: [] as string[],
    remoteOnly: true,
  },
  matching: {
    excludedKeywords: ["PHP", "WordPress"],
    excludedTitleKeywords: ["Intern", "Junior"],
    excludedCompanies: ["Outsource Inc"],
    matchWithAi: true,
    customPrompt: null,
  },
  telegram: {
    chatId: "123456789",
    username: "myron",
    notificationsEnabled: true,
    notificationSources: ["djinni", "dou"],
  },
};

export const OUTREACH_MOCK = {
  coverLetterPrompt: null,
  recruiterMessagePrompt: null,
  sourceConfig: {
    djinni: {
      coverLetterEnabled: true,
      recruiterMessageEnabled: true,
      coverLetterPrompt: null,
      recruiterMessagePrompt: null,
    },
    dou: {
      coverLetterEnabled: false,
      recruiterMessageEnabled: true,
      coverLetterPrompt: null,
      recruiterMessagePrompt: null,
    },
  },
  defaultCoverLetterPrompt: "Write a concise, tailored cover letter for {job}.",
  defaultRecruiterMessagePrompt: "Write a short, friendly recruiter outreach message for {job}.",
};

export const AI_PROVIDERS_MOCK = {
  providers: [
    {
      id: "anthropic",
      name: "Anthropic",
      recommended: true,
      models: [
        {
          id: "claude-opus-4-8",
          name: "Claude Opus 4.8",
          inputCostPer1M: 15,
          outputCostPer1M: 75,
          cachedInputCostPer1M: 1.5,
          contextWindow: 200000,
          recommended: true,
        },
        {
          id: "claude-haiku-4-5",
          name: "Claude Haiku 4.5",
          inputCostPer1M: 1,
          outputCostPer1M: 5,
          cachedInputCostPer1M: 0.1,
          contextWindow: 200000,
          recommended: false,
        },
      ],
    },
    {
      id: "openai",
      name: "OpenAI",
      recommended: false,
      models: [
        {
          id: "gpt-5",
          name: "GPT-5",
          inputCostPer1M: 10,
          outputCostPer1M: 30,
          cachedInputCostPer1M: null,
          contextWindow: 128000,
          recommended: false,
        },
      ],
    },
  ],
};

export const AI_SETTINGS_MOCK = { modelId: "claude-opus-4-8", apiKeyHint: "sk-ant-...a1b2" };
