import { Checkbox, Col, Flex, Row, Switch, Typography } from "antd";

import { useJobSources } from "@/features/jobs/hooks/useJobSources";
import type { JobSource } from "@/features/jobs/types";

import type { SearchPreferences } from "../types";
import { TagListInput } from "./TagListInput";

interface SearchSectionProps {
  form: SearchPreferences;
  onChange: <K extends keyof SearchPreferences>(key: K, value: SearchPreferences[K]) => void;
}

export const SearchSection = ({ form, onChange }: SearchSectionProps) => {
  const { data: sources = [] } = useJobSources();

  const sourceOptions = sources.map((s) => ({
    label: s.displayName,
    value: s.id,
  }));

  return (
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
          Used for LinkedIn job search queries, not for filtering other sources
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
          options={sourceOptions}
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
};
