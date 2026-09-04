import { useState } from "react";

import { Alert, Button, Card, Col, Empty, Flex, Row, Spin, Tag, Typography } from "antd";

import { PERMISSIONS, useAuth } from "@/hooks/useAuth";

import {
  useAutomationRun,
  useAutomationRuns,
  useControlAutomationRun,
  useCreateAutomationRun,
} from "../hooks/useAutomationWorkflows";
import type { WorkflowControlAction } from "../workflowTypes";
import { workflowStatusColor } from "../workflowUtils";
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

  return (
    <Card>
      <Flex vertical gap={16}>
        <Flex justify="space-between" align="center" gap={8} wrap>
          <Typography.Title level={5} style={{ margin: 0 }}>
            Durable recovery
          </Typography.Title>
          <Button type="primary" disabled={!canWrite} loading={create.isPending} onClick={startRun}>
            Start recovery drill
          </Button>
        </Flex>
        {!canWrite && (
          <Alert
            type="info"
            showIcon
            title="Read-only access"
            description="Workflow controls require write:automation."
          />
        )}
        {runs.error && <Alert type="error" showIcon title="Workflow history is unavailable" />}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={9}>
            {runs.isLoading ? (
              <Flex justify="center">
                <Spin />
              </Flex>
            ) : runs.data?.length ? (
              <Flex vertical gap={8}>
                {runs.data.map((run) => (
                  <Button
                    key={run.id}
                    type={run.id === activeId ? "primary" : "text"}
                    block
                    onClick={() => setSelectedId(run.id)}
                  >
                    <Flex justify="space-between" align="center">
                      <Typography.Text>Recovery {run.id.slice(0, 8)}</Typography.Text>
                      <Tag color={workflowStatusColor(run.status)}>{run.status}</Tag>
                    </Flex>
                  </Button>
                ))}
              </Flex>
            ) : (
              <Empty description="No recovery runs" />
            )}
          </Col>
          <Col xs={24} lg={15}>
            <AutomationWorkflowDetails
              run={selected.data}
              isLoading={selected.isLoading}
              canWrite={canWrite}
              isControlling={control.isPending}
              onControl={controlRun}
            />
          </Col>
        </Row>
      </Flex>
    </Card>
  );
};
