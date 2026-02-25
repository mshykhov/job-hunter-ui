import { Button, Descriptions, Divider, Flex, Skeleton, Space, Tag, Typography } from "antd";
import {
  LinkOutlined,
  CheckOutlined,
  CloseOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import type { Job, UserJobStatus } from "../types";
import { STATUS_COLORS, STATUS_LABELS, SOURCE_COLORS } from "../constants";
import { USER_JOB_STATUS } from "../types";
import { useJobDetail } from "../hooks/useJobDetail";

interface JobDetailPanelProps {
  job: Job;
  onClose: () => void;
  onStatusChange: (jobId: string, status: UserJobStatus) => void;
  statusLoading: boolean;
}

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return "\u2014";
  const date = new Date(dateStr);
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

export const JobDetailPanel = ({
  job,
  onClose,
  onStatusChange,
  statusLoading,
}: JobDetailPanelProps) => {
  const { data: detail, isLoading } = useJobDetail(job.jobId);

  return (
    <Flex vertical style={{ height: "100%", overflow: "hidden" }}>
      <Flex
        vertical
        gap={12}
        style={{
          padding: "16px 16px 12px",
          flexShrink: 0,
          borderBottom: "1px solid var(--ant-color-border-secondary, #303030)",
        }}
      >
        <Flex justify="space-between" align="start">
          <div style={{ flex: 1, minWidth: 0 }}>
            <Typography.Title level={5} style={{ margin: 0 }} ellipsis={{ rows: 2 }}>
              {job.title}
            </Typography.Title>
            {job.company && (
              <Typography.Text type="secondary">{job.company}</Typography.Text>
            )}
          </div>
          <Button
            type="text"
            size="small"
            icon={<CloseCircleOutlined />}
            onClick={onClose}
            style={{ marginLeft: 8, flexShrink: 0 }}
          />
        </Flex>

        <Flex gap={8} wrap="wrap">
          <Tag color={SOURCE_COLORS[job.source]}>{job.source}</Tag>
          <Tag color={STATUS_COLORS[job.status]}>{STATUS_LABELS[job.status]}</Tag>
          {job.remote && <Tag color="geekblue">Remote</Tag>}
        </Flex>

        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<CheckOutlined />}
            loading={statusLoading}
            onClick={() => onStatusChange(job.jobId, USER_JOB_STATUS.APPLIED)}
            disabled={job.status === USER_JOB_STATUS.APPLIED}
          >
            Applied
          </Button>
          <Button
            size="small"
            icon={<CloseOutlined />}
            loading={statusLoading}
            onClick={() => onStatusChange(job.jobId, USER_JOB_STATUS.IRRELEVANT)}
            disabled={job.status === USER_JOB_STATUS.IRRELEVANT}
          >
            Irrelevant
          </Button>
          <Button
            type="link"
            size="small"
            href={job.url}
            target="_blank"
            icon={<LinkOutlined />}
          >
            Original
          </Button>
        </Space>
      </Flex>

      <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
        <Descriptions column={1} size="small" style={{ marginBottom: 16 }}>
          {job.salary && <Descriptions.Item label="Salary">{job.salary}</Descriptions.Item>}
          {job.location && (
            <Descriptions.Item label="Location">{job.location}</Descriptions.Item>
          )}
          <Descriptions.Item label="Published">{formatDate(job.publishedAt)}</Descriptions.Item>
          <Descriptions.Item label="Matched">{formatDate(job.matchedAt)}</Descriptions.Item>
          {job.aiRelevanceScore != null && (
            <Descriptions.Item label="AI Score">{job.aiRelevanceScore}%</Descriptions.Item>
          )}
        </Descriptions>

        <Divider style={{ margin: "12px 0" }} />

        {isLoading ? (
          <Skeleton active paragraph={{ rows: 8 }} />
        ) : detail?.description ? (
          <div
            className="job-description"
            dangerouslySetInnerHTML={{ __html: detail.description }}
          />
        ) : (
          <Typography.Text type="secondary">No description available</Typography.Text>
        )}

        {detail?.aiReasoning && (
          <>
            <Divider style={{ margin: "12px 0" }} />
            <Typography.Text strong style={{ display: "block", marginBottom: 8 }}>
              AI Reasoning
            </Typography.Text>
            <Typography.Paragraph
              type="secondary"
              style={{ fontSize: 13, whiteSpace: "pre-wrap" }}
            >
              {detail.aiReasoning}
            </Typography.Paragraph>
          </>
        )}
      </div>
    </Flex>
  );
};
