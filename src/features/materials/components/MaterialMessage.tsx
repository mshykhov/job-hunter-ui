import { CopyOutlined } from "@ant-design/icons";
import { Button, Flex, message, Typography } from "antd";

interface MaterialMessageProps {
  label: string;
  text: string | undefined;
  loading: boolean;
}

export const MaterialMessage = ({ label, text, loading }: MaterialMessageProps) => {
  const copy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    message.success(`${label} copied`);
  };
  return (
    <Flex vertical gap={4} className="materials-message">
      <Flex justify="space-between" align="center">
        <Typography.Text strong>{label}</Typography.Text>
        <Button
          type="text"
          size="small"
          icon={<CopyOutlined />}
          disabled={!text}
          loading={loading}
          onClick={() => void copy()}
          aria-label={`Copy ${label}`}
        />
      </Flex>
      <Typography.Paragraph
        type={text ? undefined : "secondary"}
        className="materials-message-text"
      >
        {text ?? (loading ? "Loading…" : "Not included in this revision")}
      </Typography.Paragraph>
    </Flex>
  );
};
