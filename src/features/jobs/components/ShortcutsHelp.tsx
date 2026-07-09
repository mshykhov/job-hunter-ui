import { Flex, Typography } from "antd";

const LIST_SHORTCUTS = [
  { key: "↑ / ↓", desc: "Move selection" },
  { key: "Enter", desc: "Open" },
  { key: "A", desc: "Mark Applied" },
  { key: "D / X", desc: "Mark Irrelevant" },
  { key: "R", desc: "Reset to New" },
  { key: "O", desc: "Open original" },
];

const REVIEW_SHORTCUTS = [
  { key: "Q / ←", desc: "Previous" },
  { key: "E / →", desc: "Next" },
  { key: "A", desc: "Mark Applied" },
  { key: "D / X", desc: "Mark Irrelevant" },
  { key: "R", desc: "Reset to New" },
  { key: "Esc", desc: "Back to list" },
];

interface ShortcutSectionProps {
  title: string;
  items: { key: string; desc: string }[];
}

const ShortcutSection = ({ title, items }: ShortcutSectionProps) => (
  <Flex vertical gap={6}>
    <Typography.Text strong style={{ fontSize: 12 }}>
      {title}
    </Typography.Text>
    {items.map(({ key, desc }) => (
      <Flex key={`${title}-${key}`} justify="space-between" gap={12}>
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

export const ShortcutsHelp = () => (
  <Flex vertical gap={14} style={{ width: 190 }}>
    <ShortcutSection title="List" items={LIST_SHORTCUTS} />
    <ShortcutSection title="Review" items={REVIEW_SHORTCUTS} />
  </Flex>
);
