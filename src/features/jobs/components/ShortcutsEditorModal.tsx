import { useEffect, useState } from "react";

import { Button, Flex, Modal, Typography } from "antd";

import { useKeybindings } from "../hooks/useKeybindings";
import type { ShortcutActionId } from "../keybindings";
import {
  codeToLabel,
  isCustomized,
  matchShortcut,
  resetBindings,
  setBinding,
  SHORTCUT_ACTIONS,
} from "../keybindings";

interface ShortcutsEditorModalProps {
  open: boolean;
  onClose: () => void;
}

const BINDABLE_CODE = /^(Key[A-Z]|Digit[0-9])$/;

export const ShortcutsEditorModal = ({ open, onClose }: ShortcutsEditorModalProps) => {
  const { keyLabel } = useKeybindings();
  const [recording, setRecording] = useState<ShortcutActionId | null>(null);
  const [conflict, setConflict] = useState<string | null>(null);

  useEffect(() => {
    if (!recording) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.code === "Escape") {
        setRecording(null);
        setConflict(null);
        return;
      }
      if (!BINDABLE_CODE.test(e.code)) {
        setConflict("Only letter and digit keys can be bound");
        return;
      }
      const taken = matchShortcut(e.code);
      if (taken && taken !== recording) {
        setConflict(`${codeToLabel(e.code)} is already used by "${SHORTCUT_ACTIONS[taken].label}"`);
        return;
      }
      setBinding(recording, e.code);
      setRecording(null);
      setConflict(null);
    };

    // Capture phase so list/review handlers never see the recorded keystroke.
    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [recording]);

  const handleClose = () => {
    setRecording(null);
    setConflict(null);
    onClose();
  };

  const actionIds = Object.keys(SHORTCUT_ACTIONS) as ShortcutActionId[];

  return (
    <Modal
      title="Customize shortcuts"
      open={open}
      onCancel={handleClose}
      width={420}
      footer={
        <Flex justify="space-between">
          <Button size="small" disabled={!isCustomized()} onClick={resetBindings}>
            Reset to defaults
          </Button>
          <Button size="small" type="primary" onClick={handleClose}>
            Done
          </Button>
        </Flex>
      }
    >
      <Flex vertical gap={10}>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          Letters match the physical key, so shortcuts work on any keyboard layout. Arrows, Enter
          and Esc are fixed.
        </Typography.Text>
        {actionIds.map((id) => (
          <Flex key={id} justify="space-between" align="center" gap={12}>
            <Typography.Text style={{ fontSize: 13 }}>{SHORTCUT_ACTIONS[id].label}</Typography.Text>
            <Button
              size="small"
              type={recording === id ? "primary" : "default"}
              style={{ minWidth: 96 }}
              onClick={() => {
                setConflict(null);
                setRecording(recording === id ? null : id);
              }}
            >
              {recording === id ? "Press a key…" : keyLabel(id)}
            </Button>
          </Flex>
        ))}
        {conflict && (
          <Typography.Text type="danger" style={{ fontSize: 12 }}>
            {conflict}
          </Typography.Text>
        )}
      </Flex>
    </Modal>
  );
};
