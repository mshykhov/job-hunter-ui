import { useEffect, useRef } from "react";

import { CheckCircleOutlined } from "@ant-design/icons";
import { Tag, Tooltip, Typography } from "antd";

import {
  formatRelativeDate,
  getSourceColor,
  STATUS_COLORS,
  STATUS_LABELS,
} from "@/features/jobs/constants";
import type { JobGroup, UserJobStatus } from "@/features/jobs/types";
import { getScoreLabel } from "@/features/jobs/utils/jobDetailUtils";

import { JobRowActions } from "./JobRowActions";
import { JobScore } from "./JobScore";

interface JobRowProps {
  job: JobGroup;
  index: number;
  selected: boolean;
  sourceNames: Record<string, string>;
  statusPending: boolean;
  onSelect: (job: JobGroup) => void;
  onOpenPrimary: (job: JobGroup) => void;
  onStatusChange: (groupId: string, status: UserJobStatus) => void;
}

export const JobRow = ({
  job,
  index,
  selected,
  sourceNames,
  statusPending,
  onSelect,
  onOpenPrimary,
  onStatusChange,
}: JobRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [firstSource, ...restSources] = job.sources;
  const location = job.locations[0];
  const extraLocations = job.locations.length - 1;
  const scoreTitle =
    job.aiRelevanceScore == null
      ? "No AI match score"
      : `${job.aiRelevanceScore}% - ${getScoreLabel(job.aiRelevanceScore)} match`;

  useEffect(() => {
    if (selected) rowRef.current?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  return (
    <div
      ref={rowRef}
      className={selected ? "jobs-row jobs-row--selected" : "jobs-row"}
      onClick={() => onSelect(job)}
      role="button"
      tabIndex={0}
    >
      <span className="jobs-row-index">{index + 1}</span>
      <Tooltip title={scoreTitle}>
        <span className="jobs-score-cell">
          <JobScore score={job.aiRelevanceScore} />
        </span>
      </Tooltip>

      <div className="jobs-cell-main">
        <Typography.Text strong ellipsis={{ tooltip: job.title }} className="jobs-row-title">
          {job.title}
        </Typography.Text>
        <div className="jobs-row-sub">
          {job.company && <span className="jobs-company">{job.company}</span>}
          {job.jobCount > 1 && <span className="jobs-dim">{job.jobCount} postings</span>}
        </div>
      </div>

      <div className="jobs-cell-meta">
        {firstSource && (
          <span className="jobs-sources">
            <Tag color={getSourceColor(firstSource)} className="jobs-tag-flush">
              {sourceNames[firstSource] ?? firstSource}
            </Tag>
            {restSources.length > 0 && (
              <Tooltip title={job.sources.map((s) => sourceNames[s] ?? s).join(", ")}>
                <span className="jobs-dim">+{restSources.length}</span>
              </Tooltip>
            )}
          </span>
        )}
        {job.remote && (
          <span className="jobs-remote">
            <CheckCircleOutlined /> Remote
          </span>
        )}
        {job.salary && <span className="jobs-info-salary">{job.salary}</span>}
        {location && (
          <span className="jobs-dim">
            {location}
            {extraLocations > 0 && (
              <Tooltip title={job.locations.join(", ")}>
                <span className="jobs-dim"> +{extraLocations}</span>
              </Tooltip>
            )}
          </span>
        )}
      </div>

      <div className="jobs-cell-trail">
        <Tag color={STATUS_COLORS[job.status]} className="jobs-tag-flush">
          {STATUS_LABELS[job.status]}
        </Tag>
        <div className="jobs-trail-swap">
          <span className="jobs-row-time">{formatRelativeDate(job.matchedAt)}</span>
          <JobRowActions
            job={job}
            pending={statusPending}
            onOpenPrimary={onOpenPrimary}
            onStatusChange={onStatusChange}
          />
        </div>
      </div>
    </div>
  );
};
