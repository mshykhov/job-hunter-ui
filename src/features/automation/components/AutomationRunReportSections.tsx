import { AuditOutlined, CheckCircleOutlined, FileSearchOutlined } from "@ant-design/icons";
import { Collapse } from "antd";

import type { WorkflowRun } from "../workflowTypes";
import { AutomationAttemptReport } from "./AutomationAttemptReport";
import { AutomationCheckpointReport } from "./AutomationCheckpointReport";
import { AutomationEventTimeline } from "./AutomationEventTimeline";

export const AutomationRunReportSections = ({ run }: { run: WorkflowRun }) => (
  <Collapse
    size="small"
    defaultActiveKey={["attempts"]}
    items={[
      {
        key: "attempts",
        label: (
          <span>
            <AuditOutlined /> Attempts ({run.attempts.length})
          </span>
        ),
        children: <AutomationAttemptReport run={run} />,
      },
      {
        key: "checkpoints",
        label: (
          <span>
            <CheckCircleOutlined /> Checkpoint evidence ({run.checkpoints.length})
          </span>
        ),
        children: <AutomationCheckpointReport run={run} />,
      },
      {
        key: "timeline",
        label: (
          <span>
            <FileSearchOutlined /> Audit timeline ({run.events.length})
          </span>
        ),
        children: <AutomationEventTimeline events={run.events} />,
      },
    ]}
  />
);
