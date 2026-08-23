import { Flex, Typography } from "antd";

import { ApplicationPackageSection } from "@/features/materials/components/ApplicationPackageSection";
import { formatDescription } from "@/lib/formatDescription";

import type { GroupJob } from "../types";

interface JobEntryContentProps {
  job: GroupJob;
}

export const JobEntryContent = ({ job }: JobEntryContentProps) => (
  <Flex vertical gap={8}>
    <ApplicationPackageSection job={job} />
    {job.description ? (
      <div
        className="job-description"
        // eslint-disable-next-line react/no-danger -- sanitized via DOMPurify
        dangerouslySetInnerHTML={{ __html: formatDescription(job.description) }}
      />
    ) : (
      <Typography.Text type="secondary" style={{ fontSize: 13 }}>
        No description available
      </Typography.Text>
    )}
  </Flex>
);
