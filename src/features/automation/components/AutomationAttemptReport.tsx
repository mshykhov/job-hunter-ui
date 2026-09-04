import { Descriptions, Empty, Flex, Tag, Typography } from "antd";

import { formatAutomationTimestamp } from "../utils";
import type { WorkflowRun } from "../workflowTypes";

export const AutomationAttemptReport = ({ run }: { run: WorkflowRun }) =>
  run.attempts.length ? (
    <Flex vertical gap={12}>
      {run.attempts.map((attempt) => (
        <div key={attempt.id} className="automation-report-entry">
          <Descriptions size="small" column={{ xs: 1, sm: 2 }} className="automation-report-row">
            <Descriptions.Item label="Attempt">#{attempt.attemptNumber}</Descriptions.Item>
            <Descriptions.Item label="Outcome">
              <Tag>{attempt.outcome}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Runner generation">
              {attempt.runnerGeneration}
            </Descriptions.Item>
            <Descriptions.Item label="Worker">{attempt.workerId}</Descriptions.Item>
            <Descriptions.Item label="Started">
              {formatAutomationTimestamp(attempt.startedAt)}
            </Descriptions.Item>
            <Descriptions.Item label="Last heartbeat">
              {formatAutomationTimestamp(attempt.lastHeartbeatAt)}
            </Descriptions.Item>
            {attempt.finishedAt && (
              <Descriptions.Item label="Finished">
                {formatAutomationTimestamp(attempt.finishedAt)}
              </Descriptions.Item>
            )}
            {attempt.failureCode && (
              <Descriptions.Item label="Failure">
                <Typography.Text type="danger">{attempt.failureCode}</Typography.Text>
              </Descriptions.Item>
            )}
          </Descriptions>
        </div>
      ))}
    </Flex>
  ) : (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No attempts yet" />
  );
