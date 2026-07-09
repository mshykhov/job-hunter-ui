import type { MouseEvent } from "react";

import { CheckCircleOutlined, ExportOutlined } from "@ant-design/icons";
import { Button, Tag, Tooltip, Typography } from "antd";

import { formatRelativeDate, getSourceColor } from "@/features/jobs/constants";
import type { PublicJob } from "@/features/jobs/types";
import { formatDescription } from "@/lib/formatDescription";

interface ExploreRowProps {
  job: PublicJob;
  index: number;
  sourceNames: Record<string, string>;
  expanded: boolean;
  onToggle: (id: string) => void;
}

export const ExploreRow = ({ job, index, sourceNames, expanded, onToggle }: ExploreRowProps) => {
  const openOriginal = (e: MouseEvent) => {
    e.stopPropagation();
    window.open(job.url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <div
        className={expanded ? "jobs-row explore-row explore-row--expanded" : "jobs-row explore-row"}
        onClick={() => onToggle(job.id)}
        role="button"
        tabIndex={0}
      >
        <span className="jobs-row-index">{index + 1}</span>

        <div className="jobs-cell-main">
          <Typography.Text strong ellipsis={{ tooltip: job.title }} className="jobs-row-title">
            {job.title}
          </Typography.Text>
          {job.company && (
            <div className="jobs-row-sub">
              <span className="jobs-company">{job.company}</span>
            </div>
          )}
        </div>

        <div className="jobs-cell-meta">
          <Tag color={getSourceColor(job.source)} className="jobs-tag-flush">
            {sourceNames[job.source] ?? job.source}
          </Tag>
          {job.remote && (
            <span className="jobs-remote">
              <CheckCircleOutlined /> Remote
            </span>
          )}
          {job.salary && <span className="jobs-info-salary">{job.salary}</span>}
          {job.location && <span className="jobs-dim">{job.location}</span>}
        </div>

        <div className="jobs-cell-trail">
          <span className="jobs-row-time">{formatRelativeDate(job.publishedAt)}</span>
          <Tooltip title="Open original">
            <Button type="text" size="small" icon={<ExportOutlined />} onClick={openOriginal} />
          </Tooltip>
        </div>
      </div>

      {expanded && (
        <div className="explore-expand">
          {job.description ? (
            <div
              className="job-description"
              // eslint-disable-next-line react/no-danger -- sanitized via DOMPurify
              dangerouslySetInnerHTML={{ __html: formatDescription(job.description) }}
            />
          ) : (
            <Typography.Text type="secondary">No description available</Typography.Text>
          )}
        </div>
      )}
    </>
  );
};
