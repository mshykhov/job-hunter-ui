import { SyncOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";

import { MATERIAL_KIND, type MaterialKind } from "../types";

interface MaterialGenerationActionsProps {
  hasRevision: boolean;
  regenerate: boolean;
  disabled: boolean;
  loading: boolean;
  onGenerate: (requestedKinds: MaterialKind[], regenerate: boolean) => void;
}

const ALL_KINDS: MaterialKind[] = [
  MATERIAL_KIND.CV_DOCX,
  MATERIAL_KIND.CV_PDF,
  MATERIAL_KIND.COVER_LETTER,
  MATERIAL_KIND.RECRUITER_MESSAGE,
];

const SINGLE_ACTIONS: Array<{ label: string; kinds: MaterialKind[] }> = [
  { label: "Generate CV", kinds: [MATERIAL_KIND.CV_DOCX, MATERIAL_KIND.CV_PDF] },
  { label: "Generate cover letter", kinds: [MATERIAL_KIND.COVER_LETTER] },
  { label: "Generate recruiter message", kinds: [MATERIAL_KIND.RECRUITER_MESSAGE] },
];

export const MaterialGenerationActions = ({
  hasRevision,
  regenerate,
  disabled,
  loading,
  onGenerate,
}: MaterialGenerationActionsProps) => (
  <Space size="small" wrap>
    <Button
      aria-label={hasRevision ? "Regenerate all" : "Generate all"}
      type={hasRevision ? "default" : "primary"}
      size="small"
      icon={hasRevision ? <SyncOutlined /> : <ThunderboltOutlined />}
      loading={loading}
      disabled={disabled}
      onClick={() => onGenerate(ALL_KINDS, regenerate)}
    >
      {hasRevision ? "Regenerate all" : "Generate all"}
    </Button>
    {SINGLE_ACTIONS.map(({ label, kinds }) => (
      <Button
        key={label}
        size="small"
        disabled={disabled}
        loading={loading}
        onClick={() => onGenerate(kinds, regenerate)}
      >
        {label}
      </Button>
    ))}
  </Space>
);
