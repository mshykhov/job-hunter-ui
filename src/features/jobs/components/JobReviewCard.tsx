import { useEffect, useCallback } from "react";
import { Button, Flex, Popover, Typography } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  CloseOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import type { Job, UserJobStatus } from "../types";
import { USER_JOB_STATUS } from "../types";
import { useJobDetail } from "../hooks/useJobDetail";
import { JobDetailContent } from "./JobDetailContent";

interface JobReviewCardProps {
  job: Job;
  currentIndex: number;
  total: number;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
  onStatusChange: (jobId: string, status: UserJobStatus) => void;
  statusLoading: boolean;
}

const SHORTCUTS = [
  { key: "Q / ←", desc: "Previous" },
  { key: "E / →", desc: "Next" },
  { key: "A", desc: "Mark Applied" },
  { key: "D / X", desc: "Mark Irrelevant" },
  { key: "O", desc: "Open original" },
  { key: "Esc", desc: "Back to list" },
];

const ShortcutsHelp = () => (
  <Flex vertical gap={6} style={{ width: 180 }}>
    <Typography.Text strong style={{ fontSize: 12 }}>
      Keyboard shortcuts
    </Typography.Text>
    {SHORTCUTS.map(({ key, desc }) => (
      <Flex key={key} justify="space-between" gap={12}>
        <Typography.Text code style={{ fontSize: 11 }}>
          {key}
        </Typography.Text>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          {desc}
        </Typography.Text>
      </Flex>
    ))}
  </Flex>
);

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
}: JobReviewCardProps) => {
  const { data: detail, isLoading: detailLoading } = useJobDetail(job.jobId);

  const handleApply = useCallback(() => {
    if (job.status !== USER_JOB_STATUS.APPLIED) {
      onStatusChange(job.jobId, USER_JOB_STATUS.APPLIED);
    }
  }, [job, onStatusChange]);

  const handleDecline = useCallback(() => {
    if (job.status !== USER_JOB_STATUS.IRRELEVANT) {
      onStatusChange(job.jobId, USER_JOB_STATUS.IRRELEVANT);
    }
  }, [job, onStatusChange]);

  const handleOpen = useCallback(() => {
    window.open(job.url, "_blank", "noopener,noreferrer");
  }, [job.url]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
        case "o":
        case "O":
          e.preventDefault();
          handleOpen();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleApply, handleDecline, handleOpen]);

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

      <div className="review-card-body">
        <JobDetailContent
          job={job}
          detail={detail}
          detailLoading={detailLoading}
          onStatusChange={onStatusChange}
          statusLoading={statusLoading}
          onOpenOriginal={handleOpen}
        />
      </div>
    </Flex>
  );
};
