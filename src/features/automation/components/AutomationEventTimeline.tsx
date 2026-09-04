import { Empty, Flex, Timeline, Typography } from "antd";

import { formatAutomationTimestamp } from "../utils";
import type { WorkflowEvent } from "../workflowTypes";

export const AutomationEventTimeline = ({ events }: { events: WorkflowEvent[] }) =>
  events.length ? (
    <Timeline
      items={events.map((event) => ({
        key: event.id,
        content: (
          <Flex vertical gap={2}>
            <Typography.Text strong>{eventLabel(event.eventType)}</Typography.Text>
            <Typography.Text type="secondary" className="automation-event-meta">
              {event.eventType} · {formatAutomationTimestamp(event.occurredAt)}
            </Typography.Text>
            {Object.keys(event.payload).length > 0 && (
              <Typography.Text code className="automation-event-payload">
                {formatEventPayload(event)}
              </Typography.Text>
            )}
          </Flex>
        ),
      }))}
    />
  ) : (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No audit events yet" />
  );

const formatEventPayload = (event: WorkflowEvent): string =>
  Object.entries(event.payload)
    .map(([key, value]) => `${key}=${value}`)
    .join(" · ");

const eventLabel = (eventType: string): string =>
  ({
    RUN_CREATED: "Run created",
    WORK_CLAIMED: "Worker claimed the run",
    STEP_CHECKPOINTED: "Step checkpointed",
    CHECKPOINT_RECORDED: "Step checkpointed",
    RUN_PAUSED: "Run paused",
    RUN_RESUMED: "Run resumed",
    RUN_STOPPED: "Run stopped",
    RUN_SUCCEEDED: "Run completed",
    RUN_FAILED: "Run failed",
    LEASE_FENCED: "Stale lease fenced",
  })[eventType] ?? "Workflow event";
