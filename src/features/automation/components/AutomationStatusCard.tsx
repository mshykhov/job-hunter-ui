import { Card, Flex, Tag, Typography } from "antd";

import type { AutomationComponent, AutomationComponentSnapshot } from "../types";
import { formatAutomationTimestamp, safeReason } from "../utils";

interface AutomationStatusCardProps {
  component: AutomationComponent;
  snapshot?: AutomationComponentSnapshot;
}

export const AutomationStatusCard = ({ component, snapshot }: AutomationStatusCardProps) => {
  return (
    <Card size="small" title={component}>
      {snapshot ? (
        <Flex vertical gap={8}>
          <Tag color={stateColor(snapshot.state)}>{snapshot.state}</Tag>
          <Typography.Text type="secondary">Reason: {safeReason(snapshot.reason)}</Typography.Text>
          <Typography.Text type="secondary">
            Checked: {formatAutomationTimestamp(snapshot.checkedAt)}
          </Typography.Text>
          <Typography.Text type="secondary">Probe: {snapshot.probeVersion}</Typography.Text>
        </Flex>
      ) : (
        <Typography.Text type="secondary">No report</Typography.Text>
      )}
    </Card>
  );
};

const stateColor = (state: AutomationComponentSnapshot["state"]): string => {
  if (state === "READY") return "success";
  if (state === "DEGRADED") return "warning";
  return "error";
};
