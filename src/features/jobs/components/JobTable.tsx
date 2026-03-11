import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { CheckCircleOutlined } from "@ant-design/icons";
import type { DragEndEvent, DragOverEvent } from "@dnd-kit/core";
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { horizontalListSortingStrategy,SortableContext } from "@dnd-kit/sortable";
import { Table, Tag, Tooltip } from "antd";
import type { ColumnsType, ColumnType } from "antd/es/table";
import type { ExpandableConfig } from "antd/es/table/interface";

import { formatRelativeDate,getSourceColor, REMOTE_CHECK_COLOR, STATUS_COLORS, STATUS_LABELS } from "../constants";
import { useSourceNames } from "../hooks/useSourceNames";
import type { ColumnKey, TableDensity } from "../hooks/useTableSettings";
import { FLEX_COLUMN,MIN_COLUMN_WIDTHS } from "../hooks/useTableSettings";
import type { JobGroup } from "../types";
import { DragIndexContext, type DragIndexState } from "./DragIndexContext";
import { DraggableBodyCell,ResizableHeaderCell } from "./ResizableHeaderCell";

interface JobTableProps {
  jobs: JobGroup[];
  loading: boolean;
  onSelect: (job: JobGroup) => void;
  visibleColumns: ColumnKey[];
  columnOrder: ColumnKey[];
  columnWidths: Partial<Record<ColumnKey, number>>;
  onColumnResize: (key: ColumnKey, width: number) => void;
  onColumnReorder: (fromKey: ColumnKey, toKey: ColumnKey) => void;
  density: TableDensity;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  expandable?: ExpandableConfig<JobGroup>;
}

const buildBaseColumns = (sourceNames: Record<string, string>): ColumnsType<JobGroup> => [
  {
    key: "rowNum",
    title: "#",
    align: "center",
    render: (_: unknown, __: JobGroup, index: number) => index + 1,
  },
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
    key: "sources",
    title: "Sources",
    dataIndex: "sources",
    render: (sources: string[]) => {
      if (!sources?.length) return "\u2014";
      const first = sources[0];
      const rest = sources.length - 1;
      const tooltip = rest > 0 ? sources.map((s) => sourceNames[s] ?? s).join(", ") : undefined;
      return (
        <Tooltip title={tooltip}>
          <span>
            <Tag color={getSourceColor(first)} style={{ marginInlineEnd: 0 }}>
              {sourceNames[first] ?? first}
            </Tag>
            {rest > 0 && (
              <span style={{ fontSize: 11, opacity: 0.65, marginLeft: 4 }}>+{rest}</span>
            )}
          </span>
        </Tooltip>
      );
    },
  },
  {
    key: "salary",
    title: "Salary",
    dataIndex: "salary",
    render: (salary: string | null) => salary ?? "\u2014",
  },
  {
    key: "locations",
    title: "Locations",
    dataIndex: "locations",
    ellipsis: true,
    render: (locations: string[]) => {
      if (!locations?.length) return "\u2014";
      const first = locations[0];
      const rest = locations.length - 1;
      if (rest === 0) return first;
      return (
        <Tooltip title={locations.join(", ")}>
          <span>{first} <span style={{ fontSize: 11, opacity: 0.65 }}>+{rest}</span></span>
        </Tooltip>
      );
    },
  },
  {
    key: "remote",
    title: "Remote",
    dataIndex: "remote",
    align: "center",
    render: (remote: boolean) =>
      remote ? <CheckCircleOutlined style={{ color: REMOTE_CHECK_COLOR }} /> : null,
  },
  {
    key: "jobCount",
    title: "Jobs",
    dataIndex: "jobCount",
    align: "center",
    render: (count: number) => count,
  },
  {
    key: "status",
    title: "Status",
    dataIndex: "status",
    render: (status: JobGroup["status"]) => (
      <Tag color={STATUS_COLORS[status]}>{STATUS_LABELS[status]}</Tag>
    ),
  },
  {
    key: "score",
    title: "Score",
    dataIndex: "aiRelevanceScore",
    align: "center",
    render: (score: number | null) => score != null ? `${score}%` : "\u2014",
  },
  {
    key: "publishedAt",
    title: "Published",
    dataIndex: "publishedAt",
    render: formatRelativeDate,
  },
  {
    key: "matchedAt",
    title: "Matched",
    dataIndex: "matchedAt",
    render: formatRelativeDate,
  },
  {
    key: "updatedAt",
    title: "Updated",
    dataIndex: "updatedAt",
    render: formatRelativeDate,
  },
];

const SCROLL_THRESHOLD = 200;

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
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  expandable,
}: JobTableProps) => {
  const [dragIndex, setDragIndex] = useState<DragIndexState>({ active: "", over: "" });
  const tableRef = useRef<HTMLDivElement>(null);
  const sourceNames = useSourceNames();

  const baseColumnsMap = useMemo(
    () => new Map<string, ColumnType<JobGroup>>(
      buildBaseColumns(sourceNames).map((col) => [col.key as string, col]),
    ),
    [sourceNames],
  );

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
          const col = baseColumnsMap.get(key);
          if (!col) return null;
          const w = columnWidths[key] ?? MIN_COLUMN_WIDTHS[key];
          const isFlex = key === FLEX_COLUMN;
          return {
            ...col,
            width: isFlex ? undefined : w,
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
    [orderedKeys, columnWidths, onColumnResize, baseColumnsMap],
  );

  const scrollX = useMemo(
    () => orderedKeys.reduce((sum, key) => sum + (columnWidths[key] ?? MIN_COLUMN_WIDTHS[key]), 0),
    [orderedKeys, columnWidths],
  );

  const handleScroll = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    const el = tableRef.current?.querySelector(".ant-table-body");
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight - scrollTop - clientHeight < SCROLL_THRESHOLD) {
      onLoadMore();
    }
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  useEffect(() => {
    const el = tableRef.current?.querySelector(".ant-table-body");
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

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
          <div ref={tableRef}>
            <Table<JobGroup>
              columns={columns as ColumnsType<JobGroup>}
              dataSource={jobs}
              loading={loading}
              rowKey="id"
              size={density}
              scroll={{ x: scrollX, y: "calc(100vh - 280px)" }}
              components={{
                header: { cell: ResizableHeaderCell },
                body: { cell: DraggableBodyCell },
              }}
              expandable={expandable}
              pagination={false}
              onRow={(record) => ({
                onClick: () => onSelect(record),
                style: { cursor: "pointer" },
              })}
            />
          </div>
        </DragIndexContext.Provider>
      </SortableContext>
    </DndContext>
  );
};
