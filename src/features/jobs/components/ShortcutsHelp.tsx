import { useState } from "react";

import { SettingOutlined } from "@ant-design/icons";
import { Button, Flex, Typography } from "antd";

import { useKeybindings } from "../hooks/useKeybindings";
import type { ShortcutActionId } from "../keybindings";
import { ShortcutsEditorModal } from "./ShortcutsEditorModal";

const LIST_FIXED = [
  { key: "↑ / ↓", desc: "Move selection" },
  { key: "Enter", desc: "Open review" },
];

const LIST_ACTIONS: { id: ShortcutActionId; desc: string }[] = [
  { id: "markApplied", desc: "Mark Applied" },
  { id: "markIrrelevant", desc: "Mark Irrelevant" },
  { id: "resetStatus", desc: "Reset to New" },
  { id: "openOriginal", desc: "Open original" },
];

const REVIEW_ACTIONS: { id: ShortcutActionId; desc: string; suffix?: string }[] = [
  { id: "prevJob", desc: "Previous", suffix: " / ←" },
  { id: "nextJob", desc: "Next", suffix: " / →" },
  { id: "markApplied", desc: "Mark Applied" },
  { id: "markIrrelevant", desc: "Mark Irrelevant" },
  { id: "resetStatus", desc: "Reset to New" },
  { id: "openOriginal", desc: "Open original" },
];

const REVIEW_FIXED = [{ key: "Esc", desc: "Back to list" }];

interface ShortcutRowProps {
  keyText: string;
  desc: string;
}

const ShortcutRow = ({ keyText, desc }: ShortcutRowProps) => (
  <Flex justify="space-between" gap={12}>
    <Typography.Text code style={{ fontSize: 11 }}>
      {keyText}
    </Typography.Text>
    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
      {desc}
    </Typography.Text>
  </Flex>
);

export const ShortcutsHelp = () => {
  const { keyLabel } = useKeybindings();
  const [editorOpen, setEditorOpen] = useState(false);

  return (
    <Flex vertical gap={14} style={{ width: 210 }}>
      <Flex vertical gap={6}>
        <Typography.Text strong style={{ fontSize: 12 }}>
          List
        </Typography.Text>
        {LIST_FIXED.map((s) => (
          <ShortcutRow key={s.key} keyText={s.key} desc={s.desc} />
        ))}
        {LIST_ACTIONS.map((s) => (
          <ShortcutRow key={s.id} keyText={keyLabel(s.id)} desc={s.desc} />
        ))}
      </Flex>
      <Flex vertical gap={6}>
        <Typography.Text strong style={{ fontSize: 12 }}>
          Review
        </Typography.Text>
        {REVIEW_ACTIONS.map((s) => (
          <ShortcutRow key={s.id} keyText={keyLabel(s.id) + (s.suffix ?? "")} desc={s.desc} />
        ))}
        {REVIEW_FIXED.map((s) => (
          <ShortcutRow key={s.key} keyText={s.key} desc={s.desc} />
        ))}
      </Flex>
      <Button size="small" icon={<SettingOutlined />} onClick={() => setEditorOpen(true)}>
        Customize
      </Button>
      <ShortcutsEditorModal open={editorOpen} onClose={() => setEditorOpen(false)} />
    </Flex>
  );
};
