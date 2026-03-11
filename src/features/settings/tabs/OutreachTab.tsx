import { useCallback, useMemo,useState } from "react";

import { Card, Collapse, Flex, Skeleton, Switch, Typography } from "antd";

import { useJobSources } from "@/features/jobs/hooks/useJobSources";

import { DefaultPromptsCard } from "../components/DefaultPromptsCard";
import { SaveBar } from "../components/SaveBar";
import { SourceConfigPanel } from "../components/SourceConfigPanel";
import { useDirtyForm } from "../hooks/useDirtyForm";
import {
  useOutreachSettings,
  useSaveOutreachSettings,
  useTestCoverLetter,
  useTestRecruiterMessage,
} from "../hooks/useOutreach";
import { useSavedFlash } from "../hooks/useSavedFlash";
import type { CoverLetterResponse, OutreachSourceConfig, RecruiterMessageResponse,SaveOutreachSettings } from "../types";
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
  const testCoverLetter = useTestCoverLetter();
  const testRecruiterMessage = useTestRecruiterMessage();
  const { saved, flash } = useSavedFlash();
  const [testResults, setTestResults] = useState<Record<string, CoverLetterResponse | RecruiterMessageResponse>>({});

  const initial = useMemo<SaveOutreachSettings>(() =>
    settings
      ? {
          coverLetterPrompt: settings.coverLetterPrompt,
          recruiterMessagePrompt: settings.recruiterMessagePrompt,
          sourceConfig: settings.sourceConfig,
        }
      : EMPTY_OUTREACH_SETTINGS,
    [settings],
  );

  const { form, setForm, isDirty: rawDirty, reset } = useDirtyForm<SaveOutreachSettings>(initial);

  const isReallyDirty = useMemo(() => {
    if (!rawDirty) return false;
    const normalizedForm = {
      ...form,
      coverLetterPrompt: form.coverLetterPrompt === settings?.defaultCoverLetterPrompt ? null : form.coverLetterPrompt,
      recruiterMessagePrompt: form.recruiterMessagePrompt === settings?.defaultRecruiterMessagePrompt ? null : form.recruiterMessagePrompt,
    };
    return JSON.stringify(normalizedForm) !== JSON.stringify(initial);
  }, [rawDirty, form, initial, settings]);

  const getSourceConfig = useCallback(
    (sourceId: string): OutreachSourceConfig =>
      form.sourceConfig[sourceId] ?? DEFAULT_SOURCE_CONFIG,
    [form.sourceConfig],
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
    [setForm, getSourceConfig],
  );

  if (isLoading) return <Skeleton active paragraph={{ rows: 6 }} />;

  const defaultCL = settings?.defaultCoverLetterPrompt ?? "";
  const defaultRM = settings?.defaultRecruiterMessagePrompt ?? "";

  return (
    <Flex vertical gap={16}>
      <DefaultPromptsCard form={form} defaultCL={defaultCL} defaultRM={defaultRM} onUpdate={setForm} />

      <Card size="small" title="Source Configuration">
        <Collapse
          ghost
          collapsible="icon"
          items={sources.map((source) => {
            const config = getSourceConfig(source.id);

            return {
              key: source.id,
              label: (
                <Flex align="center" gap={12}>
                  <span style={{ minWidth: 100 }}>{source.displayName}</span>
                  <Flex align="center" gap={4}>
                    <Switch
                      size="small"
                      checked={config.coverLetterEnabled}
                      onChange={(v) => updateSourceConfig(source.id, { coverLetterEnabled: v })}
                    />
                    <Typography.Text style={{ fontSize: 12 }} type={config.coverLetterEnabled ? undefined : "secondary"}>
                      Cover Letter
                    </Typography.Text>
                  </Flex>
                  <Flex align="center" gap={4}>
                    <Switch
                      size="small"
                      checked={config.recruiterMessageEnabled}
                      onChange={(v) => updateSourceConfig(source.id, { recruiterMessageEnabled: v })}
                    />
                    <Typography.Text style={{ fontSize: 12 }} type={config.recruiterMessageEnabled ? undefined : "secondary"}>
                      Recruiter Message
                    </Typography.Text>
                  </Flex>
                </Flex>
              ),
              children: (
                <SourceConfigPanel
                  sourceId={source.id}
                  config={config}
                  defaultCoverLetterPrompt={defaultCL}
                  defaultRecruiterMessagePrompt={defaultRM}
                  onUpdate={(patch) => updateSourceConfig(source.id, patch)}
                  onTestCoverLetter={() =>
                    testCoverLetter.mutate({ source: source.id }, {
                      onSuccess: (data) => setTestResults((prev) => ({ ...prev, [`${source.id}-cl`]: data })),
                    })
                  }
                  onTestRecruiterMessage={() =>
                    testRecruiterMessage.mutate({ source: source.id }, {
                      onSuccess: (data) => setTestResults((prev) => ({ ...prev, [`${source.id}-rm`]: data })),
                    })
                  }
                  testingCoverLetter={testCoverLetter.isPending}
                  testingRecruiterMessage={testRecruiterMessage.isPending}
                  clResult={testResults[`${source.id}-cl`] as CoverLetterResponse | undefined}
                  rmResult={testResults[`${source.id}-rm`] as RecruiterMessageResponse | undefined}
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
            recruiterMessagePrompt: form.recruiterMessagePrompt === defaultRM ? null : form.recruiterMessagePrompt,
          };
          saveMutation.mutate(payload, { onSuccess: flash });
        }}
        onDiscard={reset}
      />
    </Flex>
  );
};
