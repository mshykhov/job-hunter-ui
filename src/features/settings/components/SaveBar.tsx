import { Button, Flex, Typography, theme } from "antd";
import { CheckOutlined, SaveOutlined, UndoOutlined } from "@ant-design/icons";

interface SaveBarProps {
  isDirty: boolean;
  saved: boolean;
  saving: boolean;
  onSave: () => void;
  onDiscard: () => void;
}

export const SaveBar = ({ isDirty, saved, saving, onSave, onDiscard }: SaveBarProps) => {
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
          <Typography.Text type="secondary">Unsaved changes</Typography.Text>
          <Flex gap={8}>
            <Button icon={<UndoOutlined />} onClick={onDiscard}>
              Discard
            </Button>
            <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={onSave}>
              Save
            </Button>
          </Flex>
        </Flex>
      )}
    </div>
  );
};
