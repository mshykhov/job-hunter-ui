import { Checkbox, Col, Flex, Input, Row, Slider, Switch, Typography } from "antd";
import { JOB_SOURCE } from "@/features/jobs/types";
import type { JobSource } from "@/features/jobs/types";
import { TagListInput } from "./TagListInput";
import type { MatchingPreferences } from "../types";

interface MatchingSectionProps {
  form: MatchingPreferences;
  onChange: <K extends keyof MatchingPreferences>(key: K, value: MatchingPreferences[K]) => void;
}

const SOURCE_OPTIONS = Object.entries(JOB_SOURCE).map(([label, value]) => ({
  label,
  value: value as JobSource,
}));

export const MatchingSection = ({ form, onChange }: MatchingSectionProps) => (
  <Row gutter={[16, 16]}>
    <Col xs={24} lg={12}>
      <Flex vertical gap={4}>
        <Typography.Text strong style={{ fontSize: 13 }}>Keywords</Typography.Text>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          Skills and frameworks for job matching
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
    <Col xs={24} lg={12}>
      <Flex vertical gap={4}>
        <Typography.Text strong style={{ fontSize: 13 }}>Disabled Sources</Typography.Text>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          Sources to exclude from job search
        </Typography.Text>
        <Checkbox.Group
          value={form.disabledSources}
          onChange={(v) => onChange("disabledSources", v as JobSource[])}
          options={SOURCE_OPTIONS}
        />
      </Flex>
    </Col>
    <Col xs={24} lg={12}>
      <Flex vertical gap={12}>
        <Flex vertical gap={4}>
          <Typography.Text strong style={{ fontSize: 13 }}>
            Minimum AI Score: {form.minScore}
          </Typography.Text>
          <Slider
            min={0}
            max={100}
            step={5}
            value={form.minScore}
            onChange={(v) => onChange("minScore", v)}
          />
        </Flex>
        <Flex align="center" gap={8}>
          <Switch checked={form.matchWithAi} onChange={(v) => onChange("matchWithAi", v)} />
          <Typography.Text>Match with AI</Typography.Text>
        </Flex>
      </Flex>
    </Col>
    {form.matchWithAi && (
      <Col xs={24}>
        <Flex vertical gap={4}>
          <Typography.Text strong style={{ fontSize: 13 }}>Custom AI Prompt</Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Additional instructions for AI matching, appended to the default prompt.
          </Typography.Text>
          <Input.TextArea
            rows={3}
            placeholder="Custom instructions for the AI matching engine..."
            value={form.customPrompt ?? ""}
            onChange={(e) => onChange("customPrompt", e.target.value || null)}
            style={{ maxWidth: 600 }}
          />
        </Flex>
      </Col>
    )}
  </Row>
);
