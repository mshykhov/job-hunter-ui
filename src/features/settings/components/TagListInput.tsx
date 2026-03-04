import { useState, useRef } from "react";
import { Tag, Input, Flex } from "antd";
import { ClearOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";

interface TagListInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  color?: string;
}

const parseText = (text: string): string[] => {
  const separator = text.includes("\n") ? /[\n,]+/ : /,+/;
  return [...new Set(
    text
      .split(separator)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  )];
};

export const TagListInput = ({ value, onChange, placeholder, color }: TagListInputProps) => {
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState("");
  const inputRef = useRef<InputRef>(null);

  const handleClose = (removed: string) => {
    onChange(value.filter((v) => v !== removed));
  };

  const handleInputConfirm = () => {
    const trimmed = inputValue.trim().toLowerCase();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInputVisible(false);
    setInputValue("");
  };

  const showInput = () => {
    setInputVisible(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const enterEditMode = () => {
    setEditText(value.join(", "));
    setEditMode(true);
  };

  const confirmEdit = () => {
    onChange(parseText(editText));
    setEditMode(false);
  };

  if (editMode) {
    return (
      <Flex vertical gap={4}>
        <Input.TextArea
          autoFocus
          rows={3}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          placeholder="Comma or newline separated values..."
        />
        <Flex gap={4}>
          <Tag onClick={confirmEdit} style={{ cursor: "pointer" }} color="blue">
            Apply
          </Tag>
          <Tag onClick={() => setEditMode(false)} style={{ cursor: "pointer" }}>
            Cancel
          </Tag>
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex gap={4} wrap="wrap" align="center">
      {value.map((tag) => (
        <Tag key={tag} closable onClose={() => handleClose(tag)} color={color}>
          {tag}
        </Tag>
      ))}
      {inputVisible ? (
        <Input
          ref={inputRef}
          size="small"
          style={{ width: 120 }}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
          placeholder={placeholder}
        />
      ) : (
        <>
          <Tag
            onClick={showInput}
            style={{ borderStyle: "dashed", cursor: "pointer" }}
          >
            <PlusOutlined /> Add
          </Tag>
          {value.length >= 2 && (
            <>
              <Tag
                onClick={enterEditMode}
                style={{ cursor: "pointer" }}
              >
                <EditOutlined /> Edit
              </Tag>
              <Tag
                onClick={() => onChange([])}
                style={{ cursor: "pointer" }}
              >
                <ClearOutlined /> Clear
              </Tag>
            </>
          )}
        </>
      )}
    </Flex>
  );
};
