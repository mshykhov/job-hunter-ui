import { ExperimentOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Descriptions,
  Empty,
  Flex,
  Popconfirm,
  Progress,
  Space,
  Spin,
  Tag,
  Typography,
} from "antd";

import { formatAutomationTimestamp } from "../utils";
import type { WorkflowControlAction, WorkflowRun, WorkflowStatus } from "../workflowTypes";
import { workflowStatusColor, workflowStatusLabel } from "../workflowUtils";
import { AutomationRunReportSections } from "./AutomationRunReportSections";

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
  if (isLoading) {
    return (
      <Flex justify="center" className="automation-report-loading">
        <Spin />
      </Flex>
    );
  }
  if (!run) return <Empty description="Select a run to inspect its report" />;

  const actions = availableActions(run.status);
  return (
    <Card
      size="small"
      className="automation-run-report"
      title={
        <Flex align="center" gap={8}>
          <ExperimentOutlined />
          <span>Synthetic recovery report</span>
        </Flex>
      }
      extra={<Tag color={workflowStatusColor(run.status)}>{workflowStatusLabel(run.status)}</Tag>}
    >
      <Flex vertical gap={16}>
        <Alert
          type="info"
          showIcon
          title="No vacancy is associated with this run"
          description="The report covers a deterministic infrastructure test. Vacancy details, browser screenshots, and application evidence will belong to future vacancy workflow types."
        />
        <Progress
          steps={3}
          percent={(run.completedSteps / 3) * 100}
          format={() => `${run.completedSteps}/3 steps`}
          aria-label="Recovery run progress"
        />
        <Descriptions size="small" bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="Workflow">Synthetic recovery</Descriptions.Item>
          <Descriptions.Item label="Trigger">Manual</Descriptions.Item>
          <Descriptions.Item label="Vacancy">Not applicable</Descriptions.Item>
          <Descriptions.Item label="Work item">{run.workItemStatus}</Descriptions.Item>
          <Descriptions.Item label="Created">
            {formatAutomationTimestamp(run.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Updated">
            {formatAutomationTimestamp(run.updatedAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Run ID" span={{ xs: 1, sm: 2 }}>
            <Typography.Text copyable={{ text: run.id }} code className="automation-technical-id">
              {run.id}
            </Typography.Text>
          </Descriptions.Item>
          {run.failureCode && (
            <Descriptions.Item label="Failure" span={{ xs: 1, sm: 2 }}>
              <Typography.Text type="danger" code>
                {run.failureCode}
              </Typography.Text>
              {run.failureDetail ? ` ${run.failureDetail}` : ""}
            </Descriptions.Item>
          )}
        </Descriptions>
        {actions.length > 0 && (
          <Space wrap>
            {actions.map((action) =>
              action === "stop" ? (
                <Popconfirm
                  key={action}
                  title="Stop this run?"
                  description="A stopped run is terminal and cannot be resumed."
                  okText="Stop run"
                  okButtonProps={{ danger: true }}
                  onConfirm={() => onControl(action)}
                >
                  <Button danger disabled={!canWrite} loading={isControlling}>
                    Stop
                  </Button>
                </Popconfirm>
              ) : (
                <Button
                  key={action}
                  disabled={!canWrite}
                  loading={isControlling}
                  onClick={() => onControl(action)}
                >
                  {actionLabel(action)}
                </Button>
              )
            )}
          </Space>
        )}
        <AutomationRunReportSections run={run} />
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
