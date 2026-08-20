import { SyncOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { Alert, Button, Collapse, Flex, Skeleton, Space, Tag, Typography } from "antd";

import type { GroupJob } from "@/features/jobs/types";

import { ACTIVE_MATERIAL_STATUSES, MATERIAL_STATUS_LABELS } from "../constants";
import {
  useApplicationMaterials,
  useCreateApplicationMaterials,
  useImproveApplicationMaterials,
} from "../hooks/useApplicationMaterials";
import { MATERIAL_STATUS } from "../types";
import { ApplicationPackageRevision } from "./ApplicationPackageRevision";

interface ApplicationPackageSectionProps {
  job: GroupJob;
}

export const ApplicationPackageSection = ({ job }: ApplicationPackageSectionProps) => {
  const { requests, revisions, isLoading } = useApplicationMaterials(job.jobId);
  const create = useCreateApplicationMaterials(job.jobId);
  const improve = useImproveApplicationMaterials(job.jobId);
  const latestRequest = requests.at(0);
  const selectedRevision = revisions.find(({ selected }) => selected) ?? revisions.at(0);
  const active = latestRequest !== undefined && ACTIVE_MATERIAL_STATUSES.has(latestRequest.status);

  const content = isLoading ? (
    <Skeleton active paragraph={{ rows: 2 }} />
  ) : (
    <Flex vertical gap={10}>
      {latestRequest?.status === MATERIAL_STATUS.READY_WITH_FALLBACK && (
        <Alert
          type="warning"
          showIcon
          message="The validated base CV was used for this revision."
        />
      )}
      {latestRequest?.status === MATERIAL_STATUS.BLOCKED && (
        <Alert
          type="error"
          showIcon
          message="A required material failed validation. Regenerate after reviewing the vacancy."
        />
      )}
      {selectedRevision && (
        <ApplicationPackageRevision
          jobId={job.jobId}
          revision={selectedRevision}
          revisions={revisions}
        />
      )}
      {!selectedRevision && !active && (
        <Typography.Text type="secondary">
          Generate a truthful ATS-aligned CV, short cover letter, and recruiter message.
        </Typography.Text>
      )}
      <Space size="small" wrap>
        <Button
          type={selectedRevision ? "default" : "primary"}
          size="small"
          icon={selectedRevision ? <SyncOutlined /> : <ThunderboltOutlined />}
          loading={create.isPending || active}
          disabled={active}
          onClick={() => create.mutate(selectedRevision !== undefined)}
        >
          {selectedRevision ? "Regenerate" : "Generate package"}
        </Button>
        {selectedRevision && (
          <Button
            size="small"
            icon={<ThunderboltOutlined />}
            loading={improve.isPending}
            disabled={active}
            onClick={() => improve.mutate(selectedRevision.id)}
          >
            Improve with Sol
          </Button>
        )}
      </Space>
    </Flex>
  );

  return (
    <Collapse
      size="small"
      className="materials-panel"
      defaultActiveKey={["application-package"]}
      items={[
        {
          key: "application-package",
          label: (
            <Flex align="center" gap={8}>
              <Typography.Text strong>Application package</Typography.Text>
              {latestRequest && (
                <Tag
                  color={
                    active
                      ? "processing"
                      : latestRequest.status === MATERIAL_STATUS.READY
                        ? "success"
                        : "default"
                  }
                >
                  {MATERIAL_STATUS_LABELS[latestRequest.status]}
                </Tag>
              )}
            </Flex>
          ),
          children: content,
        },
      ]}
    />
  );
};
