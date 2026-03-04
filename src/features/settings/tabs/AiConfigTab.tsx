import { useState, useEffect, useMemo } from "react";
import { Card, Flex, Input, Select, Skeleton, Typography } from "antd";
import { useAiConfig, useAiProviders } from "../hooks/useAiConfig";
import { useDirtyForm } from "../hooks/useDirtyForm";
import { SaveBar } from "../components/SaveBar";
import type { AiConfig, AiModel } from "../types";

const formatCost = (cost: number) => `$${cost.toFixed(2)}`;

const formatContextWindow = (tokens: number) => {
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(1)}M`;
  return `${(tokens / 1_000).toFixed(0)}K`;
};

const buildModelLabel = (m: AiModel) =>
  `${m.name} — ${formatCost(m.inputCostPer1M)}/${formatCost(m.outputCostPer1M)} per 1M tokens, ${formatContextWindow(m.contextWindow)} ctx`;

export const AiConfigTab = () => {
  const { initial, save } = useAiConfig();
  const { data: providers, isLoading: providersLoading } = useAiProviders();
  const { form, update, isDirty, reset } = useDirtyForm<AiConfig>(initial);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => setSaved(false), 2500);
    return () => clearTimeout(timer);
  }, [saved]);

  const providerOptions = useMemo(
    () => (providers ?? []).map((p) => ({ value: p.id, label: p.name })),
    [providers],
  );

  const modelOptions = useMemo(() => {
    const provider = (providers ?? []).find((p) => p.id === form.provider);
    return (provider?.models ?? []).map((m) => ({ value: m.id, label: buildModelLabel(m) }));
  }, [providers, form.provider]);

  const handleProviderChange = (value: string | null) => {
    update("provider", value);
    update("model", null);
  };

  const handleSave = () => {
    save(form);
    setSaved(true);
  };

  if (providersLoading) return <Skeleton active paragraph={{ rows: 6 }} />;

  return (
    <Flex vertical gap={16}>
      <Card size="small" title="AI Provider">
        <Flex vertical gap={12}>
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            Configure the AI model used for job matching and preference normalization.
            If not configured, only manual filtering is available.
          </Typography.Text>
          <Flex vertical gap={4}>
            <Typography.Text style={{ fontSize: 13 }}>Provider</Typography.Text>
            <Select
              placeholder="Select provider"
              value={form.provider}
              onChange={handleProviderChange}
              options={providerOptions}
              allowClear
              style={{ maxWidth: 280 }}
            />
          </Flex>
          <Flex vertical gap={4}>
            <Typography.Text style={{ fontSize: 13 }}>Model</Typography.Text>
            <Select
              placeholder={form.provider ? "Select model" : "Select provider first"}
              value={form.model}
              onChange={(v) => update("model", v)}
              options={modelOptions}
              disabled={!form.provider}
              allowClear
              style={{ maxWidth: 520 }}
            />
          </Flex>
          <Flex vertical gap={4}>
            <Typography.Text style={{ fontSize: 13 }}>API Key</Typography.Text>
            <Input.Password
              placeholder="sk-..."
              value={form.apiKey}
              onChange={(e) => update("apiKey", e.target.value)}
              style={{ maxWidth: 400 }}
            />
          </Flex>
        </Flex>
      </Card>
      <SaveBar
        isDirty={isDirty}
        saved={saved}
        saving={false}
        onSave={handleSave}
        onDiscard={reset}
      />
    </Flex>
  );
};
