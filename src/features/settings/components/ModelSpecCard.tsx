import { Flex, Typography } from "antd";

import type { AiModel } from "../types";

interface ModelSpecCardProps {
  model: AiModel;
}

const formatCost = (cost: number) => `$${cost.toFixed(2)}`;

const formatContextWindow = (tokens: number) =>
  tokens >= 1_000_000 ? `${(tokens / 1_000_000).toFixed(1)}M` : `${(tokens / 1_000).toFixed(0)}K`;

interface SpecProps {
  label: string;
  value: string;
  hint?: string;
}

const Spec = ({ label, value, hint }: SpecProps) => (
  <Flex vertical gap={2} className="settings-model-spec">
    <Typography.Text
      type="secondary"
      style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.4 }}
    >
      {label}
    </Typography.Text>
    <Typography.Text strong style={{ fontSize: 15, fontVariantNumeric: "tabular-nums" }}>
      {value}
    </Typography.Text>
    {hint && (
      <Typography.Text type="secondary" style={{ fontSize: 11 }}>
        {hint}
      </Typography.Text>
    )}
  </Flex>
);

export const ModelSpecCard = ({ model }: ModelSpecCardProps) => (
  <div className="settings-model-specs">
    <Spec label="Input" value={formatCost(model.inputCostPer1M)} hint="per 1M tokens" />
    <Spec label="Output" value={formatCost(model.outputCostPer1M)} hint="per 1M tokens" />
    {model.cachedInputCostPer1M != null && (
      <Spec label="Cached" value={formatCost(model.cachedInputCostPer1M)} hint="per 1M tokens" />
    )}
    <Spec label="Context" value={formatContextWindow(model.contextWindow)} hint="tokens" />
  </div>
);
