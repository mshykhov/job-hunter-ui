import { useState, useCallback } from "react";
import { App, Collapse, Flex, Skeleton } from "antd";
import { FilterOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import { createStorage } from "@/lib/storage";
import { usePreferences, useSaveSearchPreferences, useSaveMatchingPreferences } from "../hooks/usePreferences";
import { useRematch } from "@/features/jobs/hooks/useRematch";
import { useDirtyForm } from "../hooks/useDirtyForm";
import { useAboutForm } from "../hooks/useAboutForm";
import { useSavedFlash } from "../hooks/useSavedFlash";
import { AboutCard } from "../components/AboutCard";
import { SearchSection } from "../components/SearchSection";
import { MatchingSection } from "../components/MatchingSection";
import { SaveBar } from "../components/SaveBar";
import { EMPTY_PREFERENCES } from "../types";
import type { SearchPreferences, MatchingPreferences } from "../types";

const DEFAULT_ACTIVE_KEYS = ["about", "search", "matching"];
const collapseStorage = createStorage<string[]>("job-prefs-collapse", 1, DEFAULT_ACTIVE_KEYS);

export const JobPreferencesTab = () => {
  const { modal } = App.useApp();
  const { data: preferences, isLoading } = usePreferences();
  const saveSearchMutation = useSaveSearchPreferences();
  const saveMatchingMutation = useSaveMatchingPreferences();
  const rematchMutation = useRematch();

  const initial = preferences ?? EMPTY_PREFERENCES;
  const aboutForm = useAboutForm(preferences);
  const searchForm = useDirtyForm<SearchPreferences>(initial.search);
  const matchingForm = useDirtyForm<MatchingPreferences>(initial.matching);
  const searchSaved = useSavedFlash();
  const matchingSaved = useSavedFlash();

  const [activeKeys, setActiveKeys] = usePersistedKeys();

  const suggestRematch = useCallback(() => {
    let hours = 12;
    modal.confirm({
      title: "Re-match jobs?",
      content: (
        <Flex vertical gap={8}>
          <span>Your preferences have changed. Re-match jobs with the updated settings?</span>
          <Flex align="center" gap={8}>
            <span>Period:</span>
            <select
              defaultValue="12"
              onChange={(e) => { hours = Number(e.target.value); }}
              style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #d9d9d9" }}
            >
              <option value="6">Last 6 hours</option>
              <option value="12">Last 12 hours</option>
              <option value="24">Last 24 hours</option>
              <option value="48">Last 2 days</option>
              <option value="72">Last 3 days</option>
            </select>
          </Flex>
        </Flex>
      ),
      okText: "Rematch",
      cancelText: "Skip",
      onOk: () => {
        const since = new Date(Date.now() - hours * 3_600_000).toISOString();
        rematchMutation.mutate(since);
      },
    });
  }, [modal, rematchMutation]);

  const handleGenerate = useCallback(() => {
    aboutForm.generateMutation.mutate(undefined, {
      onSuccess: (result) => {
        searchForm.setForm((prev) => ({
          ...prev,
          categories: result.categories,
          locations: result.locations,
          disabledSources: result.disabledSources,
          remoteOnly: result.remoteOnly,
        }));
        matchingForm.setForm((prev) => ({
          ...prev,
          seniorityLevels: result.seniorityLevels,
          keywords: result.keywords,
          excludedKeywords: result.excludedKeywords,
        }));
      },
    });
  }, [aboutForm.generateMutation, searchForm.setForm, matchingForm.setForm]);

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

  const weightsTotal = matchingForm.form.weightKeywords + matchingForm.form.weightSeniority
    + matchingForm.form.weightCategories;
  const weightsInvalid = matchingForm.form.matchWithAi && weightsTotal !== 100;

  if (isLoading) return <Skeleton active paragraph={{ rows: 14 }} />;

  return (
    <Collapse
      activeKey={activeKeys}
      onChange={setActiveKeys}
      items={[
        {
          key: "about",
          label: "About",
          extra: <UserOutlined />,
          children: (
            <AboutCard
              about={aboutForm.about}
              onAboutChange={aboutForm.change}
              onDiscard={aboutForm.discard}
              onSaveText={aboutForm.saveText}
              onUploadFile={aboutForm.uploadFile}
              onGenerate={handleGenerate}
              saving={aboutForm.saving}
              generating={aboutForm.generating}
              aboutDirty={aboutForm.dirty}
              aboutSaved={aboutForm.saved}
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
                saved={searchSaved.saved}
                saving={saveSearchMutation.isPending}
                onSave={() => saveSearchMutation.mutate(searchForm.form, { onSuccess: () => { searchSaved.flash(); suggestRematch(); } })}
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
                saved={matchingSaved.saved}
                saving={saveMatchingMutation.isPending}
                onSave={() => saveMatchingMutation.mutate(matchingForm.form, { onSuccess: () => { matchingSaved.flash(); suggestRematch(); } })}
                onDiscard={matchingForm.reset}
                saveDisabled={weightsInvalid}
                saveDisabledReason={weightsInvalid ? `Matching weights must total 100% (currently ${weightsTotal}%)` : undefined}
              />
            </Flex>
          ),
        },
      ]}
    />
  );
};

const usePersistedKeys = () => {
  const [keys, setKeysRaw] = useState<string[]>(() => collapseStorage.load());

  const setKeys = useCallback((value: string | string[]) => {
    const next = Array.isArray(value) ? value : [value];
    setKeysRaw(next);
    collapseStorage.save(next);
  }, []);

  return [keys, setKeys] as const;
};
