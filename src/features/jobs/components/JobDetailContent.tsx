import { CheckOutlined, CloseOutlined, UndoOutlined } from "@ant-design/icons";
import { Button, Divider, Flex, Space, Tag, Typography } from "antd";

import { formatRelativeDate,getSourceColor, STATUS_COLORS, STATUS_LABELS } from "../constants";
import { useSourceNames } from "../hooks/useSourceNames";
import type { JobGroup, JobGroupDetail, UserJobStatus } from "../types";
import { USER_JOB_STATUS } from "../types";
import { JobGroupJobs } from "./JobGroupJobs";

interface JobDetailContentProps {
  job: JobGroup;
  detail: JobGroupDetail | undefined;
  detailLoading: boolean;
  onStatusChange: (groupId: string, status: UserJobStatus) => void;
  statusLoading: boolean;
}

export const JobDetailContent = ({
  job,
  detail,
  detailLoading,
  onStatusChange,
  statusLoading,
}: JobDetailContentProps) => {
  const sourceNames = useSourceNames();
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
          {job.sources.map((source) => (
            <Tag key={source} color={getSourceColor(source)}>
              {sourceNames[source] ?? source}
            </Tag>
          ))}
          <Tag color={STATUS_COLORS[job.status]}>{STATUS_LABELS[job.status]}</Tag>
          {job.remote && <Tag color="cyan">Remote</Tag>}
          {job.jobCount > 1 && (
            <Tag>{job.jobCount} postings</Tag>
          )}
        </Flex>

        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<CheckOutlined />}
            loading={statusLoading}
            onClick={() => onStatusChange(job.groupId, USER_JOB_STATUS.APPLIED)}
            disabled={job.status === USER_JOB_STATUS.APPLIED}
          >
            Applied
          </Button>
          <Button
            size="small"
            icon={<CloseOutlined />}
            loading={statusLoading}
            onClick={() => onStatusChange(job.groupId, USER_JOB_STATUS.IRRELEVANT)}
            disabled={job.status === USER_JOB_STATUS.IRRELEVANT}
          >
            Irrelevant
          </Button>
          <Button
            size="small"
            icon={<UndoOutlined />}
            loading={statusLoading}
            onClick={() => onStatusChange(job.groupId, USER_JOB_STATUS.NEW)}
            disabled={job.status === USER_JOB_STATUS.NEW}
          >
            Reset
          </Button>
        </Space>
      </Flex>

      <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
        <Flex gap={16} wrap="wrap" style={{ marginBottom: 16 }}>
          {job.salary && (
            <Typography.Text type="secondary" style={{ fontSize: 13 }}>
              Salary: {job.salary}
            </Typography.Text>
          )}
          {job.locations.length > 0 && (
            <Typography.Text type="secondary" style={{ fontSize: 13 }}>
              {job.locations.join(", ")}
            </Typography.Text>
          )}
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            Matched: {formatRelativeDate(job.matchedAt)}
          </Typography.Text>
          {job.aiRelevanceScore != null && (
            <Typography.Text type="secondary" style={{ fontSize: 13 }}>
              AI Score: {job.aiRelevanceScore}%
            </Typography.Text>
          )}
        </Flex>

        {detail?.aiReasoning && (
          <>
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

        <Divider style={{ margin: "12px 0" }} />

        <Typography.Text strong style={{ display: "block", marginBottom: 8 }}>
          Postings ({detail?.jobs.length ?? "..."})
        </Typography.Text>

        <JobGroupJobs
          jobs={detail?.jobs ?? []}
          groupId={job.groupId}
          loading={detailLoading}
        />
      </div>
    </Flex>
  );
};
