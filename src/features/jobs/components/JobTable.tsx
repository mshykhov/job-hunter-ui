import { useMemo, useState } from "react";
import { Table, Tag } from "antd";
import type { ColumnsType, ColumnType } from "antd/es/table";
import { CheckCircleOutlined } from "@ant-design/icons";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import type { DragEndEvent, DragOverEvent } from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import type { Job } from "../types";
import { STATUS_COLORS, STATUS_LABELS, SOURCE_COLORS, formatRelativeDate } from "../constants";
import type { ColumnKey, TableDensity } from "../hooks/useTableSettings";
import { MIN_COLUMN_WIDTHS } from "../hooks/useTableSettings";
import {
  ResizableHeaderCell,
  DraggableBodyCell,
  DragIndexContext,
  type DragIndexState,
} from "./ResizableHeaderCell";

interface JobTableProps {
  jobs: Job[];
  loading: boolean;
  onSelect: (job: Job) => void;
  visibleColumns: ColumnKey[];
  columnOrder: ColumnKey[];
  columnWidths: Partial<Record<ColumnKey, number>>;
  onColumnResize: (key: ColumnKey, width: number) => void;
  onColumnReorder: (fromKey: ColumnKey, toKey: ColumnKey) => void;
  density: TableDensity;
}

const BASE_COLUMNS: ColumnsType<Job> = [
  {
    key: "title",
    title: "Title",
    dataIndex: "title",
    ellipsis: true,
    render: (title: string) => <strong>{title}</strong>,
  },
  {
    key: "company",
    title: "Company",
    dataIndex: "company",
    ellipsis: true,
    render: (company: string | null) => company ?? "\u2014",
  },
  {
    key: "source",
    title: "Source",
    dataIndex: "source",
    render: (source: Job["source"]) => <Tag color={SOURCE_COLORS[source]}>{source}</Tag>,
  },
  {
    key: "salary",
    title: "Salary",
    dataIndex: "salary",
    render: (salary: string | null) => salary ?? "\u2014",
  },
  {
    key: "location",
    title: "Location",
    dataIndex: "location",
    ellipsis: true,
    render: (location: string | null) => location ?? "\u2014",
  },
  {
    key: "remote",
    title: "Remote",
    dataIndex: "remote",
    align: "center",
    render: (remote: boolean) =>
      remote ? <CheckCircleOutlined style={{ color: "#52c41a" }} /> : null,
  },
  {
    key: "status",
    title: "Status",
    dataIndex: "status",
    render: (status: Job["status"]) => (
      <Tag color={STATUS_COLORS[status]}>{STATUS_LABELS[status]}</Tag>
    ),
  },
  {
    key: "score",
    title: "Score",
    dataIndex: "aiRelevanceScore",
    align: "center",
    sorter: (a, b) => (a.aiRelevanceScore ?? 0) - (b.aiRelevanceScore ?? 0),
    showSorterTooltip: false,
    render: (score: number | null) => score != null ? `${score}%` : "\u2014",
  },
  {
    key: "publishedAt",
    title: "Published",
    dataIndex: "publishedAt",
    sorter: (a, b) => (a.publishedAt ?? "").localeCompare(b.publishedAt ?? ""),
    showSorterTooltip: false,
    render: formatRelativeDate,
  },
  {
    key: "matchedAt",
    title: "Matched",
    dataIndex: "matchedAt",
    sorter: (a, b) => (a.matchedAt ?? "").localeCompare(b.matchedAt ?? ""),
    showSorterTooltip: false,
    render: formatRelativeDate,
  },
  {
    key: "updatedAt",
    title: "Scraped",
    dataIndex: "updatedAt",
    sorter: (a, b) => (a.updatedAt ?? "").localeCompare(b.updatedAt ?? ""),
    showSorterTooltip: false,
    render: formatRelativeDate,
  },
];

const BASE_COLUMNS_MAP = new Map<string, ColumnType<Job>>(
  BASE_COLUMNS.map((col) => [col.key as string, col]),
);

export const JobTable = ({
  jobs,
  loading,
  onSelect,
  visibleColumns,
  columnOrder,
  columnWidths,
  onColumnResize,
  onColumnReorder,
  density,
}: JobTableProps) => {
  const [dragIndex, setDragIndex] = useState<DragIndexState>({ active: "", over: "" });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const visibleSet = useMemo(() => new Set(visibleColumns), [visibleColumns]);

  const orderedKeys = useMemo(
    () => columnOrder.filter((key) => visibleSet.has(key)),
    [columnOrder, visibleSet],
  );

  const columns = useMemo(
    () =>
      orderedKeys
        .map((key) => {
          const col = BASE_COLUMNS_MAP.get(key);
          if (!col) return null;
          const w = columnWidths[key] ?? MIN_COLUMN_WIDTHS[key];
          return {
            ...col,
            width: w,
            minWidth: MIN_COLUMN_WIDTHS[key],
            onHeaderCell: () => ({
              id: key,
              width: w,
              minWidth: MIN_COLUMN_WIDTHS[key],
              onResizeWidth: (nw: number) => onColumnResize(key, nw),
            }),
            onCell: () => ({ id: key }),
          };
        })
        .filter(Boolean),
    [orderedKeys, columnWidths, onColumnResize],
  );

  const scrollX = useMemo(
    () => orderedKeys.reduce((sum, key) => sum + (columnWidths[key] ?? MIN_COLUMN_WIDTHS[key]), 0),
    [orderedKeys, columnWidths],
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      onColumnReorder(active.id as ColumnKey, over!.id as ColumnKey);
    }
    setDragIndex({ active: "", over: "" });
  };

  const onDragOver = ({ active, over }: DragOverEvent) => {
    setDragIndex({ active: active.id as string, over: over?.id as string | undefined });
  };

  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToHorizontalAxis]}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <SortableContext items={orderedKeys} strategy={horizontalListSortingStrategy}>
        <DragIndexContext.Provider value={dragIndex}>
          <Table<Job>
            columns={columns as ColumnsType<Job>}
            dataSource={jobs}
            loading={loading}
            rowKey="id"
            size={density}
            scroll={{ x: scrollX }}
            components={{
              header: { cell: ResizableHeaderCell },
              body: { cell: DraggableBodyCell },
            }}
            pagination={false}
            onRow={(record) => ({
              onClick: () => onSelect(record),
              style: { cursor: "pointer" },
            })}
          />
        </DragIndexContext.Provider>
      </SortableContext>
    </DndContext>
  );
};
