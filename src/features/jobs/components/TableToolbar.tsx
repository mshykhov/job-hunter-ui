import { useState } from "react";
import { Button, Flex, Popover, Radio, Tooltip, Typography } from "antd";
import { ReloadOutlined, SyncOutlined } from "@ant-design/icons";
import type {
  TableSettings as TableSettingsType,
  ColumnKey,
  TableDensity,
} from "../hooks/useTableSettings";
import { TableSettings } from "./TableSettings";

interface TableToolbarProps {
  total: number;
  isFetching: boolean;
  dataUpdatedAt: number;
  onRefresh: () => void;
  onRematch: (since?: string) => void;
  rematchLoading: boolean;
  settings: TableSettingsType;
  onToggleColumn: (key: ColumnKey) => void;
  onRefreshChange: (interval: number) => void;
  onDensityChange: (density: TableDensity) => void;
}

type RematchPeriod = "24h" | "week" | "month";

const PERIOD_LABELS: Record<RematchPeriod, string> = {
  "24h": "Last 24 hours",
  week: "Last week",
  month: "Last month",
};

const periodToSince = (period: RematchPeriod): string => {
  const now = new Date();
  const ms = { "24h": 86400000, week: 604800000, month: 2592000000 }[period];
  return new Date(now.getTime() - ms).toISOString();
};

export const TableToolbar = ({
  total,
  isFetching,
  dataUpdatedAt,
  onRefresh,
  onRematch,
  rematchLoading,
  settings,
  onToggleColumn,
  onRefreshChange,
  onDensityChange,
}: TableToolbarProps) => {
  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : null;
  const [rematchOpen, setRematchOpen] = useState(false);
  const [period, setPeriod] = useState<RematchPeriod>("week");

  const handleRematch = () => {
    setRematchOpen(false);
    onRematch(periodToSince(period));
  };

  const rematchContent = (
    <Flex vertical gap={12} style={{ width: 200 }}>
      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
        Re-run AI matching for jobs matched within:
      </Typography.Text>
      <Radio.Group
        value={period}
        onChange={(e) => setPeriod(e.target.value)}
        style={{ display: "flex", flexDirection: "column", gap: 4 }}
      >
        {(Object.keys(PERIOD_LABELS) as RematchPeriod[]).map((key) => (
          <Radio key={key} value={key}>{PERIOD_LABELS[key]}</Radio>
        ))}
      </Radio.Group>
      <Button
        type="primary"
        size="small"
        block
        onClick={handleRematch}
        loading={rematchLoading}
      >
        Rematch
      </Button>
    </Flex>
  );

  return (
    <Flex justify="space-between" align="center" style={{ marginBottom: 8 }}>
      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
        {total} jobs {lastUpdated && `\u00B7 Updated ${lastUpdated}`}
      </Typography.Text>
      <Flex align="center" gap={2}>
        <Popover
          content={rematchContent}
          trigger="click"
          open={rematchOpen}
          onOpenChange={setRematchOpen}
          placement="bottomRight"
        >
          <Tooltip title="Re-match jobs">
            <Button
              type="text"
              size="small"
              icon={<SyncOutlined spin={rematchLoading} />}
            />
          </Tooltip>
        </Popover>
        <Tooltip title="Refresh">
          <Button
            type="text"
            size="small"
            icon={<ReloadOutlined spin={isFetching} />}
            onClick={onRefresh}
          />
        </Tooltip>
        <TableSettings
          settings={settings}
          onToggleColumn={onToggleColumn}
          onRefreshChange={onRefreshChange}
          onDensityChange={onDensityChange}
        />
      </Flex>
    </Flex>
  );
};
