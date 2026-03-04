import { useState } from "react";
import { Button, Flex, Input, Typography, Upload, App } from "antd";
import { RobotOutlined, UploadOutlined } from "@ant-design/icons";
import { CV_ACCEPTED_FORMATS, CV_MAX_SIZE_MB } from "../constants";
import type { UploadFile } from "antd";

interface NormalizeCardProps {
  rawInput: string | null;
  onRawInputChange: (value: string | null) => void;
  onNormalizeText: (rawInput: string) => void;
  onNormalizeFile: (file: File) => void;
  normalizing: boolean;
}

export const NormalizeCard = ({
  rawInput,
  onRawInputChange,
  onNormalizeText,
  onNormalizeFile,
  normalizing,
}: NormalizeCardProps) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { message } = App.useApp();

  const hasFile = fileList.length > 0;
  const hasText = !!rawInput?.trim();
  const canNormalize = hasFile || hasText;

  const handleNormalize = () => {
    if (hasFile && fileList[0].originFileObj) {
      onNormalizeFile(fileList[0].originFileObj);
    } else if (hasText) {
      onNormalizeText(rawInput!);
    }
  };

  return (
    <Flex vertical gap={12}>
      <Input.TextArea
        rows={3}
        placeholder="e.g. Senior Kotlin developer, remote, Spring Boot, no frontend work..."
        value={rawInput ?? ""}
        onChange={(e) => onRawInputChange(e.target.value || null)}
        disabled={hasFile}
      />
      <Flex align="center" gap={12} wrap="wrap">
        <Upload
          accept={CV_ACCEPTED_FORMATS}
          maxCount={1}
          fileList={fileList}
          beforeUpload={(file) => {
            if (file.size > CV_MAX_SIZE_MB * 1024 * 1024) {
              message.error(`File must be smaller than ${CV_MAX_SIZE_MB}MB`);
              return Upload.LIST_IGNORE;
            }
            return false;
          }}
          onChange={({ fileList: list }) => setFileList(list)}
          onRemove={() => setFileList([])}
        >
          <Button icon={<UploadOutlined />} size="small" disabled={hasText}>
            Upload CV
          </Button>
        </Upload>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          PDF, DOC or DOCX, max {CV_MAX_SIZE_MB}MB
        </Typography.Text>
      </Flex>
      <div>
        <Button
          icon={<RobotOutlined />}
          loading={normalizing}
          onClick={handleNormalize}
          disabled={!canNormalize}
        >
          Normalize with AI
        </Button>
      </div>
    </Flex>
  );
};
