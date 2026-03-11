import { CopyOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Input, message,Typography } from "antd";

import type { CoverLetterResponse, OutreachSourceConfig, RecruiterMessageResponse } from "../types";

interface SourceConfigPanelProps {
  sourceId: string;
  config: OutreachSourceConfig;
  defaultCoverLetterPrompt: string;
  defaultRecruiterMessagePrompt: string;
  onUpdate: (patch: Partial<OutreachSourceConfig>) => void;
  onTestCoverLetter: () => void;
  onTestRecruiterMessage: () => void;
  testingCoverLetter: boolean;
  testingRecruiterMessage: boolean;
  clResult?: CoverLetterResponse;
  rmResult?: RecruiterMessageResponse;
}

export const SourceConfigPanel = ({
  config,
  defaultCoverLetterPrompt,
  defaultRecruiterMessagePrompt,
  onUpdate,
  onTestCoverLetter,
  onTestRecruiterMessage,
  testingCoverLetter,
  testingRecruiterMessage,
  clResult,
  rmResult,
}: SourceConfigPanelProps) => {
  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    message.success("Copied to clipboard");
  };

  return (
    <Flex vertical gap={12}>
      {config.coverLetterEnabled && (
        <Flex vertical gap={4}>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Custom cover letter prompt (leave empty to use default)
          </Typography.Text>
          <Input.TextArea
            rows={2}
            placeholder={defaultCoverLetterPrompt}
            value={config.coverLetterPrompt ?? ""}
            onChange={(e) => onUpdate({ coverLetterPrompt: e.target.value || null })}
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
            placeholder={defaultRecruiterMessagePrompt}
            value={config.recruiterMessagePrompt ?? ""}
            onChange={(e) => onUpdate({ recruiterMessagePrompt: e.target.value || null })}
          />
        </Flex>
      )}

      <Flex gap={8}>
        <Button
          size="small"
          icon={<ThunderboltOutlined />}
          loading={testingCoverLetter}
          disabled={!config.coverLetterEnabled}
          onClick={onTestCoverLetter}
        >
          Test Cover Letter
        </Button>
        <Button
          size="small"
          icon={<ThunderboltOutlined />}
          loading={testingRecruiterMessage}
          disabled={!config.recruiterMessageEnabled}
          onClick={onTestRecruiterMessage}
        >
          Test Recruiter Message
        </Button>
      </Flex>

      {clResult && (
        <TestResultCard
          title={`${clResult.job.title}${clResult.job.company ? ` at ${clResult.job.company}` : ""}`}
          content={clResult.coverLetter}
          onCopy={() => handleCopy(clResult.coverLetter)}
        />
      )}

      {rmResult && (
        <TestResultCard
          title={`${rmResult.job.title}${rmResult.job.company ? ` at ${rmResult.job.company}` : ""}`}
          content={rmResult.recruiterMessage}
          onCopy={() => handleCopy(rmResult.recruiterMessage)}
        />
      )}
    </Flex>
  );
};

interface TestResultCardProps {
  title: string;
  content: string;
  onCopy: () => void;
}

const TestResultCard = ({ title, content, onCopy }: TestResultCardProps) => (
  <Card size="small" style={{ background: "transparent" }}>
    <Flex vertical gap={4}>
      <Flex justify="space-between" align="center">
        <Typography.Text strong style={{ fontSize: 12 }}>{title}</Typography.Text>
        <Button type="text" size="small" icon={<CopyOutlined />} onClick={onCopy} />
      </Flex>
      <Typography.Paragraph
        type="secondary"
        style={{ fontSize: 13, whiteSpace: "pre-wrap", margin: 0 }}
      >
        {content}
      </Typography.Paragraph>
    </Flex>
  </Card>
);
