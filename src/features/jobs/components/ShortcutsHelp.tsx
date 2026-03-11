import { Flex, Typography } from "antd";

const SHORTCUTS = [
  { key: "Q / \u2190", desc: "Previous" },
  { key: "E / \u2192", desc: "Next" },
  { key: "A", desc: "Mark Applied" },
  { key: "D / X", desc: "Mark Irrelevant" },
  { key: "R", desc: "Reset to New" },
  { key: "Esc", desc: "Back to list" },
];

export const ShortcutsHelp = () => (
  <Flex vertical gap={6} style={{ width: 180 }}>
    <Typography.Text strong style={{ fontSize: 12 }}>
      Keyboard shortcuts
    </Typography.Text>
    {SHORTCUTS.map(({ key, desc }) => (
      <Flex key={key} justify="space-between" gap={12}>
        <Typography.Text code style={{ fontSize: 11 }}>
          {key}
        </Typography.Text>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          {desc}
        </Typography.Text>
      </Flex>
    ))}
  </Flex>
);
