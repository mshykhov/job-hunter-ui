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
  enabledSources: [],
  notificationsEnabled: true,
};

export const SettingsPage = () => {
  const { data: preferences, isLoading } = usePreferences();
  const saveMutation = useSavePreferences();
  const normalizeMutation = useNormalizePreferences();

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
          onSave={(p) => saveMutation.mutate(p)}
          onNormalize={(raw) => normalizeMutation.mutate(raw)}
          saving={saveMutation.isPending}
          normalizing={normalizeMutation.isPending}
          normalizedResult={normalizeMutation.data ?? null}
        />
      )}
    </Flex>
  );
};
