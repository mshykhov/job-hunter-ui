import { Card, Col, Flex, Input, Row, Slider, Switch, Tag, Typography, theme } from "antd";
import { RobotOutlined } from "@ant-design/icons";
import { TagListInput } from "./TagListInput";
import type { MatchingPreferences } from "../types";

interface MatchingSectionProps {
  form: MatchingPreferences;
  onChange: <K extends keyof MatchingPreferences>(key: K, value: MatchingPreferences[K]) => void;
}

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
        <Flex vertical gap={16} style={{ opacity: form.matchWithAi ? 1 : 0.5 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Flex vertical gap={4}>
                <Typography.Text strong style={{ fontSize: 13 }}>Seniority Levels</Typography.Text>
                <TagListInput
                  value={form.seniorityLevels}
                  onChange={(v) => onChange("seniorityLevels", v)}
                  placeholder="e.g. senior"
                  color="purple"
                />
              </Flex>
            </Col>
            <Col xs={24} lg={12}>
              <Flex vertical gap={4}>
                <Typography.Text strong style={{ fontSize: 13 }}>Keywords</Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  Skills and frameworks for AI job matching
                </Typography.Text>
                <TagListInput
                  value={form.keywords}
                  onChange={(v) => onChange("keywords", v)}
                  placeholder="e.g. spring"
                  color="green"
                />
              </Flex>
            </Col>
            <Col xs={24} lg={12}>
              <Flex vertical gap={4}>
                <Typography.Text strong style={{ fontSize: 13 }}>
                  Minimum Score: {form.minScore}
                </Typography.Text>
                <Slider
                  min={0}
                  max={100}
                  step={5}
                  value={form.minScore}
                  onChange={(v) => onChange("minScore", v)}
                  disabled={!form.matchWithAi}
                />
              </Flex>
            </Col>
          </Row>
          {form.matchWithAi && (
            <Flex vertical gap={4}>
              <Typography.Text strong style={{ fontSize: 13 }}>Custom Prompt</Typography.Text>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                Additional instructions for AI matching, appended to the default prompt.
              </Typography.Text>
              <Input.TextArea
                rows={3}
                placeholder="Custom instructions for the AI matching engine..."
                value={form.customPrompt ?? ""}
                onChange={(e) => onChange("customPrompt", e.target.value || null)}
              />
            </Flex>
          )}
        </Flex>
      </Card>
    </Flex>
  );
};
