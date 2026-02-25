import { Button, Checkbox, Divider, Flex, Popover, Radio, Select, Typography } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import type {
  TableSettings as TableSettingsType,
  ColumnKey,
  TableDensity,
} from "../hooks/useTableSettings";
import { COLUMN_KEYS, COLUMN_LABELS, REFRESH_OPTIONS } from "../hooks/useTableSettings";

interface TableSettingsProps {
  settings: TableSettingsType;
  onToggleColumn: (key: ColumnKey) => void;
  onRefreshChange: (interval: number) => void;
  onDensityChange: (density: TableDensity) => void;
}

const ALWAYS_VISIBLE: ColumnKey[] = ["title"];

const refreshOptions = REFRESH_OPTIONS.map((o) => ({ label: o.label, value: o.value }));

export const TableSettings = ({
  settings,
  onToggleColumn,
  onRefreshChange,
  onDensityChange,
}: TableSettingsProps) => {
  const content = (
    <Flex vertical gap={12} style={{ width: 200 }}>
      <div>
        <Typography.Text strong style={{ fontSize: 12 }}>
          Columns
        </Typography.Text>
        <Flex vertical gap={4} style={{ marginTop: 6 }}>
          {COLUMN_KEYS.map((key) => (
            <Checkbox
              key={key}
              checked={settings.visibleColumns.includes(key)}
              disabled={ALWAYS_VISIBLE.includes(key)}
              onChange={() => onToggleColumn(key)}
            >
              {COLUMN_LABELS[key]}
            </Checkbox>
          ))}
        </Flex>
      </div>

      <Divider style={{ margin: 0 }} />

      <div>
        <Typography.Text strong style={{ fontSize: 12 }}>
          Auto-refresh
        </Typography.Text>
        <Select
          size="small"
          value={settings.refreshInterval}
          onChange={onRefreshChange}
          options={refreshOptions}
          style={{ width: "100%", marginTop: 4 }}
        />
      </div>

      <Divider style={{ margin: 0 }} />

      <div>
        <Typography.Text strong style={{ fontSize: 12 }}>
          Density
        </Typography.Text>
        <Radio.Group
          size="small"
          value={settings.density}
          onChange={(e) => onDensityChange(e.target.value)}
          optionType="button"
          buttonStyle="solid"
          options={[
            { label: "Compact", value: "small" },
            { label: "Default", value: "middle" },
          ]}
          style={{ display: "flex", marginTop: 4 }}
        />
      </div>
    </Flex>
  );

  return (
    <Popover content={content} trigger="click" placement="bottomRight">
      <Button type="text" size="small" icon={<SettingOutlined />} />
    </Popover>
  );
};
