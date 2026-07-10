import type { MouseEvent } from "react";

import { CheckOutlined, CloseOutlined, ExportOutlined, UndoOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";

import type { JobGroup, UserJobStatus } from "@/features/jobs/types";
import { USER_JOB_STATUS } from "@/features/jobs/types";

interface JobRowActionsProps {
  job: JobGroup;
  pending: boolean;
  onOpenPrimary: (job: JobGroup) => void;
  onStatusChange: (groupId: string, status: UserJobStatus) => void;
}

export const JobRowActions = ({
  job,
  pending,
  onOpenPrimary,
  onStatusChange,
}: JobRowActionsProps) => {
  const act = (e: MouseEvent, fn: () => void) => {
    e.stopPropagation();
    fn();
  };

  return (
    <div className="jobs-trail-actions">
      <Tooltip title="Open original">
        <Button
          type="text"
          size="small"
          icon={<ExportOutlined />}
          onClick={(e) => act(e, () => onOpenPrimary(job))}
        />
      </Tooltip>
      <Tooltip title="Mark applied">
        <Button
          type="text"
          size="small"
          icon={<CheckOutlined />}
          disabled={pending || job.status === USER_JOB_STATUS.APPLIED}
          onClick={(e) => act(e, () => onStatusChange(job.groupId, USER_JOB_STATUS.APPLIED))}
        />
      </Tooltip>
      <Tooltip title="Mark irrelevant">
        <Button
          type="text"
          size="small"
          icon={<CloseOutlined />}
          disabled={pending || job.status === USER_JOB_STATUS.IRRELEVANT}
          onClick={(e) => act(e, () => onStatusChange(job.groupId, USER_JOB_STATUS.IRRELEVANT))}
        />
      </Tooltip>
      <Tooltip title="Reset to new">
        <Button
          type="text"
          size="small"
          icon={<UndoOutlined />}
          disabled={pending || job.status === USER_JOB_STATUS.NEW}
          onClick={(e) => act(e, () => onStatusChange(job.groupId, USER_JOB_STATUS.NEW))}
        />
      </Tooltip>
    </div>
  );
};
