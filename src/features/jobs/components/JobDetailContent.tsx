import {
  CalendarOutlined,
  CheckOutlined,
  CloseOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  RobotOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { Button, Divider, Flex, Space, Tag, Typography } from "antd";

import { formatRelativeDate, getSourceColor, REMOTE_TAG_COLOR, STATUS_COLORS, STATUS_LABELS } from "../constants";
import { useSourceNames } from "../hooks/useSourceNames";
import type { JobGroup, JobGroupDetail, UserJobStatus } from "../types";
import { USER_JOB_STATUS } from "../types";
import { getScoreClass, getScoreLabel } from "../utils/jobDetailUtils";
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
  const postingCount = detail?.jobs?.length ?? job.jobCount;
  return (
    <Flex vertical style={{ height: "100%", overflow: "hidden" }}>
      <Flex
        vertical
        gap={12}
        className="job-detail-header"
      >
        <Flex justify="space-between" align="flex-start" gap={12}>
          <div style={{ minWidth: 0 }}>
            <Typography.Title level={5} style={{ margin: 0 }} ellipsis={{ rows: 2 }}>
              {job.title}
            </Typography.Title>
            {job.company && (
              <Typography.Text type="secondary">{job.company}</Typography.Text>
            )}
          </div>

          {job.aiRelevanceScore != null && (
            <span
              className={`job-detail-score ${getScoreClass(job.aiRelevanceScore)}`}
              aria-label={`AI relevance score: ${job.aiRelevanceScore}% (${getScoreLabel(job.aiRelevanceScore)})`}
            >
              <RobotOutlined />
              {job.aiRelevanceScore}%
            </span>
          )}
        </Flex>

        <Flex gap={8} wrap="wrap">
          {job.sources.map((source) => (
            <Tag key={source} color={getSourceColor(source)}>
              {sourceNames[source] ?? source}
            </Tag>
          ))}
          <Tag color={STATUS_COLORS[job.status]}>{STATUS_LABELS[job.status]}</Tag>
          {job.remote && <Tag color={REMOTE_TAG_COLOR}>Remote</Tag>}
          {postingCount > 1 && (
            <Tag>{postingCount} postings</Tag>
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
        <div className="job-detail-meta">
          {job.salary && (
            <span className="job-detail-meta-item">
              <DollarOutlined />
              {job.salary}
            </span>
          )}
          {job.locations.length > 0 && (
            <span className="job-detail-meta-item">
              <EnvironmentOutlined />
              {job.locations.join(", ")}
            </span>
          )}
          {job.publishedAt && (
            <span className="job-detail-meta-item">
              <CalendarOutlined />
              Published {formatRelativeDate(job.publishedAt)}
            </span>
          )}
          {job.matchedAt && (
            <span className="job-detail-meta-item">
              <CalendarOutlined />
              Matched {formatRelativeDate(job.matchedAt)}
            </span>
          )}
        </div>

        {detail?.aiReasoning && (
          <>
            <div className="job-detail-reasoning">
              <div className="job-detail-reasoning-title">
                <RobotOutlined />
                AI Reasoning
              </div>
              <p className="job-detail-reasoning-text">
                {detail.aiReasoning}
              </p>
            </div>
            <Divider style={{ margin: "12px 0" }} />
          </>
        )}

        <div className="job-detail-section-title">
          Postings
          <Tag>{postingCount}</Tag>
        </div>

        <JobGroupJobs
          jobs={detail?.jobs ?? []}
          groupId={job.groupId}
          loading={detailLoading}
        />
      </div>
    </Flex>
  );
};
