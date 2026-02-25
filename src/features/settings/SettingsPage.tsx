import { useState, useEffect } from "react";
import { Flex, Skeleton, Typography } from "antd";
import {
  usePreferences,
  useSavePreferences,
  useNormalizePreferences,
} from "./hooks/usePreferences";
import { PreferencesForm } from "./components/PreferencesForm";
import type { Preferences } from "./types";

const EMPTY_PREFERENCES: Preferences = {
  rawInput: null,
  categories: [],
  seniorityLevels: [],
  keywords: [],
  excludedKeywords: [],
  remoteOnly: false,
  disabledSources: [],
  minScore: 50,
  notificationsEnabled: true,
};

export const SettingsPage = () => {
  const { data: preferences, isLoading } = usePreferences();
  const saveMutation = useSavePreferences();
  const normalizeMutation = useNormalizePreferences();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => setSaved(false), 2500);
    return () => clearTimeout(timer);
  }, [saved]);

  const handleSave = (p: Preferences) => {
    saveMutation.mutate(p, {
      onSuccess: () => setSaved(true),
    });
  };

  return (
    <Flex vertical gap={16}>
      <Typography.Title level={4} style={{ margin: 0 }}>
        Settings
      </Typography.Title>
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 12 }} />
      ) : (
        <PreferencesForm
          initial={preferences ?? EMPTY_PREFERENCES}
          onSave={handleSave}
          onNormalize={(raw) => normalizeMutation.mutate(raw)}
          saving={saveMutation.isPending}
          saved={saved}
          normalizing={normalizeMutation.isPending}
          normalizedResult={normalizeMutation.data ?? null}
        />
      )}
    </Flex>
  );
};
