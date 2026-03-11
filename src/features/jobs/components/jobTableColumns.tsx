import { CheckCircleOutlined } from "@ant-design/icons";
import { Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";

import { formatRelativeDate, getSourceColor, REMOTE_CHECK_COLOR, STATUS_COLORS, STATUS_LABELS } from "../constants";
import type { JobGroup } from "../types";

export const buildBaseColumns = (sourceNames: Record<string, string>): ColumnsType<JobGroup> => [
  {
    key: "rowNum",
    title: "#",
    align: "center",
    render: (_: unknown, __: JobGroup, index: number) => index + 1,
  },
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
    key: "sources",
    title: "Sources",
    dataIndex: "sources",
    render: (sources: string[]) => {
      if (!sources?.length) return "\u2014";
      const first = sources[0];
      const rest = sources.length - 1;
      const tooltip = rest > 0 ? sources.map((s) => sourceNames[s] ?? s).join(", ") : undefined;
      return (
        <Tooltip title={tooltip}>
          <span>
            <Tag color={getSourceColor(first)} style={{ marginInlineEnd: 0 }}>
              {sourceNames[first] ?? first}
            </Tag>
            {rest > 0 && (
              <span style={{ fontSize: 11, opacity: 0.65, marginLeft: 4 }}>+{rest}</span>
            )}
          </span>
        </Tooltip>
      );
    },
  },
  {
    key: "salary",
    title: "Salary",
    dataIndex: "salary",
    render: (salary: string | null) => salary ?? "\u2014",
  },
  {
    key: "locations",
    title: "Locations",
    dataIndex: "locations",
    ellipsis: true,
    render: (locations: string[]) => {
      if (!locations?.length) return "\u2014";
      const first = locations[0];
      const rest = locations.length - 1;
      if (rest === 0) return first;
      return (
        <Tooltip title={locations.join(", ")}>
          <span>{first} <span style={{ fontSize: 11, opacity: 0.65 }}>+{rest}</span></span>
        </Tooltip>
      );
    },
  },
  {
    key: "remote",
    title: "Remote",
    dataIndex: "remote",
    align: "center",
    render: (remote: boolean) =>
      remote ? <CheckCircleOutlined style={{ color: REMOTE_CHECK_COLOR }} /> : null,
  },
  {
    key: "jobCount",
    title: "Jobs",
    dataIndex: "jobCount",
    align: "center",
    render: (count: number) => count,
  },
  {
    key: "status",
    title: "Status",
    dataIndex: "status",
    render: (status: JobGroup["status"]) => (
      <Tag color={STATUS_COLORS[status]}>{STATUS_LABELS[status]}</Tag>
    ),
  },
  {
    key: "score",
    title: "Score",
    dataIndex: "aiRelevanceScore",
    align: "center",
    render: (score: number | null) => score != null ? `${score}%` : "\u2014",
  },
  {
    key: "publishedAt",
    title: "Published",
    dataIndex: "publishedAt",
    render: formatRelativeDate,
  },
  {
    key: "matchedAt",
    title: "Matched",
    dataIndex: "matchedAt",
    render: formatRelativeDate,
  },
  {
    key: "updatedAt",
    title: "Updated",
    dataIndex: "updatedAt",
    render: formatRelativeDate,
  },
];
