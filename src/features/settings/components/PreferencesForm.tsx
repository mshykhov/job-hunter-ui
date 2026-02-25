import { useState, useEffect, useMemo } from "react";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Flex,
  Input,
  Row,
  Slider,
  Switch,
  Typography,
} from "antd";
import {
  CheckOutlined,
  RobotOutlined,
  SaveOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { JOB_SOURCE } from "@/features/jobs/types";
import type { JobSource } from "@/features/jobs/types";
import type { Preferences } from "../types";
import { TagListInput } from "./TagListInput";

interface PreferencesFormProps {
  initial: Preferences;
  onSave: (preferences: Preferences) => void;
  onNormalize: (rawInput: string) => void;
  saving: boolean;
  saved: boolean;
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
  saved,
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

  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(initial),
    [form, initial],
  );

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
          <Card size="small" title="Disabled Sources" style={{ height: "100%" }}>
            <Typography.Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 8 }}>
              Sources to exclude from job matching
            </Typography.Text>
            <Checkbox.Group
              value={form.disabledSources}
              onChange={(v) => update("disabledSources", v as JobSource[])}
              options={SOURCE_OPTIONS}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card size="small" title="Matching" style={{ height: "100%" }}>
            <Flex vertical gap={12}>
              <div>
                <Typography.Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 4 }}>
                  Minimum AI score: {form.minScore}
                </Typography.Text>
                <Slider
                  min={0}
                  max={100}
                  step={5}
                  value={form.minScore}
                  onChange={(v) => update("minScore", v)}
                />
              </div>
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

      <div className="settings-save-bar" data-visible={isDirty || saved}>
        {saved && !isDirty ? (
          <Flex align="center" justify="center" gap={8}>
            <CheckOutlined style={{ color: "#52c41a" }} />
            <Typography.Text style={{ color: "#52c41a" }}>Preferences saved</Typography.Text>
          </Flex>
        ) : (
          <Flex align="center" justify="space-between">
            <Typography.Text type="secondary">You have unsaved changes</Typography.Text>
            <Flex gap={8}>
              <Button
                icon={<UndoOutlined />}
                onClick={() => setForm(initial)}
              >
                Discard
              </Button>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                loading={saving}
                onClick={() => onSave(form)}
              >
                Save
              </Button>
            </Flex>
          </Flex>
        )}
      </div>
    </Flex>
  );
};
