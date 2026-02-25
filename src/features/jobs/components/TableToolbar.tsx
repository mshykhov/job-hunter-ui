import { Button, Flex, Popconfirm, Tooltip, Typography } from "antd";
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
  onRematch: () => void;
  rematchLoading: boolean;
  settings: TableSettingsType;
  onToggleColumn: (key: ColumnKey) => void;
  onRefreshChange: (interval: number) => void;
  onDensityChange: (density: TableDensity) => void;
}

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

  return (
    <Flex justify="space-between" align="center" style={{ marginBottom: 8 }}>
      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
        {total} jobs {lastUpdated && `\u00B7 Updated ${lastUpdated}`}
      </Typography.Text>
      <Flex align="center" gap={2}>
        <Popconfirm
          title="Re-match all jobs?"
          description="This will reset matched jobs and re-run AI evaluation."
          onConfirm={onRematch}
          okText="Rematch"
        >
          <Tooltip title="Re-match jobs">
            <Button
              type="text"
              size="small"
              icon={<SyncOutlined spin={rematchLoading} />}
              loading={rematchLoading}
            />
          </Tooltip>
        </Popconfirm>
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
