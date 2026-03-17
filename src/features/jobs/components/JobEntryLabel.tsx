import { DollarOutlined, EnvironmentOutlined, LinkOutlined } from "@ant-design/icons";
import { Button, Tag, Typography } from "antd";

import { formatRelativeDate, REMOTE_TAG_COLOR } from "../constants";
import type { GroupJob } from "../types";

interface JobEntryLabelProps {
  job: GroupJob;
}

export const JobEntryLabel = ({ job }: JobEntryLabelProps) => (
  <div className="job-entry-label">
    <div className="job-entry-label-meta">
      {job.location && (
        <Typography.Text type="secondary" style={{ fontSize: 13 }} ellipsis>
          <EnvironmentOutlined style={{ marginRight: 4 }} />
          {job.location}
        </Typography.Text>
      )}
      {job.salary && (
        <Typography.Text style={{ fontSize: 13, flexShrink: 0 }}>
          <DollarOutlined style={{ marginRight: 4 }} />
          {job.salary}
        </Typography.Text>
      )}
      {job.remote && <Tag color={REMOTE_TAG_COLOR} style={{ margin: 0 }}>Remote</Tag>}
    </div>
    <span className="job-entry-label-date">
      {formatRelativeDate(job.publishedAt)}
    </span>
    <Button
      type="link"
      size="small"
      icon={<LinkOutlined />}
      href={job.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
    >
      Open
    </Button>
  </div>
);
