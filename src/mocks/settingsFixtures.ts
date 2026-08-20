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

export const AI_PROVIDERS_MOCK = {
  providers: [
    {
      id: "codex",
      name: "Codex subscription",
      recommended: true,
      requiresApiKey: false,
      models: [
        {
          id: "gpt-5.6-luna",
          name: "GPT-5.6 Luna",
          inputCostPer1M: 0,
          outputCostPer1M: 0,
          cachedInputCostPer1M: null,
          contextWindow: 400000,
          recommended: true,
        },
        {
          id: "gpt-5.6-sol",
          name: "GPT-5.6 Sol",
          inputCostPer1M: 0,
          outputCostPer1M: 0,
          cachedInputCostPer1M: null,
          contextWindow: 400000,
          recommended: false,
        },
      ],
    },
    {
      id: "openai",
      name: "OpenAI",
      recommended: false,
      requiresApiKey: true,
      models: [
        {
          id: "gpt-5-mini",
          name: "GPT-5 Mini",
          inputCostPer1M: 0.25,
          outputCostPer1M: 2,
          cachedInputCostPer1M: 0.025,
          contextWindow: 400000,
          recommended: false,
        },
        {
          id: "gpt-5-nano",
          name: "GPT-5 Nano",
          inputCostPer1M: 0.05,
          outputCostPer1M: 0.4,
          cachedInputCostPer1M: 0.005,
          contextWindow: 400000,
          recommended: false,
        },
      ],
    },
    {
      id: "gemini",
      name: "Google Gemini",
      recommended: false,
      requiresApiKey: true,
      models: [
        {
          id: "gemini-2.5-flash",
          name: "Gemini 2.5 Flash",
          inputCostPer1M: 0.3,
          outputCostPer1M: 2.5,
          cachedInputCostPer1M: 0.03,
          contextWindow: 1000000,
          recommended: false,
        },
      ],
    },
  ],
};

export const AI_PROVIDER_CHAIN_MOCK = {
  chain: [
    {
      priority: 1,
      provider: "codex",
      modelId: "gpt-5.6-luna",
      apiKeyHint: "No API key required",
      enabled: true,
    },
    {
      priority: 2,
      provider: "openai",
      modelId: "gpt-5-mini",
      apiKeyHint: "sk-proj-...a1b2",
      enabled: true,
    },
  ],
};
