import { Flex, Typography } from "antd";

import type { AiProvider, AiProviderChainEntryForm } from "../types";
import { ProviderChainRow } from "./ProviderChainRow";

interface ProviderChainCardProps {
  entries: AiProviderChainEntryForm[];
  providers: AiProvider[];
  storedKeyHints: Record<string, string>;
  onChange: (index: number, patch: Partial<AiProviderChainEntryForm>) => void;
  onMove: (index: number, direction: -1 | 1) => void;
  onRemove: (index: number) => void;
}

const RECOMMENDED_SUFFIX = " ★ Recommended";

export const ProviderChainCard = ({
  entries,
  providers,
  storedKeyHints,
  onChange,
  onMove,
  onRemove,
}: ProviderChainCardProps) => {
  if (entries.length === 0) {
    return (
      <div className="settings-chain-empty">
        <Typography.Text type="secondary">
          No providers configured. AI-powered features are disabled until at least one is added.
        </Typography.Text>
      </div>
    );
  }

  return (
    <Flex vertical gap={12}>
      {entries.map((entry, index) => {
        const providerOptions = providers
          .filter((p) => p.id === entry.provider || !entries.some((e) => e.provider === p.id))
          .map((p) => ({
            value: p.id,
            label: p.recommended ? `${p.name}${RECOMMENDED_SUFFIX}` : p.name,
          }));

        return (
          <ProviderChainRow
            key={entry.key}
            entry={entry}
            index={index}
            isLast={index === entries.length - 1}
            providers={providers}
            providerOptions={providerOptions}
            storedHint={entry.provider ? storedKeyHints[entry.provider] : undefined}
            onChange={(patch) => onChange(index, patch)}
            onMove={(direction) => onMove(index, direction)}
            onRemove={() => onRemove(index)}
          />
        );
      })}
    </Flex>
  );
};
