import { useState, useEffect } from "react";
import { Flex, Skeleton } from "antd";
import {
  usePreferences,
  useSavePreferences,
  useNormalizePreferences,
  useNormalizeWithFile,
} from "../hooks/usePreferences";
import { useDirtyForm } from "../hooks/useDirtyForm";
import { NormalizeCard } from "../components/NormalizeCard";
import { PreferencesForm } from "../components/PreferencesForm";
import { SaveBar } from "../components/SaveBar";
import { EMPTY_PREFERENCES } from "../types";
import type { Preferences } from "../types";

export const JobPreferencesTab = () => {
  const { data: preferences, isLoading } = usePreferences();
  const saveMutation = useSavePreferences();
  const normalizeMutation = useNormalizePreferences();
  const normalizeFileMutation = useNormalizeWithFile();
  const [saved, setSaved] = useState(false);

  const initial = preferences ?? EMPTY_PREFERENCES;
  const { form, setForm, update, isDirty, reset } = useDirtyForm<Preferences>(initial);

  useEffect(() => {
    const result = normalizeMutation.data ?? normalizeFileMutation.data;
    if (!result) return;
    setForm((prev) => ({
      ...prev,
      categories: result.categories,
      seniorityLevels: result.seniorityLevels,
      keywords: result.keywords,
      excludedKeywords: result.excludedKeywords,
      locations: result.locations,
      languages: result.languages,
      remoteOnly: result.remoteOnly,
    }));
  }, [normalizeMutation.data, normalizeFileMutation.data, setForm]);

  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => setSaved(false), 2500);
    return () => clearTimeout(timer);
  }, [saved]);

  const handleSave = () => {
    saveMutation.mutate(form, { onSuccess: () => setSaved(true) });
  };

  const normalizing = normalizeMutation.isPending || normalizeFileMutation.isPending;

  if (isLoading) return <Skeleton active paragraph={{ rows: 14 }} />;

  return (
    <Flex vertical gap={16}>
      <NormalizeCard
        rawInput={form.rawInput}
        onRawInputChange={(v) => update("rawInput", v)}
        onNormalizeText={(raw) => normalizeMutation.mutate(raw)}
        onNormalizeFile={(file) => normalizeFileMutation.mutate(file)}
        normalizing={normalizing}
      />
      <PreferencesForm form={form} onChange={update} />
      <SaveBar
        isDirty={isDirty}
        saved={saved}
        saving={saveMutation.isPending}
        onSave={handleSave}
        onDiscard={reset}
      />
    </Flex>
  );
};
