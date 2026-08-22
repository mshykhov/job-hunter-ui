import { ThunderboltOutlined } from "@ant-design/icons";
import { Alert, Button, Collapse, Flex, Skeleton, Tag, Typography } from "antd";

import type { GroupJob } from "@/features/jobs/types";

import { ACTIVE_MATERIAL_STATUSES, MATERIAL_STATUS_LABELS } from "../constants";
import {
  useApplicationMaterials,
  useCandidateProfiles,
  useCreateApplicationMaterials,
  useImproveApplicationMaterials,
} from "../hooks/useApplicationMaterials";
import { MATERIAL_STATUS } from "../types";
import { ApplicationPackageRevision } from "./ApplicationPackageRevision";
import { MaterialGenerationActions } from "./MaterialGenerationActions";

interface ApplicationPackageSectionProps {
  job: GroupJob;
}

export const ApplicationPackageSection = ({ job }: ApplicationPackageSectionProps) => {
  const { requests, revisions, isLoading } = useApplicationMaterials(job.jobId);
  const profiles = useCandidateProfiles();
  const create = useCreateApplicationMaterials(job.jobId);
  const improve = useImproveApplicationMaterials(job.jobId);
  const latestRequest = requests.at(0);
  const selectedRevision = revisions.find(({ selected }) => selected) ?? revisions.at(0);
  const active = latestRequest !== undefined && ACTIVE_MATERIAL_STATUSES.has(latestRequest.status);

  const hasActiveProfile = profiles.profiles.some(({ active: isActive }) => isActive);
  const content =
    isLoading || profiles.isLoading ? (
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
        {!hasActiveProfile && (
          <Alert
            type="error"
            showIcon
            title="Candidate profile is not initialized. Start the private runner to import it automatically."
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
        <MaterialGenerationActions
          hasRevision={selectedRevision !== undefined}
          regenerate={requests.length > 0}
          loading={create.isPending || active}
          disabled={active || !hasActiveProfile}
          onGenerate={(requestedKinds, regenerate) => create.mutate({ requestedKinds, regenerate })}
        />
        <Flex>
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
        </Flex>
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
