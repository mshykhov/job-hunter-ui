import { Flex, Switch, Typography } from "antd";

import type { OutreachSourceConfig } from "../types";

interface SourceConfigHeaderProps {
  displayName: string;
  config: OutreachSourceConfig;
  onToggle: (patch: Partial<OutreachSourceConfig>) => void;
}

export const SourceConfigHeader = ({ displayName, config, onToggle }: SourceConfigHeaderProps) => (
  <Flex align="center" gap={12}>
    <span style={{ minWidth: 100 }}>{displayName}</span>
    <Flex align="center" gap={4}>
      <Switch
        size="small"
        checked={config.coverLetterEnabled}
        onChange={(v) => onToggle({ coverLetterEnabled: v })}
      />
      <Typography.Text
        style={{ fontSize: 12 }}
        type={config.coverLetterEnabled ? undefined : "secondary"}
      >
        Cover Letter
      </Typography.Text>
    </Flex>
    <Flex align="center" gap={4}>
      <Switch
        size="small"
        checked={config.recruiterMessageEnabled}
        onChange={(v) => onToggle({ recruiterMessageEnabled: v })}
      />
      <Typography.Text
        style={{ fontSize: 12 }}
        type={config.recruiterMessageEnabled ? undefined : "secondary"}
      >
        Recruiter Message
      </Typography.Text>
    </Flex>
  </Flex>
);
