import { useState, useEffect, useCallback } from "react";
import { Button, Card, Collapse, Flex, Input, Skeleton, Switch, Typography, message } from "antd";
import { CopyOutlined, ThunderboltOutlined } from "@ant-design/icons";
import {
  useOutreachSettings,
  useSaveOutreachSettings,
  useTestCoverLetter,
  useTestRecruiterMessage,
} from "../hooks/useOutreach";
import { useDirtyForm } from "../hooks/useDirtyForm";
import { SaveBar } from "../components/SaveBar";
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
  const [saved, setSaved] = useState(false);
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

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 2500);
    return () => clearTimeout(t);
  }, [saved]);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    message.success("Copied to clipboard");
  };

  const handleTestCoverLetter = (sourceId: string) => {
    testCoverLetter.mutate({ source: sourceId }, {
      onSuccess: (data) => setTestResults((prev) => ({ ...prev, [`${sourceId}-cl`]: data })),
    });
  };

  const handleTestRecruiterMessage = (sourceId: string) => {
    testRecruiterMessage.mutate({ source: sourceId }, {
      onSuccess: (data) => setTestResults((prev) => ({ ...prev, [`${sourceId}-rm`]: data })),
    });
  };

  if (isLoading) return <Skeleton active paragraph={{ rows: 6 }} />;

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
              value={form.coverLetterPrompt ?? settings?.defaultCoverLetterPrompt ?? ""}
              onChange={(e) => setForm((prev) => ({ ...prev, coverLetterPrompt: e.target.value || null }))}
            />
          </Flex>
          <Flex vertical gap={4}>
            <Typography.Text strong style={{ fontSize: 13 }}>Recruiter Message Prompt</Typography.Text>
            <Input.TextArea
              rows={3}
              value={form.recruiterMessagePrompt ?? settings?.defaultRecruiterMessagePrompt ?? ""}
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
            const clResult = testResults[`${source.id}-cl`] as CoverLetterResponse | undefined;
            const rmResult = testResults[`${source.id}-rm`] as RecruiterMessageResponse | undefined;

            return {
              key: source.id,
              label: source.displayName,
              children: (
                <Flex vertical gap={12}>
                  <Flex gap={24}>
                    <Flex align="center" gap={8}>
                      <Switch
                        size="small"
                        checked={config.coverLetterEnabled}
                        onChange={(v) => updateSourceConfig(source.id, { coverLetterEnabled: v })}
                      />
                      <Typography.Text style={{ fontSize: 13 }}>Cover Letter</Typography.Text>
                    </Flex>
                    <Flex align="center" gap={8}>
                      <Switch
                        size="small"
                        checked={config.recruiterMessageEnabled}
                        onChange={(v) => updateSourceConfig(source.id, { recruiterMessageEnabled: v })}
                      />
                      <Typography.Text style={{ fontSize: 13 }}>Recruiter Message</Typography.Text>
                    </Flex>
                  </Flex>

                  {config.coverLetterEnabled && (
                    <Flex vertical gap={4}>
                      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        Custom cover letter prompt (leave empty to use default)
                      </Typography.Text>
                      <Input.TextArea
                        rows={2}
                        value={config.coverLetterPrompt ?? settings?.defaultCoverLetterPrompt ?? ""}
                        onChange={(e) =>
                          updateSourceConfig(source.id, { coverLetterPrompt: e.target.value || null })
                        }
                      />
                    </Flex>
                  )}

                  {config.recruiterMessageEnabled && (
                    <Flex vertical gap={4}>
                      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        Custom recruiter message prompt (leave empty to use default)
                      </Typography.Text>
                      <Input.TextArea
                        rows={2}
                        value={config.recruiterMessagePrompt ?? settings?.defaultRecruiterMessagePrompt ?? ""}
                        onChange={(e) =>
                          updateSourceConfig(source.id, { recruiterMessagePrompt: e.target.value || null })
                        }
                      />
                    </Flex>
                  )}

                  <Flex gap={8}>
                    <Button
                      size="small"
                      icon={<ThunderboltOutlined />}
                      loading={testCoverLetter.isPending}
                      disabled={!config.coverLetterEnabled}
                      onClick={() => handleTestCoverLetter(source.id)}
                    >
                      Test Cover Letter
                    </Button>
                    <Button
                      size="small"
                      icon={<ThunderboltOutlined />}
                      loading={testRecruiterMessage.isPending}
                      disabled={!config.recruiterMessageEnabled}
                      onClick={() => handleTestRecruiterMessage(source.id)}
                    >
                      Test Recruiter Message
                    </Button>
                  </Flex>

                  {clResult && (
                    <Card size="small" style={{ background: "transparent" }}>
                      <Flex vertical gap={4}>
                        <Flex justify="space-between" align="center">
                          <Typography.Text strong style={{ fontSize: 12 }}>
                            {clResult.job.title}{clResult.job.company ? ` at ${clResult.job.company}` : ""}
                          </Typography.Text>
                          <Button
                            type="text"
                            size="small"
                            icon={<CopyOutlined />}
                            onClick={() => handleCopy(clResult.coverLetter)}
                          />
                        </Flex>
                        <Typography.Paragraph
                          type="secondary"
                          style={{ fontSize: 13, whiteSpace: "pre-wrap", margin: 0 }}
                        >
                          {clResult.coverLetter}
                        </Typography.Paragraph>
                      </Flex>
                    </Card>
                  )}

                  {rmResult && (
                    <Card size="small" style={{ background: "transparent" }}>
                      <Flex vertical gap={4}>
                        <Flex justify="space-between" align="center">
                          <Typography.Text strong style={{ fontSize: 12 }}>
                            {rmResult.job.title}{rmResult.job.company ? ` at ${rmResult.job.company}` : ""}
                          </Typography.Text>
                          <Button
                            type="text"
                            size="small"
                            icon={<CopyOutlined />}
                            onClick={() => handleCopy(rmResult.recruiterMessage)}
                          />
                        </Flex>
                        <Typography.Paragraph
                          type="secondary"
                          style={{ fontSize: 13, whiteSpace: "pre-wrap", margin: 0 }}
                        >
                          {rmResult.recruiterMessage}
                        </Typography.Paragraph>
                      </Flex>
                    </Card>
                  )}
                </Flex>
              ),
            };
          })}
        />
      </Card>

      <SaveBar
        isDirty={isDirty}
        saved={saved}
        saving={saveMutation.isPending}
        onSave={() => saveMutation.mutate(form, { onSuccess: () => setSaved(true) })}
        onDiscard={reset}
      />
    </Flex>
  );
};
