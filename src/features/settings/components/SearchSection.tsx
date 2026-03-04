import { Col, Flex, Row, Switch, Typography } from "antd";
import { TagListInput } from "./TagListInput";
import type { SearchPreferences } from "../types";

interface SearchSectionProps {
  form: SearchPreferences;
  onChange: <K extends keyof SearchPreferences>(key: K, value: SearchPreferences[K]) => void;
}

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
        <Typography.Text strong style={{ fontSize: 13 }}>Remote</Typography.Text>
        <Flex align="center" gap={8} style={{ marginTop: 4 }}>
          <Switch checked={form.remoteOnly} onChange={(v) => onChange("remoteOnly", v)} />
          <Typography.Text>Show remote positions only</Typography.Text>
        </Flex>
      </Flex>
    </Col>
  </Row>
);
