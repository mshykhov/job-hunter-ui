import { Card, Flex, Input, Typography } from "antd";

import type { SaveOutreachSettings } from "../types";

interface DefaultPromptsCardProps {
  form: SaveOutreachSettings;
  defaultCL: string;
  defaultRM: string;
  onUpdate: (updater: (prev: SaveOutreachSettings) => SaveOutreachSettings) => void;
}

export const DefaultPromptsCard = ({ form, defaultCL, defaultRM, onUpdate }: DefaultPromptsCardProps) => (
  <Card size="small" title="Default Prompts">
    <Flex vertical gap={12}>
      <Typography.Text type="secondary" style={{ fontSize: 13 }}>
        Default prompts used when a source has no custom prompt configured.
      </Typography.Text>
      <Flex vertical gap={4}>
        <Typography.Text strong style={{ fontSize: 13 }}>Cover Letter Prompt</Typography.Text>
        <Input.TextArea
          rows={3}
          showCount
          value={form.coverLetterPrompt ?? defaultCL}
          onChange={(e) => onUpdate((prev) => ({ ...prev, coverLetterPrompt: e.target.value || null }))}
          style={!form.coverLetterPrompt ? { opacity: 0.45 } : undefined}
          onFocus={(e) => {
            if (!form.coverLetterPrompt) onUpdate((prev) => ({ ...prev, coverLetterPrompt: defaultCL }));
            e.target.select();
          }}
        />
      </Flex>
      <Flex vertical gap={4}>
        <Typography.Text strong style={{ fontSize: 13 }}>Recruiter Message Prompt</Typography.Text>
        <Input.TextArea
          rows={3}
          showCount
          value={form.recruiterMessagePrompt ?? defaultRM}
          onChange={(e) => onUpdate((prev) => ({ ...prev, recruiterMessagePrompt: e.target.value || null }))}
          style={!form.recruiterMessagePrompt ? { opacity: 0.45 } : undefined}
          onFocus={(e) => {
            if (!form.recruiterMessagePrompt) onUpdate((prev) => ({ ...prev, recruiterMessagePrompt: defaultRM }));
            e.target.select();
          }}
        />
      </Flex>
    </Flex>
  </Card>
);
