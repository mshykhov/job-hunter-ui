import { Checkbox, Col, Flex, Row, Switch, Typography } from "antd";
import { JOB_SOURCE } from "@/features/jobs/types";
import type { JobSource } from "@/features/jobs/types";
import { TagListInput } from "./TagListInput";
import type { SearchPreferences } from "../types";

interface SearchSectionProps {
  form: SearchPreferences;
  onChange: <K extends keyof SearchPreferences>(key: K, value: SearchPreferences[K]) => void;
}

const SOURCE_OPTIONS = Object.entries(JOB_SOURCE).map(([label, value]) => ({
  label,
  value: value as JobSource,
}));

export const SearchSection = ({ form, onChange }: SearchSectionProps) => (
  <Row gutter={[16, 16]}>
    <Col xs={24} lg={12}>
      <Flex vertical gap={4}>
        <Typography.Text strong style={{ fontSize: 13 }}>Categories</Typography.Text>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          Core technologies you want to work with
        </Typography.Text>
        <TagListInput
          value={form.categories}
          onChange={(v) => onChange("categories", v)}
          placeholder="e.g. kotlin"
          color="blue"
        />
      </Flex>
    </Col>
    <Col xs={24} lg={12}>
      <Flex vertical gap={4}>
        <Typography.Text strong style={{ fontSize: 13 }}>Locations</Typography.Text>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          Preferred job locations
        </Typography.Text>
        <TagListInput
          value={form.locations}
          onChange={(v) => onChange("locations", v)}
          placeholder="e.g. Ukraine"
          color="cyan"
        />
      </Flex>
    </Col>
    <Col xs={24} lg={12}>
      <Flex vertical gap={4}>
        <Typography.Text strong style={{ fontSize: 13 }}>Sources</Typography.Text>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          Disable sources to exclude from job search
        </Typography.Text>
        <Checkbox.Group
          value={form.disabledSources}
          onChange={(v) => onChange("disabledSources", v as JobSource[])}
          options={SOURCE_OPTIONS}
        />
      </Flex>
    </Col>
    <Col xs={24} lg={12}>
      <Flex vertical gap={4}>
        <Typography.Text strong style={{ fontSize: 13 }}>Remote</Typography.Text>
        <Flex align="center" gap={8} style={{ marginTop: 4 }}>
          <Switch checked={form.remoteOnly} onChange={(v) => onChange("remoteOnly", v)} />
          <Typography.Text>Show remote positions only</Typography.Text>
        </Flex>
      </Flex>
    </Col>
  </Row>
);
