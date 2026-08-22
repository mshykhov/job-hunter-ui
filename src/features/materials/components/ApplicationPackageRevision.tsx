import { FilePdfOutlined, FileWordOutlined } from "@ant-design/icons";
import { Button, Flex, Select, Space } from "antd";

import {
  downloadMaterialArtifact,
  useMaterialText,
  useSelectMaterialRevision,
} from "../hooks/useApplicationMaterials";
import { MATERIAL_KIND, type MaterialRevision } from "../types";
import { MaterialMessage } from "./MaterialMessage";

interface ApplicationPackageRevisionProps {
  jobId: string;
  revision: MaterialRevision;
  revisions: MaterialRevision[];
}

export const ApplicationPackageRevision = ({
  jobId,
  revision,
  revisions,
}: ApplicationPackageRevisionProps) => {
  const select = useSelectMaterialRevision(jobId);
  const coverLetter = useMaterialText(
    revision.id,
    MATERIAL_KIND.COVER_LETTER,
    revision.artifacts.some(({ kind }) => kind === MATERIAL_KIND.COVER_LETTER)
  );
  const recruiterMessage = useMaterialText(
    revision.id,
    MATERIAL_KIND.RECRUITER_MESSAGE,
    revision.artifacts.some(({ kind }) => kind === MATERIAL_KIND.RECRUITER_MESSAGE)
  );
  const hasCv = revision.artifacts.some(({ kind }) => kind === MATERIAL_KIND.CV_PDF);
  const hasCoverLetter = revision.artifacts.some(({ kind }) => kind === MATERIAL_KIND.COVER_LETTER);
  const hasRecruiterMessage = revision.artifacts.some(
    ({ kind }) => kind === MATERIAL_KIND.RECRUITER_MESSAGE
  );

  return (
    <>
      <Flex justify="space-between" gap={8} wrap="wrap">
        <Select
          size="small"
          value={revision.id}
          options={revisions.map((item) => ({
            value: item.id,
            label: `Revision ${item.revisionNumber} · ${item.generatorModel ?? item.origin}`,
          }))}
          onChange={(revisionId) => select.mutate(revisionId)}
          loading={select.isPending}
          aria-label="Selected application package revision"
        />
        {hasCv && (
          <Space size="small">
            <Button
              size="small"
              icon={<FilePdfOutlined />}
              onClick={() => void downloadMaterialArtifact(revision.id, MATERIAL_KIND.CV_PDF)}
            >
              PDF
            </Button>
            <Button
              size="small"
              icon={<FileWordOutlined />}
              onClick={() => void downloadMaterialArtifact(revision.id, MATERIAL_KIND.CV_DOCX)}
            >
              DOCX
            </Button>
          </Space>
        )}
      </Flex>
      {hasCoverLetter && (
        <MaterialMessage
          label="Cover letter"
          text={coverLetter.data}
          loading={coverLetter.isLoading}
        />
      )}
      {hasRecruiterMessage && (
        <MaterialMessage
          label="Recruiter message"
          text={recruiterMessage.data}
          loading={recruiterMessage.isLoading}
        />
      )}
    </>
  );
};
