import { useCallback,useEffect } from "react";

import {
  CloseOutlined,
  LeftOutlined,
  QuestionCircleOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Button, Flex, Popover, Spin, Typography } from "antd";

import { useJobDetail } from "../hooks/useJobDetail";
import type { JobGroup, UserJobStatus } from "../types";
import { USER_JOB_STATUS } from "../types";
import { JobDetailContent } from "./JobDetailContent";
import { ShortcutsHelp } from "./ShortcutsHelp";

interface JobReviewCardProps {
  job: JobGroup;
  currentIndex: number;
  total: number;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
  onStatusChange: (groupId: string, status: UserJobStatus) => void;
  statusLoading: boolean;
  loading?: boolean;
}

export const JobReviewCard = ({
  job,
  currentIndex,
  total,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  onClose,
  onStatusChange,
  statusLoading,
  loading,
}: JobReviewCardProps) => {
  const { data: detail, isLoading: detailLoading } = useJobDetail(job.groupId);

  const handleApply = useCallback(() => {
    if (job.status !== USER_JOB_STATUS.APPLIED) {
      onStatusChange(job.groupId, USER_JOB_STATUS.APPLIED);
    }
  }, [job, onStatusChange]);

  const handleDecline = useCallback(() => {
    if (job.status !== USER_JOB_STATUS.IRRELEVANT) {
      onStatusChange(job.groupId, USER_JOB_STATUS.IRRELEVANT);
    }
  }, [job, onStatusChange]);

  const handleReset = useCallback(() => {
    if (job.status !== USER_JOB_STATUS.NEW) {
      onStatusChange(job.groupId, USER_JOB_STATUS.NEW);
    }
  }, [job, onStatusChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      switch (e.key) {
        case "a":
        case "A":
          e.preventDefault();
          handleApply();
          break;
        case "d":
        case "D":
        case "x":
        case "X":
          e.preventDefault();
          handleDecline();
          break;
        case "r":
        case "R":
          e.preventDefault();
          handleReset();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleApply, handleDecline, handleReset]);

  return (
    <Flex vertical className="review-card">
      <Flex
        justify="space-between"
        align="center"
        className="review-card-header"
      >
        <Flex align="center" gap={8}>
          <Button
            type="text"
            size="small"
            icon={<LeftOutlined />}
            disabled={!hasPrev}
            onClick={onPrev}
          />
          <Typography.Text type="secondary" style={{ fontSize: 13, minWidth: 50, textAlign: "center" }}>
            {currentIndex + 1} / {total}
          </Typography.Text>
          <Button
            type="text"
            size="small"
            icon={<RightOutlined />}
            disabled={!hasNext}
            onClick={onNext}
          />
        </Flex>

        <Flex align="center" gap={4}>
          <Popover
            content={<ShortcutsHelp />}
            trigger="click"
            placement="bottomRight"
          >
            <Button
              type="text"
              size="small"
              icon={<QuestionCircleOutlined />}
            />
          </Popover>
          <Button
            type="text"
            size="small"
            icon={<CloseOutlined />}
            onClick={onClose}
          />
        </Flex>
      </Flex>

      <Spin spinning={!!loading}>
      <div className="review-card-body">
        <JobDetailContent
          job={job}
          detail={detail}
          detailLoading={detailLoading}
          onStatusChange={onStatusChange}
          statusLoading={statusLoading}
        />
      </div>
      </Spin>
    </Flex>
  );
};
