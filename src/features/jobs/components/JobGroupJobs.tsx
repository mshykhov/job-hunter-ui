import { useMemo } from "react";

import { LinkOutlined } from "@ant-design/icons";
import { Button, Collapse, Flex, Skeleton, Tag, Typography } from "antd";

import { formatDescription } from "@/lib/formatDescription";

import { getSourceColor } from "../constants";
import { useSourceNames } from "../hooks/useSourceNames";
import type { GroupJob } from "../types";
import { JobEntryContent } from "./JobEntryContent";
import { JobEntryLabel } from "./JobEntryLabel";
import { OutreachSection } from "./OutreachSection";

interface JobGroupJobsProps {
  jobs: GroupJob[];
  groupId: string;
  loading?: boolean;
}

export const JobGroupJobs = ({ jobs, groupId, loading }: JobGroupJobsProps) => {
  const sourceNames = useSourceNames();

  const groupedBySource = useMemo(() => {
    const map = new Map<string, GroupJob[]>();
    for (const job of jobs) {
      const existing = map.get(job.source) ?? [];
      existing.push(job);
      map.set(job.source, existing);
    }
    return map;
  }, [jobs]);

  if (loading) return <Skeleton active paragraph={{ rows: 4 }} />;

  if (!jobs.length) {
    return <Typography.Text type="secondary">No postings available</Typography.Text>;
  }

  const sources = Array.from(groupedBySource.entries());

  // Single source, single job — minimal card, metadata already in group header
  if (jobs.length === 1) {
    const job = jobs[0];
    return (
      <Flex vertical gap={8}>
        <Flex gap={8} align="center">
          <Tag color={getSourceColor(job.source)}>{sourceNames[job.source] ?? job.source}</Tag>
          <Button
            type="link"
            size="small"
            icon={<LinkOutlined />}
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open
          </Button>
        </Flex>
        <OutreachSection job={job} groupId={groupId} />
        {job.description && (
          <div
            className="job-description"
            style={{ fontSize: 13, maxHeight: 400, overflow: "auto" }}
            // eslint-disable-next-line react/no-danger -- sanitized via DOMPurify
            dangerouslySetInnerHTML={{ __html: formatDescription(job.description) }}
          />
        )}
      </Flex>
    );
  }

  // Multiple jobs — group by source, each job is a collapsible item
  // First job in each source group is expanded by default
  const defaultActiveKeys = sources.flatMap(([source, sourceJobs]) =>
    sourceJobs.length > 0 ? [`${source}-${sourceJobs[0].jobId}`] : [],
  );

  const sourceItems = sources.map(([source, sourceJobs]) => {
    const jobItems = sourceJobs.map((job) => ({
      key: `${source}-${job.jobId}`,
      label: <JobEntryLabel job={job} />,
      children: <JobEntryContent job={job} groupId={groupId} />,
    }));

    return { source, sourceJobs, jobItems };
  });

  // Single source with multiple jobs — no source-level grouping needed
  if (sources.length === 1) {
    const { source, jobItems } = sourceItems[0];
    return (
      <Flex vertical gap={4}>
        <Tag color={getSourceColor(source)} style={{ alignSelf: "flex-start" }}>
          {sourceNames[source] ?? source} ({jobItems.length})
        </Tag>
        <Collapse
          size="small"
          defaultActiveKey={defaultActiveKeys}
          items={jobItems}
        />
      </Flex>
    );
  }

  // Multiple sources — source-level accordion, each containing job-level collapse
  const outerItems = sourceItems.map(({ source, sourceJobs, jobItems }) => ({
    key: source,
    label: (
      <Flex gap={8} align="center">
        <Tag color={getSourceColor(source)}>{sourceNames[source] ?? source}</Tag>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          ({sourceJobs.length})
        </Typography.Text>
      </Flex>
    ),
    children: (
      <Collapse
        size="small"
        defaultActiveKey={defaultActiveKeys.filter((k) => k.startsWith(`${source}-`))}
        items={jobItems}
      />
    ),
  }));

  return (
    <Collapse
      ghost
      defaultActiveKey={sources.map(([s]) => s)}
      items={outerItems}
      style={{ marginLeft: -12 }}
    />
  );
};
