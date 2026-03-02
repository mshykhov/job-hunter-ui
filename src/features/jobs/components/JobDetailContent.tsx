import { Button, Descriptions, Divider, Flex, Skeleton, Space, Tag, Typography } from "antd";
import { LinkOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import type { Job, JobDetail, UserJobStatus } from "../types";
import { USER_JOB_STATUS } from "../types";
import { STATUS_COLORS, STATUS_LABELS, SOURCE_COLORS, formatRelativeDate } from "../constants";

interface JobDetailContentProps {
  job: Job;
  detail: JobDetail | undefined;
  detailLoading: boolean;
  onStatusChange: (jobId: string, status: UserJobStatus) => void;
  statusLoading: boolean;
  onOpenOriginal: () => void;
}

export const JobDetailContent = ({
  job,
  detail,
  detailLoading,
  onStatusChange,
  statusLoading,
  onOpenOriginal,
}: JobDetailContentProps) => {
  return (
    <Flex vertical style={{ height: "100%", overflow: "hidden" }}>
      <Flex
        vertical
        gap={12}
        className="job-detail-header"
      >
        <div>
          <Typography.Title level={5} style={{ margin: 0 }} ellipsis={{ rows: 2 }}>
            {job.title}
          </Typography.Title>
          {job.company && (
            <Typography.Text type="secondary">{job.company}</Typography.Text>
          )}
        </div>

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
            onClick={onOpenOriginal}
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
          <Descriptions.Item label="Published">{formatRelativeDate(job.publishedAt)}</Descriptions.Item>
          <Descriptions.Item label="Matched">{formatRelativeDate(job.matchedAt)}</Descriptions.Item>
          {job.aiRelevanceScore != null && (
            <Descriptions.Item label="AI Score">{job.aiRelevanceScore}%</Descriptions.Item>
          )}
        </Descriptions>

        <Divider style={{ margin: "12px 0" }} />

        {detailLoading ? (
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
