import { Button, Flex, Tooltip, Typography } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
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
