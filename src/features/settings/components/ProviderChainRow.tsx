import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Flex, Input, Select, Switch, Tag, Typography } from "antd";

import type { AiModel, AiProvider, AiProviderChainEntryForm } from "../types";
import { ModelSpecCard } from "./ModelSpecCard";

interface ProviderChainRowProps {
  entry: AiProviderChainEntryForm;
  index: number;
  isLast: boolean;
  providers: AiProvider[];
  providerOptions: { value: string; label: string }[];
  storedHint?: string;
  onChange: (patch: Partial<AiProviderChainEntryForm>) => void;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}

const formatCost = (cost: number) => `$${cost.toFixed(2)}`;

const formatContextWindow = (tokens: number) => {
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(1)}M`;
  return `${(tokens / 1_000).toFixed(0)}K`;
};

const buildModelLabel = (m: AiModel) => {
  const cost = `${formatCost(m.inputCostPer1M)}/${formatCost(m.outputCostPer1M)} per 1M tokens`;
  const ctx = `${formatContextWindow(m.contextWindow)} ctx`;
  const rec = m.recommended ? " ★ Recommended" : "";
  return `${m.name} - ${cost}, ${ctx}${rec}`;
};

export const ProviderChainRow = ({
  entry,
  index,
  isLast,
  providers,
  providerOptions,
  storedHint,
  onChange,
  onMove,
  onRemove,
}: ProviderChainRowProps) => {
  const provider = providers.find((p) => p.id === entry.provider) ?? null;
  const modelOptions = (provider?.models ?? []).map((m) => ({
    value: m.id,
    label: buildModelLabel(m),
  }));
  const selectedModel = provider?.models.find((m) => m.id === entry.modelId) ?? null;

  return (
    <div className="settings-chain-row" data-enabled={entry.enabled}>
      <Flex justify="space-between" align="center">
        <Tag color={index === 0 ? "processing" : "default"}>Priority {index + 1}</Tag>
        <Flex gap={4}>
          <Button
            size="small"
            icon={<ArrowUpOutlined />}
            disabled={index === 0}
            onClick={() => onMove(-1)}
            aria-label="Move up"
          />
          <Button
            size="small"
            icon={<ArrowDownOutlined />}
            disabled={isLast}
            onClick={() => onMove(1)}
            aria-label="Move down"
          />
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={onRemove}
            aria-label="Remove"
          />
        </Flex>
      </Flex>
      <Flex vertical gap={12} style={{ marginTop: 12 }}>
        <Flex vertical gap={4}>
          <Typography.Text style={{ fontSize: 13 }}>Provider</Typography.Text>
          <Select
            placeholder="Select provider"
            value={entry.provider}
            onChange={(value) => onChange({ provider: value, modelId: null, apiKey: "" })}
            options={providerOptions}
            allowClear
            style={{ maxWidth: 280 }}
          />
        </Flex>
        <Flex vertical gap={4}>
          <Typography.Text style={{ fontSize: 13 }}>Model</Typography.Text>
          <Select
            placeholder={entry.provider ? "Select model" : "Select provider first"}
            value={entry.modelId}
            onChange={(value) => onChange({ modelId: value })}
            options={modelOptions}
            disabled={!entry.provider}
            allowClear
            style={{ maxWidth: 520 }}
          />
        </Flex>
        {provider?.requiresApiKey && (
          <Flex vertical gap={4}>
            <Typography.Text style={{ fontSize: 13 }}>API Key</Typography.Text>
            <Input.Password
              placeholder={storedHint ?? "sk-..."}
              value={entry.apiKey}
              onChange={(e) => onChange({ apiKey: e.target.value })}
              style={{ maxWidth: 400 }}
            />
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {storedHint
                ? `Key is set (${storedHint}). Leave empty to keep current key.`
                : "Required for this provider."}
            </Typography.Text>
          </Flex>
        )}
        <Flex align="center" gap={8}>
          <Switch
            size="small"
            checked={entry.enabled}
            onChange={(checked) => onChange({ enabled: checked })}
          />
          <Typography.Text style={{ fontSize: 13 }}>
            {entry.enabled ? "Enabled" : "Disabled"}
          </Typography.Text>
        </Flex>
        {selectedModel && <ModelSpecCard model={selectedModel} />}
      </Flex>
    </div>
  );
};
