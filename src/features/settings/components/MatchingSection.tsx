import { InfoCircleOutlined, RobotOutlined } from "@ant-design/icons";
import { Card, Col, Flex, Input, Row, Switch, Tag, theme, Tooltip, Typography } from "antd";

import type { MatchingPreferences } from "../types";
import { TagListInput } from "./TagListInput";

interface MatchingSectionProps {
  form: MatchingPreferences;
  onChange: <K extends keyof MatchingPreferences>(key: K, value: MatchingPreferences[K]) => void;
}

const AI_MATCHING_INFO = `AI reads each job description and compares it with your About section to understand how well you fit the role. It evaluates three things:

• Technical fit — do your skills match what the job requires?
• Experience fit — does your seniority and type of work align?
• Category fit — is the job's primary tech stack in your target categories?

Score: 90–100 near-perfect, 75–89 strong, 60–74 good, 40–59 moderate, below 40 weak.

Jobs are pre-filtered before AI: excluded keywords, companies, and categories are applied instantly without using AI tokens.`;

const CUSTOM_PROMPT_PLACEHOLDER = `Example:
Kotlin and Java are equally good for me — treat as interchangeable.
I prefer product companies over outsourcing.
Interested in: fintech, iGaming, cloud platforms, Web3.
I'm open to Lead roles if they're still hands-on.
Skip jobs focused on frontend even if they mention Java.`;

export const MatchingSection = ({ form, onChange }: MatchingSectionProps) => {
  const { token } = theme.useToken();

  return (
    <Flex vertical gap={16}>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Flex vertical gap={4}>
            <Typography.Text strong style={{ fontSize: 13 }}>Excluded Keywords</Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              Technologies or domains to avoid
            </Typography.Text>
            <TagListInput
              value={form.excludedKeywords}
              onChange={(v) => onChange("excludedKeywords", v)}
              placeholder="e.g. php"
              color="red"
            />
          </Flex>
        </Col>
        <Col xs={24} lg={12}>
          <Flex vertical gap={4}>
            <Typography.Text strong style={{ fontSize: 13 }}>Excluded Title Keywords</Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              Words in job titles to skip
            </Typography.Text>
            <TagListInput
              value={form.excludedTitleKeywords}
              onChange={(v) => onChange("excludedTitleKeywords", v)}
              placeholder="e.g. intern"
              color="orange"
            />
          </Flex>
        </Col>
        <Col xs={24} lg={12}>
          <Flex vertical gap={4}>
            <Typography.Text strong style={{ fontSize: 13 }}>Excluded Companies</Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              Companies to exclude from results
            </Typography.Text>
            <TagListInput
              value={form.excludedCompanies}
              onChange={(v) => onChange("excludedCompanies", v)}
              placeholder="e.g. EPAM"
              color="volcano"
            />
          </Flex>
        </Col>
      </Row>

      <Card
        size="small"
        title={
          <Flex align="center" gap={8}>
            <RobotOutlined style={{ color: token.colorPrimary }} />
            <span>AI Matching</span>
            <Tag color={form.matchWithAi ? "processing" : "default"} bordered={false}>
              {form.matchWithAi ? "Enabled" : "Disabled"}
            </Tag>
            <Tooltip
              title={<span style={{ whiteSpace: "pre-line" }}>{AI_MATCHING_INFO}</span>}
              overlayStyle={{ maxWidth: 420 }}
            >
              <InfoCircleOutlined style={{ color: token.colorTextSecondary, cursor: "help" }} />
            </Tooltip>
          </Flex>
        }
        extra={
          <Switch
            size="small"
            checked={form.matchWithAi}
            onChange={(v) => onChange("matchWithAi", v)}
          />
        }
        style={{
          borderColor: form.matchWithAi ? token.colorPrimaryBorder : undefined,
        }}
      >
        {form.matchWithAi ? (
          <Flex vertical gap={4}>
            <Typography.Text strong style={{ fontSize: 13 }}>Custom Instructions</Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              Optional. Tell AI what matters to you beyond your profile and categories.
            </Typography.Text>
            <Input.TextArea
              rows={4}
              showCount
              maxLength={500}
              placeholder={CUSTOM_PROMPT_PLACEHOLDER}
              value={form.customPrompt ?? ""}
              onChange={(e) => onChange("customPrompt", e.target.value || null)}
            />
          </Flex>
        ) : (
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            When disabled, jobs are filtered only by excluded keywords, companies, and categories — no AI scoring.
          </Typography.Text>
        )}
      </Card>
    </Flex>
  );
};
