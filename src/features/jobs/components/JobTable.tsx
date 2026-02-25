import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { CheckCircleOutlined } from "@ant-design/icons";
import type { Job } from "../types";
import { STATUS_COLORS, STATUS_LABELS, SOURCE_COLORS } from "../constants";
import type { ColumnKey, TableDensity } from "../hooks/useTableSettings";

interface JobTableProps {
  jobs: Job[];
  loading: boolean;
  selectedJobId: string | null;
  onSelect: (job: Job) => void;
  visibleColumns: ColumnKey[];
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

const ALL_COLUMNS: ColumnsType<Job> = [
  {
    key: "title",
    title: "Title",
    dataIndex: "title",
    ellipsis: true,
    width: "25%",
    render: (title: string) => <strong>{title}</strong>,
  },
  {
    key: "company",
    title: "Company",
    dataIndex: "company",
    ellipsis: true,
    width: "15%",
    render: (company: string | null) => company ?? "\u2014",
  },
  {
    key: "source",
    title: "Source",
    dataIndex: "source",
    width: 90,
    render: (source: Job["source"]) => <Tag color={SOURCE_COLORS[source]}>{source}</Tag>,
  },
  {
    key: "salary",
    title: "Salary",
    dataIndex: "salary",
    width: 120,
    render: (salary: string | null) => salary ?? "\u2014",
  },
  {
    key: "location",
    title: "Location",
    dataIndex: "location",
    ellipsis: true,
    width: 120,
    render: (location: string | null) => location ?? "\u2014",
  },
  {
    key: "remote",
    title: "Remote",
    dataIndex: "remote",
    width: 70,
    align: "center",
    render: (remote: boolean) =>
      remote ? <CheckCircleOutlined style={{ color: "#52c41a" }} /> : null,
  },
  {
    key: "status",
    title: "Status",
    dataIndex: "status",
    width: 100,
    render: (status: Job["status"]) => (
      <Tag color={STATUS_COLORS[status]}>{STATUS_LABELS[status]}</Tag>
    ),
  },
  {
    key: "publishedAt",
    title: "Published",
    dataIndex: "publishedAt",
    width: 100,
    sorter: (a, b) => (a.publishedAt ?? "").localeCompare(b.publishedAt ?? ""),
    render: formatRelativeDate,
  },
  {
    key: "matchedAt",
    title: "Matched",
    dataIndex: "matchedAt",
    width: 100,
    sorter: (a, b) => (a.matchedAt ?? "").localeCompare(b.matchedAt ?? ""),
    render: formatRelativeDate,
  },
];

export const JobTable = ({
  jobs,
  loading,
  selectedJobId,
  onSelect,
  visibleColumns,
  density,
}: JobTableProps) => {
  const columns = ALL_COLUMNS.filter((col) => visibleColumns.includes(col.key as ColumnKey));

  return (
    <Table<Job>
      columns={columns}
      dataSource={jobs}
      loading={loading}
      rowKey="id"
      size={density}
      pagination={{
        pageSize: 25,
        showSizeChanger: true,
        pageSizeOptions: [10, 25, 50],
      }}
      onRow={(record) => ({
        onClick: () => onSelect(record),
        style: {
          cursor: "pointer",
          borderLeft: record.id === selectedJobId ? "3px solid #4F46E5" : "3px solid transparent",
        },
      })}
    />
  );
};
