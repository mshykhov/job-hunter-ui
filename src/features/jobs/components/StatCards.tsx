import { Card, Flex, Statistic } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";
import type { UserJobStatus } from "../types";
import { USER_JOB_STATUS } from "../types";

interface StatCardsProps {
  statusCounts: Partial<Record<UserJobStatus, number>>;
  total: number;
}

export const StatCards = ({ statusCounts, total }: StatCardsProps) => {
  const newCount = statusCounts[USER_JOB_STATUS.NEW] ?? 0;

  return (
    <Flex gap={16} wrap="wrap">
      <Card size="small" style={{ flex: 1, minWidth: 140 }}>
        <Statistic title="Total Jobs" value={total} />
      </Card>
      <Card size="small" style={{ flex: 1, minWidth: 140 }}>
        <Statistic
          title="New"
          value={newCount}
          valueStyle={{ color: "#1677ff" }}
          prefix={newCount > 0 ? <ArrowUpOutlined /> : undefined}
        />
      </Card>
      <Card size="small" style={{ flex: 1, minWidth: 140 }}>
        <Statistic
          title="Applied"
          value={statusCounts[USER_JOB_STATUS.APPLIED] ?? 0}
          valueStyle={{ color: "#52c41a" }}
        />
      </Card>
      <Card size="small" style={{ flex: 1, minWidth: 140 }}>
        <Statistic title="Irrelevant" value={statusCounts[USER_JOB_STATUS.IRRELEVANT] ?? 0} />
      </Card>
    </Flex>
  );
};
