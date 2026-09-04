import { Alert, Col, Descriptions, Flex, Row, Spin, Typography } from "antd";
import { isAxiosError } from "axios";

import { useAutomationStatus } from "../hooks/useAutomationStatus";
import { AUTOMATION_COMPONENTS, type AutomationState } from "../types";
import { formatAutomationTimestamp, safeReason } from "../utils";
import { AutomationStatusCard } from "./AutomationStatusCard";
import { AutomationWorkflowPanel } from "./AutomationWorkflowPanel";

export const AutomationPage = () => {
  const { data, isLoading, error } = useAutomationStatus();

  if (isLoading) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: 320 }}>
        <Spin size="large" />
      </Flex>
    );
  }

  if (error || !data) {
    const forbidden = isAxiosError(error) && error.response?.status === 403;
    return (
      <Alert
        type="error"
        showIcon
        title={forbidden ? "Access denied" : "Automation status is unavailable"}
        description={
          forbidden
            ? "This page is available only to the configured owner."
            : "The private status endpoint could not be reached."
        }
      />
    );
  }

  return (
    <Flex vertical gap={16}>
      <Typography.Title level={4} style={{ margin: 0 }}>
        Automation
      </Typography.Title>
      <Alert
        type={alertType(data.state)}
        showIcon
        title={data.enabled ? stateMessage(data.state) : "Automation is disabled"}
        description={`Reason: ${safeReason(data.reason)}`}
      />
      <Descriptions bordered size="small" column={{ xs: 1, sm: 2, lg: 4 }}>
        <Descriptions.Item label="Last heartbeat">
          {formatAutomationTimestamp(data.lastHeartbeatAt)}
        </Descriptions.Item>
        <Descriptions.Item label="Last preflight">
          {formatAutomationTimestamp(data.lastPreflightSuccessAt)}
        </Descriptions.Item>
        <Descriptions.Item label="Last Codex canary">
          {formatAutomationTimestamp(data.lastCodexSuccessAt)}
        </Descriptions.Item>
        <Descriptions.Item label="Launcher version">
          {data.launcherVersion ?? "Unknown"}
        </Descriptions.Item>
      </Descriptions>
      <Row gutter={[16, 16]}>
        {AUTOMATION_COMPONENTS.map((component) => (
          <Col key={component} xs={24} sm={12} xl={6}>
            <AutomationStatusCard component={component} snapshot={data.components[component]} />
          </Col>
        ))}
      </Row>
      <AutomationWorkflowPanel />
    </Flex>
  );
};

const stateMessage = (state: AutomationState): string => {
  if (state === "READY") return "Automation is ready";
  if (state === "DEGRADED") return "Automation is degraded";
  if (state === "AUTH_REQUIRED") return "Authentication is required";
  return "Automation is unavailable";
};

const alertType = (state: AutomationState) => {
  if (state === "READY") return "success" as const;
  if (state === "DEGRADED") return "warning" as const;
  return "error" as const;
};
