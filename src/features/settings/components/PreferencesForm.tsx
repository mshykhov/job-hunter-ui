import {
  Card,
  Checkbox,
  Col,
  Flex,
  Row,
  Slider,
  Switch,
  Typography,
} from "antd";
import { JOB_SOURCE } from "@/features/jobs/types";
import type { JobSource } from "@/features/jobs/types";
import type { Preferences } from "../types";
import { TagListInput } from "./TagListInput";

interface PreferencesFormProps {
  form: Preferences;
  onChange: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
}

const SOURCE_OPTIONS = Object.entries(JOB_SOURCE).map(([label, value]) => ({
  label: label,
  value: value as JobSource,
}));

interface TagCardProps {
  title: string;
  description?: string;
  value: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
  color: string;
}

const TagCard = ({ title, description, value, onChange, placeholder, color }: TagCardProps) => (
  <Col xs={24} lg={12}>
    <Card size="small" title={title} style={{ height: "100%" }}>
      {description && (
        <Typography.Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 8 }}>
          {description}
        </Typography.Text>
      )}
      <TagListInput value={value} onChange={onChange} placeholder={placeholder} color={color} />
    </Card>
  </Col>
);

export const PreferencesForm = ({ form, onChange }: PreferencesFormProps) => (
  <Row gutter={[16, 16]}>
    <TagCard
      title="Categories"
      description="Core technologies you want to work with"
      value={form.categories}
      onChange={(v) => onChange("categories", v)}
      placeholder="e.g. kotlin"
      color="blue"
    />
    <TagCard
      title="Keywords"
      description="Skills and frameworks for job matching"
      value={form.keywords}
      onChange={(v) => onChange("keywords", v)}
      placeholder="e.g. spring"
      color="green"
    />
    <TagCard
      title="Seniority Levels"
      value={form.seniorityLevels}
      onChange={(v) => onChange("seniorityLevels", v)}
      placeholder="e.g. senior"
      color="purple"
    />
    <TagCard
      title="Excluded Keywords"
      description="Technologies or domains you want to avoid"
      value={form.excludedKeywords}
      onChange={(v) => onChange("excludedKeywords", v)}
      placeholder="e.g. php"
      color="red"
    />
    <TagCard
      title="Locations"
      description="Preferred job locations"
      value={form.locations}
      onChange={(v) => onChange("locations", v)}
      placeholder="e.g. remote, Ukraine"
      color="cyan"
    />
    <TagCard
      title="Languages"
      description="Required spoken languages"
      value={form.languages}
      onChange={(v) => onChange("languages", v)}
      placeholder="e.g. english"
      color="gold"
    />
    <Col xs={24} lg={12}>
      <Card size="small" title="Disabled Sources" style={{ height: "100%" }}>
        <Typography.Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 8 }}>
          Sources to exclude from job matching
        </Typography.Text>
        <Checkbox.Group
          value={form.disabledSources}
          onChange={(v) => onChange("disabledSources", v as JobSource[])}
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
              onChange={(v) => onChange("minScore", v)}
            />
          </div>
          <Flex align="center" gap={8}>
            <Switch checked={form.remoteOnly} onChange={(v) => onChange("remoteOnly", v)} />
            <Typography.Text>Remote only</Typography.Text>
          </Flex>
          <Flex align="center" gap={8}>
            <Switch checked={form.notificationsEnabled} onChange={(v) => onChange("notificationsEnabled", v)} />
            <Typography.Text>Telegram notifications</Typography.Text>
          </Flex>
        </Flex>
      </Card>
    </Col>
  </Row>
);
