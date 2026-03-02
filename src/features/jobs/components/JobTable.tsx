import { useMemo } from "react";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { CheckCircleOutlined } from "@ant-design/icons";
import type { Job } from "../types";
import { STATUS_COLORS, STATUS_LABELS, SOURCE_COLORS, formatRelativeDate } from "../constants";
import type { ColumnKey, TableDensity } from "../hooks/useTableSettings";
import { MIN_COLUMN_WIDTHS } from "../hooks/useTableSettings";
import { ResizableHeaderCell } from "./ResizableHeaderCell";

interface JobTableProps {
  jobs: Job[];
  loading: boolean;
  onSelect: (job: Job) => void;
  visibleColumns: ColumnKey[];
  columnWidths: Partial<Record<ColumnKey, number>>;
  onColumnResize: (key: ColumnKey, width: number) => void;
  density: TableDensity;
  flexColumn: ColumnKey;
}

const BASE_COLUMNS: ColumnsType<Job> = [
  {
    key: "title",
    title: "Title",
    dataIndex: "title",
    ellipsis: true,
    render: (title: string) => <strong>{title}</strong>,
  },
  {
    key: "company",
    title: "Company",
    dataIndex: "company",
    ellipsis: true,
    render: (company: string | null) => company ?? "\u2014",
  },
  {
    key: "source",
    title: "Source",
    dataIndex: "source",
    render: (source: Job["source"]) => <Tag color={SOURCE_COLORS[source]}>{source}</Tag>,
  },
  {
    key: "salary",
    title: "Salary",
    dataIndex: "salary",
    render: (salary: string | null) => salary ?? "\u2014",
  },
  {
    key: "location",
    title: "Location",
    dataIndex: "location",
    ellipsis: true,
    render: (location: string | null) => location ?? "\u2014",
  },
  {
    key: "remote",
    title: "Remote",
    dataIndex: "remote",
    align: "center",
    render: (remote: boolean) =>
      remote ? <CheckCircleOutlined style={{ color: "#52c41a" }} /> : null,
  },
  {
    key: "status",
    title: "Status",
    dataIndex: "status",
    render: (status: Job["status"]) => (
      <Tag color={STATUS_COLORS[status]}>{STATUS_LABELS[status]}</Tag>
    ),
  },
  {
    key: "publishedAt",
    title: "Published",
    dataIndex: "publishedAt",
    sorter: (a, b) => (a.publishedAt ?? "").localeCompare(b.publishedAt ?? ""),
    showSorterTooltip: false,
    render: formatRelativeDate,
  },
  {
    key: "matchedAt",
    title: "Matched",
    dataIndex: "matchedAt",
    sorter: (a, b) => (a.matchedAt ?? "").localeCompare(b.matchedAt ?? ""),
    showSorterTooltip: false,
    render: formatRelativeDate,
  },
];

export const JobTable = ({
  jobs,
  loading,
  onSelect,
  visibleColumns,
  columnWidths,
  onColumnResize,
  density,
  flexColumn,
}: JobTableProps) => {
  const columns = useMemo(
    () =>
      BASE_COLUMNS.filter((col) => visibleColumns.includes(col.key as ColumnKey)).map((col) => {
        const key = col.key as ColumnKey;
        const isFlex = key === flexColumn;
        const userWidth = columnWidths[key];
        const minW = MIN_COLUMN_WIDTHS[key];

        return {
          ...col,
          ...(isFlex
            ? { minWidth: minW }
            : userWidth
              ? { width: userWidth, minWidth: minW }
              : { width: minW, minWidth: minW }),
          onHeaderCell: () => ({
            width: isFlex ? 0 : (userWidth ?? minW),
            onResize: isFlex ? undefined : (nw: number) => onColumnResize(key, nw),
          }),
        };
      }),
    [visibleColumns, columnWidths, onColumnResize, flexColumn],
  );

  const scrollX = useMemo(
    () =>
      visibleColumns.reduce((sum, key) => {
        const userWidth = columnWidths[key];
        return sum + (userWidth ?? MIN_COLUMN_WIDTHS[key]);
      }, 0),
    [visibleColumns, columnWidths],
  );

  return (
    <Table<Job>
      columns={columns}
      dataSource={jobs}
      loading={loading}
      rowKey="id"
      size={density}
      scroll={{ x: scrollX }}
      components={{ header: { cell: ResizableHeaderCell } }}
      pagination={false}
      onRow={(record) => ({
        onClick: () => onSelect(record),
        style: { cursor: "pointer" },
      })}
    />
  );
};
