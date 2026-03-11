import { Flex, Typography } from "antd";

import { sanitizeHtml } from "@/lib/sanitize";

import type { GroupJob } from "../types";
import { OutreachSection } from "./OutreachSection";

interface JobEntryContentProps {
  job: GroupJob;
  groupId: string;
}

export const JobEntryContent = ({ job, groupId }: JobEntryContentProps) => (
  <Flex vertical gap={8}>
    <OutreachSection job={job} groupId={groupId} />
    {job.description ? (
      <div
        className="job-description"
        style={{ fontSize: 13, maxHeight: 400, overflow: "auto" }}
        // eslint-disable-next-line react/no-danger -- sanitized via DOMPurify
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(job.description) }}
      />
    ) : (
      <Typography.Text type="secondary" style={{ fontSize: 13 }}>
        No description available
      </Typography.Text>
    )}
  </Flex>
);
