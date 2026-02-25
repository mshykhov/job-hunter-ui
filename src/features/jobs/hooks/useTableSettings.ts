import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "job-hunter-table-settings";

export const COLUMN_KEYS = [
  "title",
  "company",
  "source",
  "salary",
  "location",
  "remote",
  "status",
  "publishedAt",
  "matchedAt",
] as const;

export type ColumnKey = (typeof COLUMN_KEYS)[number];

export const COLUMN_LABELS: Record<ColumnKey, string> = {
  title: "Title",
  company: "Company",
  source: "Source",
  salary: "Salary",
  location: "Location",
  remote: "Remote",
  status: "Status",
  publishedAt: "Published",
  matchedAt: "Matched",
};

const ALWAYS_VISIBLE: ColumnKey[] = ["title"];

export const REFRESH_OPTIONS = [
  { label: "Off", value: 0 },
  { label: "30s", value: 30_000 },
  { label: "1 min", value: 60_000 },
  { label: "2 min", value: 120_000 },
  { label: "5 min", value: 300_000 },
] as const;

export type TableDensity = "small" | "middle";

export interface TableSettings {
  visibleColumns: ColumnKey[];
  refreshInterval: number;
  density: TableDensity;
}

const DEFAULT_SETTINGS: TableSettings = {
  visibleColumns: [...COLUMN_KEYS],
  refreshInterval: 60_000,
  density: "small",
};

const loadSettings = (): TableSettings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const useTableSettings = () => {
  const [settings, setSettings] = useState<TableSettings>(loadSettings);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const toggleColumn = useCallback((key: ColumnKey) => {
    if (ALWAYS_VISIBLE.includes(key)) return;
    setSettings((prev) => {
      const visible = prev.visibleColumns.includes(key)
        ? prev.visibleColumns.filter((k) => k !== key)
        : [...prev.visibleColumns, key];
      return { ...prev, visibleColumns: visible };
    });
  }, []);

  const setRefreshInterval = useCallback((refreshInterval: number) => {
    setSettings((prev) => ({ ...prev, refreshInterval }));
  }, []);

  const setDensity = useCallback((density: TableDensity) => {
    setSettings((prev) => ({ ...prev, density }));
  }, []);

  return { settings, toggleColumn, setRefreshInterval, setDensity };
};
