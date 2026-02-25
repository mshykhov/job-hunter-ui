import { Button, Descriptions, Flex, Space, Tag, Typography } from "antd";
import { LinkOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import type { Job, UserJobStatus } from "../types";
import { STATUS_COLORS, STATUS_LABELS, SOURCE_COLORS } from "../constants";
import { USER_JOB_STATUS } from "../types";

interface JobSidePanelProps {
  job: Job;
  onStatusChange: (jobId: string, status: UserJobStatus) => void;
  loading: boolean;
}

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

export const JobSidePanel = ({ job, onStatusChange, loading }: JobSidePanelProps) => {
  return (
    <Flex vertical gap={16} style={{ padding: 16, height: "100%", overflow: "auto" }}>
      <div>
        <Typography.Title level={5} style={{ margin: 0 }}>
          {job.title}
        </Typography.Title>
        <Typography.Text type="secondary">{job.company}</Typography.Text>
      </div>

      <Flex gap={8} wrap="wrap">
        <Tag color={SOURCE_COLORS[job.source]}>{job.source}</Tag>
        <Tag color={STATUS_COLORS[job.status]}>{STATUS_LABELS[job.status]}</Tag>
        {job.remote && <Tag color="geekblue">Remote</Tag>}
      </Flex>

      <Descriptions column={1} size="small">
        {job.salary && <Descriptions.Item label="Salary">{job.salary}</Descriptions.Item>}
        {job.location && <Descriptions.Item label="Location">{job.location}</Descriptions.Item>}
        <Descriptions.Item label="Published">
          {job.publishedAt ? formatDate(job.publishedAt) : "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Collected">{formatDate(job.createdAt)}</Descriptions.Item>
      </Descriptions>

      {job.description && (
        <Typography.Paragraph
          type="secondary"
          ellipsis={{ rows: 8, expandable: true, symbol: "more" }}
          style={{ fontSize: 13 }}
        >
          <span dangerouslySetInnerHTML={{ __html: job.description }} />
        </Typography.Paragraph>
      )}

      <Flex vertical gap={8} style={{ marginTop: "auto" }}>
        <Space>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            loading={loading}
            onClick={() => onStatusChange(job.id, USER_JOB_STATUS.APPLIED)}
            disabled={job.status === USER_JOB_STATUS.APPLIED}
          >
            Mark Applied
          </Button>
          <Button
            icon={<CloseOutlined />}
            loading={loading}
            onClick={() => onStatusChange(job.id, USER_JOB_STATUS.IRRELEVANT)}
            disabled={job.status === USER_JOB_STATUS.IRRELEVANT}
          >
            Irrelevant
          </Button>
        </Space>
        <Button
          type="link"
          href={job.url}
          target="_blank"
          icon={<LinkOutlined />}
          style={{ paddingLeft: 0 }}
        >
          Open Original
        </Button>
      </Flex>
    </Flex>
  );
};
