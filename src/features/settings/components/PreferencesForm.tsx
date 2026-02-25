import { useState, useEffect } from "react";
import { Button, Card, Checkbox, Col, Flex, Input, Row, Switch, Typography } from "antd";
import { RobotOutlined, SaveOutlined } from "@ant-design/icons";
import { JOB_SOURCE } from "@/features/jobs/types";
import type { JobSource } from "@/features/jobs/types";
import type { Preferences } from "../types";
import { TagListInput } from "./TagListInput";

interface PreferencesFormProps {
  initial: Preferences;
  onSave: (preferences: Preferences) => void;
  onNormalize: (rawInput: string) => void;
  saving: boolean;
  normalizing: boolean;
  normalizedResult: Preferences | null;
}

const SOURCE_OPTIONS = Object.entries(JOB_SOURCE).map(([label, value]) => ({
  label: label,
  value: value as JobSource,
}));

export const PreferencesForm = ({
  initial,
  onSave,
  onNormalize,
  saving,
  normalizing,
  normalizedResult,
}: PreferencesFormProps) => {
  const [form, setForm] = useState<Preferences>(initial);

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  useEffect(() => {
    if (!normalizedResult) return;
    setForm((prev) => ({
      ...prev,
      categories: normalizedResult.categories,
      seniorityLevels: normalizedResult.seniorityLevels,
      keywords: normalizedResult.keywords,
      excludedKeywords: normalizedResult.excludedKeywords,
      remoteOnly: normalizedResult.remoteOnly,
    }));
  }, [normalizedResult]);

  const update = <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleNormalize = () => {
    if (!form.rawInput?.trim()) return;
    onNormalize(form.rawInput);
  };

  return (
    <Flex vertical gap={16}>
      <Card size="small" title="AI Normalization">
        <Flex vertical gap={12}>
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            Describe what you're looking for in free text. AI will extract structured preferences.
          </Typography.Text>
          <Input.TextArea
            rows={3}
            placeholder="e.g. Senior Kotlin developer, remote, Spring Boot, no frontend work..."
            value={form.rawInput ?? ""}
            onChange={(e) => update("rawInput", e.target.value || null)}
          />
          <div>
            <Button
              icon={<RobotOutlined />}
              loading={normalizing}
              onClick={handleNormalize}
              disabled={!form.rawInput?.trim()}
            >
              Normalize with AI
            </Button>
          </div>
        </Flex>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card size="small" title="Categories" style={{ height: "100%" }}>
            <Typography.Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 8 }}>
              Core technologies you want to work with
            </Typography.Text>
            <TagListInput
              value={form.categories}
              onChange={(v) => update("categories", v)}
              placeholder="e.g. kotlin"
              color="blue"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card size="small" title="Keywords" style={{ height: "100%" }}>
            <Typography.Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 8 }}>
              Skills and frameworks for job matching
            </Typography.Text>
            <TagListInput
              value={form.keywords}
              onChange={(v) => update("keywords", v)}
              placeholder="e.g. spring"
              color="green"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card size="small" title="Seniority Levels" style={{ height: "100%" }}>
            <TagListInput
              value={form.seniorityLevels}
              onChange={(v) => update("seniorityLevels", v)}
              placeholder="e.g. senior"
              color="purple"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card size="small" title="Excluded Keywords" style={{ height: "100%" }}>
            <Typography.Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 8 }}>
              Technologies or domains you want to avoid
            </Typography.Text>
            <TagListInput
              value={form.excludedKeywords}
              onChange={(v) => update("excludedKeywords", v)}
              placeholder="e.g. php"
              color="red"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card size="small" title="Sources" style={{ height: "100%" }}>
            <Checkbox.Group
              value={form.enabledSources}
              onChange={(v) => update("enabledSources", v as JobSource[])}
              options={SOURCE_OPTIONS}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card size="small" title="Other" style={{ height: "100%" }}>
            <Flex vertical gap={12}>
              <Flex align="center" gap={8}>
                <Switch
                  checked={form.remoteOnly}
                  onChange={(v) => update("remoteOnly", v)}
                />
                <Typography.Text>Remote only</Typography.Text>
              </Flex>
              <Flex align="center" gap={8}>
                <Switch
                  checked={form.notificationsEnabled}
                  onChange={(v) => update("notificationsEnabled", v)}
                />
                <Typography.Text>Telegram notifications</Typography.Text>
              </Flex>
            </Flex>
          </Card>
        </Col>
      </Row>

      <Button
        type="primary"
        icon={<SaveOutlined />}
        size="large"
        loading={saving}
        onClick={() => onSave(form)}
      >
        Save Preferences
      </Button>
    </Flex>
  );
};
