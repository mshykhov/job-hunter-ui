import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Skeleton, Typography } from "antd";

import { ProviderChainCard } from "../components/ProviderChainCard";
import { SaveBar } from "../components/SaveBar";
import { useAiProviderChain, useAiProviders } from "../hooks/useAiConfig";
import { useDirtyForm } from "../hooks/useDirtyForm";
import { useSavedFlash } from "../hooks/useSavedFlash";
import type { AiProvider, AiProviderChainEntryForm, SaveAiProviderChainRequest } from "../types";
import { createChainEntry } from "../types";

const getSaveDisabledReason = (
  entries: AiProviderChainEntryForm[],
  providers: AiProvider[],
  storedKeyHints: Record<string, string>
): string | null => {
  if (entries.length === 0) return "Add at least one provider to save a chain";
  if (entries.some((e) => !e.provider)) return "Select a provider for every entry";
  if (entries.some((e) => !e.modelId)) return "Select a model for every entry";

  const providerIds = entries.map((e) => e.provider);
  if (new Set(providerIds).size !== providerIds.length) {
    return "Each provider may appear at most once in the chain";
  }

  const missing = entries.find((e) => {
    const provider = providers.find((p) => p.id === e.provider);
    return !!provider?.requiresApiKey && !storedKeyHints[provider.id] && !e.apiKey.trim();
  });
  if (missing) {
    const name = providers.find((p) => p.id === missing.provider)?.name ?? missing.provider;
    return `API key is required for ${name}`;
  }

  return null;
};

const toSaveRequest = (entries: AiProviderChainEntryForm[]): SaveAiProviderChainRequest => ({
  chain: entries.map((entry, index) => {
    if (!entry.provider || !entry.modelId) {
      throw new Error("Cannot save an incomplete chain entry");
    }
    return {
      priority: index + 1,
      provider: entry.provider,
      modelId: entry.modelId,
      apiKey: entry.apiKey.trim() || undefined,
      enabled: entry.enabled,
    };
  }),
});

export const AiConfigTab = () => {
  const { data: providers, isLoading: providersLoading } = useAiProviders();
  const { initial, storedKeyHints, isLoading: chainLoading, save } = useAiProviderChain();
  const { form, setForm, isDirty, reset } = useDirtyForm<AiProviderChainEntryForm[]>(initial);
  const { saved, flash } = useSavedFlash();

  const updateEntry = (index: number, patch: Partial<AiProviderChainEntryForm>) =>
    setForm((prev) => prev.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)));

  const moveEntry = (index: number, direction: -1 | 1) =>
    setForm((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  const removeEntry = (index: number) => setForm((prev) => prev.filter((_, i) => i !== index));

  const addEntry = () => setForm((prev) => [...prev, createChainEntry()]);

  const saveDisabledReason = getSaveDisabledReason(form, providers ?? [], storedKeyHints);
  const saveDisabled = !!saveDisabledReason;
  const addDisabled = form.length >= (providers ?? []).length;

  const handleSave = async () => {
    await save.mutateAsync(toSaveRequest(form));
    flash();
  };

  if (providersLoading || chainLoading) return <Skeleton active paragraph={{ rows: 6 }} />;

  return (
    <Flex vertical gap={16}>
      <Card
        size="small"
        title="AI Provider Chain"
        extra={
          <Button size="small" icon={<PlusOutlined />} onClick={addEntry} disabled={addDisabled}>
            Add provider
          </Button>
        }
      >
        <Flex vertical gap={12}>
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            Providers are tried in order for job matching and preference normalization. If an entry
            fails or is disabled, the next one in the chain is used.
          </Typography.Text>
          <ProviderChainCard
            entries={form}
            providers={providers ?? []}
            storedKeyHints={storedKeyHints}
            onChange={updateEntry}
            onMove={moveEntry}
            onRemove={removeEntry}
          />
        </Flex>
      </Card>
      <SaveBar
        isDirty={isDirty}
        saved={saved}
        saving={save.isPending}
        onSave={handleSave}
        onDiscard={reset}
        saveDisabled={saveDisabled}
        saveDisabledReason={saveDisabledReason ?? undefined}
      />
    </Flex>
  );
};
