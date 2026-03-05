import { Button, Collapse, Divider, Flex, Typography, message } from "antd";
import { CopyOutlined, ThunderboltOutlined } from "@ant-design/icons";
import type { Job, JobDetail } from "../types";
import { useOutreachSettings } from "@/features/settings/hooks/useOutreach";
import { useGenerateCoverLetter, useGenerateRecruiterMessage } from "../hooks/useOutreachGenerate";

interface OutreachSectionProps {
  job: Job;
  detail: JobDetail;
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

export const OutreachSection = ({ job, detail }: OutreachSectionProps) => {
  const { data: settings } = useOutreachSettings();
  const generateCoverLetter = useGenerateCoverLetter(job.jobId);
  const generateRecruiterMessage = useGenerateRecruiterMessage(job.jobId);

  const sourceConfig = settings?.sourceConfig[job.source];
  const coverLetterEnabled = sourceConfig?.coverLetterEnabled ?? false;
  const recruiterMessageEnabled = sourceConfig?.recruiterMessageEnabled ?? false;

  if (!coverLetterEnabled && !recruiterMessageEnabled) return null;

  const items = [];

  if (coverLetterEnabled) {
    items.push({
      key: "cover-letter",
      label: (
        <Flex justify="space-between" align="center" style={{ width: "100%" }}>
          <Typography.Text strong style={{ fontSize: 13 }}>Cover Letter</Typography.Text>
          <Flex gap={4} onClick={(e) => e.stopPropagation()}>
            {detail.coverLetter && <CopyButton text={detail.coverLetter} />}
            <Button
              type="text"
              size="small"
              icon={<ThunderboltOutlined />}
              loading={generateCoverLetter.isPending}
              onClick={() => generateCoverLetter.mutate()}
            >
              {detail.coverLetter ? "Regenerate" : "Generate"}
            </Button>
          </Flex>
        </Flex>
      ),
      children: (
        <Typography.Paragraph
          type={detail.coverLetter ? undefined : "secondary"}
          style={{ fontSize: 13, whiteSpace: "pre-wrap", margin: 0 }}
        >
          {detail.coverLetter ?? "Click Generate to create a cover letter"}
        </Typography.Paragraph>
      ),
    });
  }

  if (recruiterMessageEnabled) {
    items.push({
      key: "recruiter-message",
      label: (
        <Flex justify="space-between" align="center" style={{ width: "100%" }}>
          <Typography.Text strong style={{ fontSize: 13 }}>Recruiter Message</Typography.Text>
          <Flex gap={4} onClick={(e) => e.stopPropagation()}>
            {detail.recruiterMessage && <CopyButton text={detail.recruiterMessage} />}
            <Button
              type="text"
              size="small"
              icon={<ThunderboltOutlined />}
              loading={generateRecruiterMessage.isPending}
              onClick={() => generateRecruiterMessage.mutate()}
            >
              {detail.recruiterMessage ? "Regenerate" : "Generate"}
            </Button>
          </Flex>
        </Flex>
      ),
      children: (
        <Typography.Paragraph
          type={detail.recruiterMessage ? undefined : "secondary"}
          style={{ fontSize: 13, whiteSpace: "pre-wrap", margin: 0 }}
        >
          {detail.recruiterMessage ?? "Click Generate to create a recruiter message"}
        </Typography.Paragraph>
      ),
    });
  }

  return (
    <>
      <Divider style={{ margin: "12px 0" }} />
      <Collapse ghost items={items} />
    </>
  );
};
