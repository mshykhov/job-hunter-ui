import { useState, useCallback } from "react";
import { Card, Collapse, Flex, Input, Skeleton, Tag, Typography } from "antd";
import {
  useOutreachSettings,
  useSaveOutreachSettings,
  useTestCoverLetter,
  useTestRecruiterMessage,
} from "../hooks/useOutreach";
import { useDirtyForm } from "../hooks/useDirtyForm";
import { useSavedFlash } from "../hooks/useSavedFlash";
import { SaveBar } from "../components/SaveBar";
import { SourceConfigPanel } from "../components/SourceConfigPanel";
import { useJobSources } from "@/features/jobs/hooks/useJobSources";
import type { SaveOutreachSettings, OutreachSourceConfig, CoverLetterResponse, RecruiterMessageResponse } from "../types";
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

  const initial: SaveOutreachSettings = settings
    ? {
        coverLetterPrompt: settings.coverLetterPrompt,
        recruiterMessagePrompt: settings.recruiterMessagePrompt,
        sourceConfig: settings.sourceConfig,
      }
    : EMPTY_OUTREACH_SETTINGS;

  const { form, setForm, isDirty, reset } = useDirtyForm<SaveOutreachSettings>(initial);

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
      <Card size="small" title="Default Prompts">
        <Flex vertical gap={12}>
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            Default prompts used when a source has no custom prompt configured.
          </Typography.Text>
          <Flex vertical gap={4}>
            <Typography.Text strong style={{ fontSize: 13 }}>Cover Letter Prompt</Typography.Text>
            <Input.TextArea
              rows={3}
              placeholder={defaultCL}
              value={form.coverLetterPrompt ?? ""}
              onChange={(e) => setForm((prev) => ({ ...prev, coverLetterPrompt: e.target.value || null }))}
            />
          </Flex>
          <Flex vertical gap={4}>
            <Typography.Text strong style={{ fontSize: 13 }}>Recruiter Message Prompt</Typography.Text>
            <Input.TextArea
              rows={3}
              placeholder={defaultRM}
              value={form.recruiterMessagePrompt ?? ""}
              onChange={(e) => setForm((prev) => ({ ...prev, recruiterMessagePrompt: e.target.value || null }))}
            />
          </Flex>
        </Flex>
      </Card>

      <Card size="small" title="Source Configuration">
        <Collapse
          ghost
          items={sources.map((source) => {
            const config = getSourceConfig(source.id);
            const tags = [
              config.coverLetterEnabled && "CL",
              config.recruiterMessageEnabled && "RM",
            ].filter(Boolean);

            return {
              key: source.id,
              label: (
                <Flex align="center" gap={8}>
                  <span>{source.displayName}</span>
                  {tags.map((tag) => (
                    <Tag key={tag as string} color="blue" style={{ margin: 0, fontSize: 11 }}>
                      {tag}
                    </Tag>
                  ))}
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
        isDirty={isDirty}
        saved={saved}
        saving={saveMutation.isPending}
        onSave={() => saveMutation.mutate(form, { onSuccess: flash })}
        onDiscard={reset}
      />
    </Flex>
  );
};
