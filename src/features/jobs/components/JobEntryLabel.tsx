import { LinkOutlined } from "@ant-design/icons";
import { Button, Flex, Typography } from "antd";

import { formatRelativeDate } from "../constants";
import type { GroupJob } from "../types";

interface JobEntryLabelProps {
  job: GroupJob;
}

export const JobEntryLabel = ({ job }: JobEntryLabelProps) => (
  <Flex gap={8} align="center">
    {job.location && (
      <Typography.Text type="secondary" style={{ fontSize: 13 }} ellipsis>
        {job.location}
      </Typography.Text>
    )}
    {job.salary && (
      <Typography.Text style={{ fontSize: 13, flexShrink: 0 }}>{job.salary}</Typography.Text>
    )}
    <Typography.Text type="secondary" style={{ fontSize: 11, flexShrink: 0 }}>
      {formatRelativeDate(job.publishedAt)}
    </Typography.Text>
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
  </Flex>
);
