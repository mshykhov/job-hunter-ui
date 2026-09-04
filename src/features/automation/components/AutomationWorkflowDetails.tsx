import {
  Button,
  Card,
  Collapse,
  Descriptions,
  Empty,
  Flex,
  Progress,
  Space,
  Spin,
  Tag,
  Timeline,
  Typography,
} from "antd";

import { formatAutomationTimestamp } from "../utils";
import type { WorkflowControlAction, WorkflowRun, WorkflowStatus } from "../workflowTypes";
import { workflowStatusColor } from "../workflowUtils";

interface AutomationWorkflowDetailsProps {
  run?: WorkflowRun;
  isLoading: boolean;
  canWrite: boolean;
  isControlling: boolean;
  onControl: (action: WorkflowControlAction) => void;
}

export const AutomationWorkflowDetails = ({
  run,
  isLoading,
  canWrite,
  isControlling,
  onControl,
}: AutomationWorkflowDetailsProps) => {
  if (isLoading) return <Spin />;
  if (!run) return <Empty description="Select a recovery run" />;

  const actions = availableActions(run.status);
  return (
    <Card
      size="small"
      title="Run details"
      extra={<Tag color={workflowStatusColor(run.status)}>{run.status}</Tag>}
    >
      <Flex vertical gap={16}>
        <Progress
          steps={3}
          percent={(run.completedSteps / 3) * 100}
          format={() => `${run.completedSteps}/3`}
          aria-label="Recovery run progress"
        />
        <Descriptions size="small" column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="Work item">{run.workItemStatus}</Descriptions.Item>
          <Descriptions.Item label="Attempts">{run.attemptCount}</Descriptions.Item>
          <Descriptions.Item label="Created">
            {formatAutomationTimestamp(run.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Updated">
            {formatAutomationTimestamp(run.updatedAt)}
          </Descriptions.Item>
          {run.failureCode && (
            <Descriptions.Item label="Failure" span={2}>
              <Typography.Text type="danger" code>
                {run.failureCode}
              </Typography.Text>
              {run.failureDetail ? ` ${run.failureDetail}` : ""}
            </Descriptions.Item>
          )}
        </Descriptions>
        {actions.length > 0 && (
          <Space wrap>
            {actions.map((action) => (
              <Button
                key={action}
                type={action === "stop" ? "primary" : "default"}
                danger={action === "stop"}
                style={action === "stop" ? { backgroundColor: "#A61D24" } : undefined}
                disabled={!canWrite}
                loading={isControlling}
                onClick={() => onControl(action)}
              >
                {actionLabel(action)}
              </Button>
            ))}
          </Space>
        )}
        <Collapse
          size="small"
          items={[
            {
              key: "attempts",
              label: `Attempts (${run.attempts.length})`,
              children: run.attempts.length ? (
                <Descriptions size="small" column={1}>
                  {run.attempts.map((attempt) => (
                    <Descriptions.Item
                      key={attempt.id}
                      label={`#${attempt.attemptNumber} ${attempt.outcome}`}
                    >
                      Generation {attempt.runnerGeneration}, heartbeat{" "}
                      {formatAutomationTimestamp(attempt.lastHeartbeatAt)}
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No attempts" />
              ),
            },
            {
              key: "checkpoints",
              label: `Checkpoints (${run.checkpoints.length})`,
              children: run.checkpoints.length ? (
                <Space direction="vertical">
                  {run.checkpoints.map((checkpoint) => (
                    <Typography.Text key={checkpoint.id}>
                      {checkpoint.step}:{" "}
                      <Typography.Text code>
                        {checkpoint.evidenceSha256.slice(0, 12)}
                      </Typography.Text>
                    </Typography.Text>
                  ))}
                </Space>
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No checkpoints" />
              ),
            },
          ]}
        />
        <Timeline
          items={run.events.map((event) => ({
            key: event.id,
            content: `${event.eventType} · ${formatAutomationTimestamp(event.occurredAt)}`,
          }))}
        />
      </Flex>
    </Card>
  );
};

const availableActions = (status: WorkflowStatus): WorkflowControlAction[] => {
  if (status === "PAUSED") return ["resume", "stop"];
  if (status === "QUEUED" || status === "RUNNING") return ["pause", "stop"];
  return [];
};

const actionLabel = (action: WorkflowControlAction): string =>
  ({ pause: "Pause", resume: "Resume", stop: "Stop" })[action];
