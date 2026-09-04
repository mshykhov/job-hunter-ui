import type { ReactNode } from "react";

import { ClockCircleOutlined, HistoryOutlined } from "@ant-design/icons";
import { Empty, Flex, Tag, Typography } from "antd";

import type { WorkflowRunSummary } from "../workflowTypes";
import { isActionableWorkflow, workflowStatusColor, workflowStatusLabel } from "../workflowUtils";

interface AutomationRunListProps {
  runs: WorkflowRunSummary[];
  activeId?: string;
  onSelect: (runId: string) => void;
}

export const AutomationRunList = ({ runs, activeId, onSelect }: AutomationRunListProps) => {
  const actionable = runs.filter((run) => isActionableWorkflow(run.status));
  const history = runs.filter((run) => !isActionableWorkflow(run.status));

  return (
    <Flex vertical gap={16}>
      <RunGroup
        title="Queue"
        icon={<ClockCircleOutlined />}
        runs={actionable}
        activeId={activeId}
        empty="Queue is clear"
        onSelect={onSelect}
      />
      <RunGroup
        title="History"
        icon={<HistoryOutlined />}
        runs={history}
        activeId={activeId}
        empty="No completed runs"
        onSelect={onSelect}
      />
    </Flex>
  );
};

interface RunGroupProps extends AutomationRunListProps {
  title: string;
  icon: ReactNode;
  empty: string;
}

const RunGroup = ({ title, icon, runs, activeId, empty, onSelect }: RunGroupProps) => (
  <section aria-labelledby={`automation-${title.toLowerCase()}-title`}>
    <Flex align="center" justify="space-between" className="automation-run-group-title">
      <Typography.Text id={`automation-${title.toLowerCase()}-title`} strong>
        {icon} {title}
      </Typography.Text>
      <Tag>{runs.length}</Tag>
    </Flex>
    {runs.length ? (
      <Flex vertical gap={6}>
        {runs.map((run) => (
          <button
            key={run.id}
            type="button"
            className="automation-run-item"
            data-selected={run.id === activeId}
            aria-pressed={run.id === activeId}
            onClick={() => onSelect(run.id)}
          >
            <Flex vertical gap={4}>
              <Flex justify="space-between" align="center" gap={8}>
                <Typography.Text strong>Synthetic recovery</Typography.Text>
                <Tag color={workflowStatusColor(run.status)}>{workflowStatusLabel(run.status)}</Tag>
              </Flex>
              <Flex justify="space-between" align="center" gap={8}>
                <Typography.Text type="secondary" className="automation-run-meta">
                  Manual · {run.id.slice(0, 8)}
                </Typography.Text>
                <Typography.Text type="secondary" className="automation-run-progress">
                  {run.completedSteps}/3 steps
                </Typography.Text>
              </Flex>
            </Flex>
          </button>
        ))}
      </Flex>
    ) : (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={empty}
        className="automation-empty"
      />
    )}
  </section>
);
