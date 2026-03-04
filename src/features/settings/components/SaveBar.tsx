import { Button, Flex, Typography, theme } from "antd";
import { CheckOutlined, SaveOutlined, UndoOutlined } from "@ant-design/icons";

interface SaveBarProps {
  isDirty: boolean;
  saved: boolean;
  saving: boolean;
  onSave: () => void;
  onDiscard: () => void;
  saveDisabled?: boolean;
  saveDisabledReason?: string;
}

export const SaveBar = ({ isDirty, saved, saving, onSave, onDiscard, saveDisabled, saveDisabledReason }: SaveBarProps) => {
  const { token } = theme.useToken();

  return (
    <div className="settings-save-bar" data-visible={isDirty || saved}>
      {saved && !isDirty ? (
        <Flex align="center" justify="center" gap={8}>
          <CheckOutlined style={{ color: token.colorSuccess }} />
          <Typography.Text style={{ color: token.colorSuccess }}>Saved</Typography.Text>
        </Flex>
      ) : (
        <Flex align="center" justify="space-between">
          <Flex vertical gap={2}>
            <Typography.Text type="secondary">Unsaved changes</Typography.Text>
            {saveDisabled && saveDisabledReason && (
              <Typography.Text type="danger" style={{ fontSize: 12 }}>{saveDisabledReason}</Typography.Text>
            )}
          </Flex>
          <Flex gap={8}>
            <Button icon={<UndoOutlined />} onClick={onDiscard}>
              Discard
            </Button>
            <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={onSave} disabled={saveDisabled}>
              Save
            </Button>
          </Flex>
        </Flex>
      )}
    </div>
  );
};
