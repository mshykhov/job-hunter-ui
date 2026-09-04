import { useState } from "react";

import { InfoCircleOutlined, PlusOutlined, SyncOutlined } from "@ant-design/icons";
import { Alert, Badge, Button, Card, Col, Flex, Row, Spin, Typography } from "antd";

import { PERMISSIONS, useAuth } from "@/hooks/useAuth";

import {
  useAutomationRun,
  useAutomationRuns,
  useControlAutomationRun,
  useCreateAutomationRun,
} from "../hooks/useAutomationWorkflows";
import { formatAutomationTimestamp } from "../utils";
import type { WorkflowControlAction } from "../workflowTypes";
import { AutomationRunList } from "./AutomationRunList";
import { AutomationWorkflowDetails } from "./AutomationWorkflowDetails";

export const AutomationWorkflowPanel = () => {
  const { isConfigured, permissions } = useAuth();
  const canWrite = !isConfigured || permissions.includes(PERMISSIONS.WRITE_AUTOMATION);
  const runs = useAutomationRuns();
  const [selectedId, setSelectedId] = useState<string>();
  const activeId = selectedId ?? runs.data?.[0]?.id;
  const selected = useAutomationRun(activeId);
  const create = useCreateAutomationRun();
  const control = useControlAutomationRun();

  const startRun = () => {
    create.mutate(crypto.randomUUID(), { onSuccess: (run) => setSelectedId(run.id) });
  };
  const controlRun = (action: WorkflowControlAction) => {
    if (activeId) control.mutate({ runId: activeId, action });
  };
  const isRefreshing = runs.isFetching || selected.isFetching;
  const updatedAt = Math.max(runs.dataUpdatedAt, selected.dataUpdatedAt);

  return (
    <Card className="automation-workflow-panel">
      <Flex vertical gap={16}>
        <Flex justify="space-between" align="start" gap={12} wrap>
          <div>
            <Typography.Title level={2} className="automation-section-title">
              Workflow operations
            </Typography.Title>
            <Typography.Text type="secondary">
              Start a recovery test, watch the durable queue, and inspect its audit report.
            </Typography.Text>
          </div>
          <Flex vertical align="end" gap={6}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              aria-label="Run recovery test"
              disabled={!canWrite}
              loading={create.isPending}
              onClick={startRun}
            >
              Run recovery test
            </Button>
            <Badge
              status={isRefreshing ? "processing" : "success"}
              text={isRefreshing ? "Updating now" : "Live · every 3-5 seconds"}
            />
            {updatedAt > 0 && (
              <Typography.Text type="secondary" className="automation-refresh-time">
                <SyncOutlined /> Updated{" "}
                {formatAutomationTimestamp(new Date(updatedAt).toISOString())}
              </Typography.Text>
            )}
          </Flex>
        </Flex>
        <Alert
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
          title="Synthetic recovery only"
          description="This test verifies restart recovery and checkpoint integrity. It has no vacancy, browser session, form submission, screenshot, or schedule. New runs enter the durable queue immediately."
        />
        {!canWrite && (
          <Alert
            type="info"
            showIcon
            title="Read-only access"
            description="Workflow controls require write:automation."
          />
        )}
        {runs.error && <Alert type="error" showIcon title="Workflow history is unavailable" />}
        <Row gutter={[20, 20]}>
          <Col xs={24} lg={8}>
            {runs.isLoading ? (
              <Flex justify="center">
                <Spin />
              </Flex>
            ) : runs.data?.length ? (
              <AutomationRunList runs={runs.data} activeId={activeId} onSelect={setSelectedId} />
            ) : (
              <AutomationRunList runs={[]} activeId={activeId} onSelect={setSelectedId} />
            )}
          </Col>
          <Col xs={24} lg={16}>
            {selected.error ? (
              <Alert type="error" showIcon title="The selected run report is unavailable" />
            ) : (
              <AutomationWorkflowDetails
                run={selected.data}
                isLoading={selected.isLoading}
                canWrite={canWrite}
                isControlling={control.isPending}
                onControl={controlRun}
              />
            )}
          </Col>
        </Row>
      </Flex>
    </Card>
  );
};
