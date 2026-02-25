import { useMemo } from "react";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { CheckCircleOutlined } from "@ant-design/icons";
import type { Job } from "../types";
import { STATUS_COLORS, STATUS_LABELS, SOURCE_COLORS } from "../constants";
import type { ColumnKey, TableDensity } from "../hooks/useTableSettings";
import { DEFAULT_COLUMN_WIDTHS } from "../hooks/useTableSettings";
import { ResizableHeaderCell } from "./ResizableHeaderCell";

interface JobTableProps {
  jobs: Job[];
  loading: boolean;
  selectedJobId: string | null;
  onSelect: (job: Job) => void;
  visibleColumns: ColumnKey[];
  columnWidths: Record<ColumnKey, number>;
  onColumnResize: (key: ColumnKey, width: number) => void;
  density: TableDensity;
}

const formatRelativeDate = (dateStr: string | null): string => {
  if (!dateStr) return "\u2014";
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
};

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
  selectedJobId,
  onSelect,
  visibleColumns,
  columnWidths,
  onColumnResize,
  density,
}: JobTableProps) => {
  const columns = useMemo(
    () =>
      BASE_COLUMNS.filter((col) => visibleColumns.includes(col.key as ColumnKey)).map(
        (col) => {
          const key = col.key as ColumnKey;
          const w = columnWidths[key] ?? DEFAULT_COLUMN_WIDTHS[key];
          const isFlex = !w;
          return {
            ...col,
            width: isFlex ? undefined : w,
            onHeaderCell: () => ({
              width: isFlex ? 0 : w,
              onResize: isFlex ? undefined : (nw: number) => onColumnResize(key, nw),
            }),
          };
        },
      ),
    [visibleColumns, columnWidths, onColumnResize],
  );

  return (
    <Table<Job>
      columns={columns}
      dataSource={jobs}
      loading={loading}
      rowKey="id"
      size={density}
      components={{ header: { cell: ResizableHeaderCell } }}
      pagination={{
        pageSize: 25,
        showSizeChanger: true,
        pageSizeOptions: [10, 25, 50],
      }}
      onRow={(record) => ({
        onClick: () => onSelect(record),
        style: {
          cursor: "pointer",
          borderLeft:
            record.id === selectedJobId ? "3px solid #4F46E5" : "3px solid transparent",
        },
      })}
    />
  );
};
