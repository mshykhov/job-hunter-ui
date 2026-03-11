import { useState } from "react";

import { RobotOutlined, UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd";
import { App,Button, Flex, Input, Typography, Upload } from "antd";

import { CV_ACCEPTED_FORMATS, CV_MAX_SIZE_MB } from "../constants";
import { SaveBar } from "./SaveBar";

interface AboutCardProps {
  about: string | null;
  onAboutChange: (value: string | null) => void;
  onDiscard: () => void;
  onSaveText: () => void;
  onUploadFile: (file: File) => void;
  onGenerate: () => void;
  saving: boolean;
  generating: boolean;
  aboutDirty: boolean;
  aboutSaved: boolean;
}

export const AboutCard = ({
  about,
  onAboutChange,
  onDiscard,
  onSaveText,
  onUploadFile,
  onGenerate,
  saving,
  generating,
  aboutDirty,
  aboutSaved,
}: AboutCardProps) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { message } = App.useApp();

  const hasFile = fileList.length > 0;
  const hasText = !!about?.trim();

  const handleUpload = () => {
    if (hasFile && fileList[0].originFileObj) {
      onUploadFile(fileList[0].originFileObj);
      setFileList([]);
    }
  };

  return (
    <Flex vertical gap={12}>
      <Input.TextArea
        rows={3}
        placeholder="e.g. Senior Kotlin developer, remote, Spring Boot, no frontend work..."
        value={about ?? ""}
        onChange={(e) => onAboutChange(e.target.value || null)}
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
            setFileList([{ ...file, uid: file.uid, name: file.name, originFileObj: file } as UploadFile]);
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
        {hasFile && (
          <Button size="small" type="primary" loading={saving} onClick={handleUpload}>
            Save File
          </Button>
        )}
      </Flex>
      <SaveBar
        isDirty={aboutDirty && !hasFile}
        saved={aboutSaved}
        saving={saving}
        onSave={onSaveText}
        onDiscard={onDiscard}
      />
      <div>
        <Button
          icon={<RobotOutlined />}
          loading={generating}
          onClick={onGenerate}
          disabled={!about?.trim()}
        >
          Generate Preferences
        </Button>
      </div>
    </Flex>
  );
};
