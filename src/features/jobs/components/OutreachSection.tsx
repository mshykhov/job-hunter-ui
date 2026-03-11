import { CopyOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { Button, Collapse, Flex, message,Typography } from "antd";

import { useOutreachSettings } from "@/features/settings/hooks/useOutreach";

import { useGenerateCoverLetter, useGenerateRecruiterMessage } from "../hooks/useOutreachGenerate";
import type { GroupJob } from "../types";

interface OutreachSectionProps {
  job: GroupJob;
  groupId: string;
}

const CopyButton = ({ text }: { text: string }) => {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    message.success("Copied to clipboard");
  };

  return (
    <Button type="text" size="small" icon={<CopyOutlined />} onClick={handleCopy} />
  );
};

export const OutreachSection = ({ job, groupId }: OutreachSectionProps) => {
  const { data: settings } = useOutreachSettings();
  const generateCoverLetter = useGenerateCoverLetter(job.jobId, groupId);
  const generateRecruiterMessage = useGenerateRecruiterMessage(job.jobId, groupId);

  const sourceConfig = settings?.sourceConfig[job.source];
  const coverLetterEnabled = sourceConfig?.coverLetterEnabled ?? false;
  const recruiterMessageEnabled = sourceConfig?.recruiterMessageEnabled ?? false;

  if (!coverLetterEnabled && !recruiterMessageEnabled) return null;

  const items = [];

  if (coverLetterEnabled) {
    items.push({
      key: "cover-letter",
      label: (
        <Flex gap={12} align="center">
          <Typography.Text strong style={{ fontSize: 13 }}>Cover Letter</Typography.Text>
          <Flex gap={4} onClick={(e) => e.stopPropagation()}>
            {job.coverLetter && <CopyButton text={job.coverLetter} />}
            <Button
              type="text"
              size="small"
              icon={<ThunderboltOutlined />}
              loading={generateCoverLetter.isPending}
              onClick={() => generateCoverLetter.mutate()}
            >
              {job.coverLetter ? "Regenerate" : "Generate"}
            </Button>
          </Flex>
        </Flex>
      ),
      children: (
        <Typography.Paragraph
          type={job.coverLetter ? undefined : "secondary"}
          style={{ fontSize: 13, whiteSpace: "pre-wrap", margin: 0 }}
        >
          {job.coverLetter ?? "Click Generate to create a cover letter"}
        </Typography.Paragraph>
      ),
    });
  }

  if (recruiterMessageEnabled) {
    items.push({
      key: "recruiter-message",
      label: (
        <Flex gap={12} align="center">
          <Typography.Text strong style={{ fontSize: 13 }}>Recruiter Message</Typography.Text>
          <Flex gap={4} onClick={(e) => e.stopPropagation()}>
            {job.recruiterMessage && <CopyButton text={job.recruiterMessage} />}
            <Button
              type="text"
              size="small"
              icon={<ThunderboltOutlined />}
              loading={generateRecruiterMessage.isPending}
              onClick={() => generateRecruiterMessage.mutate()}
            >
              {job.recruiterMessage ? "Regenerate" : "Generate"}
            </Button>
          </Flex>
        </Flex>
      ),
      children: (
        <Typography.Paragraph
          type={job.recruiterMessage ? undefined : "secondary"}
          style={{ fontSize: 13, whiteSpace: "pre-wrap", margin: 0 }}
        >
          {job.recruiterMessage ?? "Click Generate to create a recruiter message"}
        </Typography.Paragraph>
      ),
    });
  }

  return <Collapse ghost items={items} />;
};
