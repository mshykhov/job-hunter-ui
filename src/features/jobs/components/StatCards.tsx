import { Card, Flex, Statistic } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";
import type { Job } from "../types";
import { USER_JOB_STATUS } from "../types";
import { countByStatus } from "../hooks/useJobs";

interface StatCardsProps {
  jobs: Job[];
}

export const StatCards = ({ jobs }: StatCardsProps) => {
  const counts = countByStatus(jobs);
  const newToday = jobs.filter((j) => {
    const created = new Date(j.createdAt);
    const today = new Date();
    return created.toDateString() === today.toDateString();
  }).length;

  return (
    <Flex gap={16} wrap="wrap">
      <Card size="small" style={{ flex: 1, minWidth: 140 }}>
        <Statistic title="Total Jobs" value={jobs.length} />
      </Card>
      <Card size="small" style={{ flex: 1, minWidth: 140 }}>
        <Statistic
          title="New Today"
          value={newToday}
          valueStyle={{ color: "#52c41a" }}
          prefix={newToday > 0 ? <ArrowUpOutlined /> : undefined}
        />
      </Card>
      <Card size="small" style={{ flex: 1, minWidth: 140 }}>
        <Statistic
          title="Applied"
          value={counts[USER_JOB_STATUS.APPLIED] ?? 0}
          valueStyle={{ color: "#4F46E5" }}
        />
      </Card>
      <Card size="small" style={{ flex: 1, minWidth: 140 }}>
        <Statistic title="Irrelevant" value={counts[USER_JOB_STATUS.IRRELEVANT] ?? 0} />
      </Card>
    </Flex>
  );
};
