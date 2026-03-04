import { useState, useEffect, useCallback } from "react";
import { Collapse, Flex, Skeleton } from "antd";
import { FilterOutlined, RobotOutlined, SearchOutlined } from "@ant-design/icons";
import {
  usePreferences,
  useSaveSearchPreferences,
  useSaveMatchingPreferences,
  useNormalizePreferences,
  useNormalizeWithFile,
} from "../hooks/usePreferences";
import { useDirtyForm } from "../hooks/useDirtyForm";
import { NormalizeCard } from "../components/NormalizeCard";
import { SearchSection } from "../components/SearchSection";
import { MatchingSection } from "../components/MatchingSection";
import { SaveBar } from "../components/SaveBar";
import { EMPTY_PREFERENCES } from "../types";
import type { SearchPreferences, MatchingPreferences } from "../types";

export const JobPreferencesTab = () => {
  const { data: preferences, isLoading } = usePreferences();
  const saveSearchMutation = useSaveSearchPreferences();
  const saveMatchingMutation = useSaveMatchingPreferences();
  const normalizeMutation = useNormalizePreferences();
  const normalizeFileMutation = useNormalizeWithFile();

  const initial = preferences ?? EMPTY_PREFERENCES;
  const searchForm = useDirtyForm<SearchPreferences>(initial.search);
  const matchingForm = useDirtyForm<MatchingPreferences>(initial.matching);

  const [searchSaved, setSearchSaved] = useState(false);
  const [matchingSaved, setMatchingSaved] = useState(false);

  const updateSearch = useCallback(
    <K extends keyof SearchPreferences>(key: K, value: SearchPreferences[K]) =>
      searchForm.setForm((prev) => ({ ...prev, [key]: value })),
    [searchForm.setForm],
  );

  const updateMatching = useCallback(
    <K extends keyof MatchingPreferences>(key: K, value: MatchingPreferences[K]) =>
      matchingForm.setForm((prev) => ({ ...prev, [key]: value })),
    [matchingForm.setForm],
  );

  const normalizeResult = normalizeMutation.data ?? normalizeFileMutation.data;
  useEffect(() => {
    if (!normalizeResult) return;
    searchForm.setForm((prev) => ({
      ...prev,
      categories: normalizeResult.categories,
      seniorityLevels: normalizeResult.seniorityLevels,
      locations: normalizeResult.locations,
      remoteOnly: normalizeResult.remoteOnly,
    }));
    matchingForm.setForm((prev) => ({
      ...prev,
      keywords: normalizeResult.keywords,
      excludedKeywords: normalizeResult.excludedKeywords,
      disabledSources: normalizeResult.disabledSources,
    }));
  }, [normalizeResult, searchForm.setForm, matchingForm.setForm]);

  useEffect(() => {
    if (!searchSaved) return;
    const t = setTimeout(() => setSearchSaved(false), 2500);
    return () => clearTimeout(t);
  }, [searchSaved]);

  useEffect(() => {
    if (!matchingSaved) return;
    const t = setTimeout(() => setMatchingSaved(false), 2500);
    return () => clearTimeout(t);
  }, [matchingSaved]);

  const normalizing = normalizeMutation.isPending || normalizeFileMutation.isPending;

  if (isLoading) return <Skeleton active paragraph={{ rows: 14 }} />;

  return (
    <Collapse
      defaultActiveKey={["search", "matching"]}
      items={[
        {
          key: "normalize",
          label: "AI Normalization",
          extra: <RobotOutlined />,
          children: (
            <NormalizeCard
              rawInput={searchForm.form.rawInput}
              onRawInputChange={(v) => updateSearch("rawInput", v)}
              onNormalizeText={(raw) => normalizeMutation.mutate(raw)}
              onNormalizeFile={(file) => normalizeFileMutation.mutate(file)}
              normalizing={normalizing}
            />
          ),
        },
        {
          key: "search",
          label: "Search Criteria",
          extra: <SearchOutlined />,
          children: (
            <Flex vertical gap={16}>
              <SearchSection form={searchForm.form} onChange={updateSearch} />
              <SaveBar
                isDirty={searchForm.isDirty}
                saved={searchSaved}
                saving={saveSearchMutation.isPending}
                onSave={() => saveSearchMutation.mutate(searchForm.form, { onSuccess: () => setSearchSaved(true) })}
                onDiscard={searchForm.reset}
              />
            </Flex>
          ),
        },
        {
          key: "matching",
          label: "Matching & Filtering",
          extra: <FilterOutlined />,
          children: (
            <Flex vertical gap={16}>
              <MatchingSection form={matchingForm.form} onChange={updateMatching} />
              <SaveBar
                isDirty={matchingForm.isDirty}
                saved={matchingSaved}
                saving={saveMatchingMutation.isPending}
                onSave={() => saveMatchingMutation.mutate(matchingForm.form, { onSuccess: () => setMatchingSaved(true) })}
                onDiscard={matchingForm.reset}
              />
            </Flex>
          ),
        },
      ]}
    />
  );
};
