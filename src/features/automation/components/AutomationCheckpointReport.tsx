import { Empty, Flex, Tag, Typography } from "antd";

import { formatAutomationTimestamp } from "../utils";
import type { WorkflowRun } from "../workflowTypes";
import { workflowStepLabel } from "../workflowUtils";

export const AutomationCheckpointReport = ({ run }: { run: WorkflowRun }) => (
  <Flex vertical gap={12}>
    <Typography.Text type="secondary">
      Each completed step stores a SHA-256 integrity digest. This synthetic workflow does not
      capture screenshots.
    </Typography.Text>
    {run.checkpoints.length ? (
      <Flex vertical gap={12}>
        {run.checkpoints.map((checkpoint) => (
          <div key={checkpoint.id} className="automation-report-entry">
            <Flex vertical gap={6} className="automation-checkpoint">
              <Flex align="center" gap={8} wrap>
                <Tag color="success">{workflowStepLabel(checkpoint.step)}</Tag>
                <Typography.Text type="secondary">
                  {formatAutomationTimestamp(checkpoint.createdAt)}
                </Typography.Text>
              </Flex>
              <Typography.Text
                copyable={{ text: checkpoint.evidenceSha256 }}
                code
                className="automation-evidence-hash"
              >
                {checkpoint.evidenceSha256}
              </Typography.Text>
            </Flex>
          </div>
        ))}
      </Flex>
    ) : (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No checkpoints yet" />
    )}
  </Flex>
);
