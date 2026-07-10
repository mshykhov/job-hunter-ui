import { useCallback, useMemo } from "react";

import { Card, Collapse, Flex, Skeleton } from "antd";

import { useJobSources } from "@/features/jobs/hooks/useJobSources";

import { DefaultPromptsCard } from "../components/DefaultPromptsCard";
import { SaveBar } from "../components/SaveBar";
import { SourceConfigHeader } from "../components/SourceConfigHeader";
import { SourceConfigPanel } from "../components/SourceConfigPanel";
import { useDirtyForm } from "../hooks/useDirtyForm";
import { useOutreachSettings, useSaveOutreachSettings } from "../hooks/useOutreach";
import { useOutreachTests } from "../hooks/useOutreachTests";
import { useSavedFlash } from "../hooks/useSavedFlash";
import type { OutreachSourceConfig, SaveOutreachSettings } from "../types";
import { EMPTY_OUTREACH_SETTINGS } from "../types";

const DEFAULT_SOURCE_CONFIG: OutreachSourceConfig = {
  coverLetterEnabled: false,
  recruiterMessageEnabled: false,
  coverLetterPrompt: null,
  recruiterMessagePrompt: null,
};

export const OutreachTab = () => {
  const { data: settings, isLoading } = useOutreachSettings();
  const { data: sources = [] } = useJobSources();
  const saveMutation = useSaveOutreachSettings();
  const tests = useOutreachTests();
  const { saved, flash } = useSavedFlash();

  const initial = useMemo<SaveOutreachSettings>(
    () =>
      settings
        ? {
            coverLetterPrompt: settings.coverLetterPrompt,
            recruiterMessagePrompt: settings.recruiterMessagePrompt,
            sourceConfig: settings.sourceConfig,
          }
        : EMPTY_OUTREACH_SETTINGS,
    [settings]
  );

  const { form, setForm, isDirty: rawDirty, reset } = useDirtyForm<SaveOutreachSettings>(initial);

  const isReallyDirty = useMemo(() => {
    if (!rawDirty) return false;
    const normalizedForm = {
      ...form,
      coverLetterPrompt:
        form.coverLetterPrompt === settings?.defaultCoverLetterPrompt
          ? null
          : form.coverLetterPrompt,
      recruiterMessagePrompt:
        form.recruiterMessagePrompt === settings?.defaultRecruiterMessagePrompt
          ? null
          : form.recruiterMessagePrompt,
    };
    return JSON.stringify(normalizedForm) !== JSON.stringify(initial);
  }, [rawDirty, form, initial, settings]);

  const getSourceConfig = useCallback(
    (sourceId: string): OutreachSourceConfig =>
      form.sourceConfig[sourceId] ?? DEFAULT_SOURCE_CONFIG,
    [form.sourceConfig]
  );

  const updateSourceConfig = useCallback(
    (sourceId: string, patch: Partial<OutreachSourceConfig>) => {
      setForm((prev) => ({
        ...prev,
        sourceConfig: {
          ...prev.sourceConfig,
          [sourceId]: { ...getSourceConfig(sourceId), ...patch },
        },
      }));
    },
    [setForm, getSourceConfig]
  );

  if (isLoading) return <Skeleton active paragraph={{ rows: 6 }} />;

  const defaultCL = settings?.defaultCoverLetterPrompt ?? "";
  const defaultRM = settings?.defaultRecruiterMessagePrompt ?? "";

  return (
    <Flex vertical gap={16}>
      <DefaultPromptsCard
        form={form}
        defaultCL={defaultCL}
        defaultRM={defaultRM}
        onUpdate={setForm}
      />

      <Card size="small" title="Source Configuration">
        <Collapse
          ghost
          collapsible="icon"
          items={sources.map((source) => {
            const config = getSourceConfig(source.id);

            return {
              key: source.id,
              label: (
                <SourceConfigHeader
                  displayName={source.displayName}
                  config={config}
                  onToggle={(patch) => updateSourceConfig(source.id, patch)}
                />
              ),
              children: (
                <SourceConfigPanel
                  sourceId={source.id}
                  config={config}
                  defaultCoverLetterPrompt={defaultCL}
                  defaultRecruiterMessagePrompt={defaultRM}
                  onUpdate={(patch) => updateSourceConfig(source.id, patch)}
                  onTestCoverLetter={() => tests.runCoverLetter(source.id)}
                  onTestRecruiterMessage={() => tests.runRecruiterMessage(source.id)}
                  testingCoverLetter={tests.testingCoverLetter}
                  testingRecruiterMessage={tests.testingRecruiterMessage}
                  clResult={tests.coverLetterResult(source.id)}
                  rmResult={tests.recruiterMessageResult(source.id)}
                />
              ),
            };
          })}
        />
      </Card>

      <SaveBar
        isDirty={isReallyDirty}
        saved={saved}
        saving={saveMutation.isPending}
        onSave={() => {
          const payload = {
            ...form,
            coverLetterPrompt: form.coverLetterPrompt === defaultCL ? null : form.coverLetterPrompt,
            recruiterMessagePrompt:
              form.recruiterMessagePrompt === defaultRM ? null : form.recruiterMessagePrompt,
          };
          saveMutation.mutate(payload, { onSuccess: flash });
        }}
        onDiscard={reset}
      />
    </Flex>
  );
};
