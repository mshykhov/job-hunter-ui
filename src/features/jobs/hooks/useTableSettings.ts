import { useState, useCallback, useEffect } from "react";
import { createStorage } from "@/lib/storage";

export const COLUMN_KEYS = [
  "title",
  "company",
  "source",
  "salary",
  "location",
  "remote",
  "status",
  "score",
  "publishedAt",
  "matchedAt",
  "updatedAt",
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
  score: "Score",
  publishedAt: "Published",
  matchedAt: "Matched",
  updatedAt: "Scraped",
};

export const MIN_COLUMN_WIDTHS: Record<ColumnKey, number> = {
  title: 150,
  company: 100,
  source: 80,
  salary: 80,
  location: 100,
  remote: 70,
  status: 80,
  score: 60,
  publishedAt: 110,
  matchedAt: 110,
  updatedAt: 110,
};

const FLEX_COLUMN: ColumnKey = "title";

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
  knownColumns: ColumnKey[];
  columnWidths: Partial<Record<ColumnKey, number>>;
  refreshInterval: number;
  density: TableDensity;
}

const DEFAULT_SETTINGS: TableSettings = {
  visibleColumns: [...COLUMN_KEYS],
  knownColumns: [],
  columnWidths: {},
  refreshInterval: 60_000,
  density: "small",
};

const storage = createStorage<TableSettings>("job-hunter-table-settings", 5, DEFAULT_SETTINGS);

const loadWithNewColumns = (): TableSettings => {
  const saved = storage.load();
  const known = new Set(saved.knownColumns.length > 0 ? saved.knownColumns : saved.visibleColumns);
  const newCols = COLUMN_KEYS.filter((k) => !known.has(k));
  return {
    ...saved,
    visibleColumns: newCols.length > 0 ? [...saved.visibleColumns, ...newCols] : saved.visibleColumns,
    knownColumns: [...COLUMN_KEYS],
  };
};

export const useTableSettings = () => {
  const [settings, setSettings] = useState<TableSettings>(loadWithNewColumns);

  useEffect(() => {
    storage.save(settings);
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

  const setColumnWidth = useCallback((key: ColumnKey, width: number) => {
    setSettings((prev) => ({
      ...prev,
      columnWidths: { ...prev.columnWidths, [key]: width },
    }));
  }, []);

  const setRefreshInterval = useCallback((refreshInterval: number) => {
    setSettings((prev) => ({ ...prev, refreshInterval }));
  }, []);

  const setDensity = useCallback((density: TableDensity) => {
    setSettings((prev) => ({ ...prev, density }));
  }, []);

  return { settings, toggleColumn, setColumnWidth, setRefreshInterval, setDensity, FLEX_COLUMN };
};
