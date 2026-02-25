import { useState, useRef } from "react";
import { Tag, Input, Flex } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";

interface TagListInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  color?: string;
}

export const TagListInput = ({ value, onChange, placeholder, color }: TagListInputProps) => {
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
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
        <Tag
          onClick={showInput}
          style={{ borderStyle: "dashed", cursor: "pointer" }}
        >
          <PlusOutlined /> Add
        </Tag>
      )}
    </Flex>
  );
};
