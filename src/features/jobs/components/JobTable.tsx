import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Table, Tag } from "antd";
import type { ColumnsType, ColumnType } from "antd/es/table";
import type { ExpandableConfig } from "antd/es/table/interface";
import { CheckCircleOutlined } from "@ant-design/icons";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import type { DragEndEvent, DragOverEvent } from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import type { Job } from "../types";
import { STATUS_COLORS, STATUS_LABELS, getSourceColor, formatRelativeDate } from "../constants";
import { useSourceNames } from "../hooks/useSourceNames";
import type { ColumnKey, TableDensity } from "../hooks/useTableSettings";
import { MIN_COLUMN_WIDTHS } from "../hooks/useTableSettings";
import { ResizableHeaderCell, DraggableBodyCell } from "./ResizableHeaderCell";
import { DragIndexContext, type DragIndexState } from "./DragIndexContext";

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
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  expandable?: ExpandableConfig<Job>;
}

const buildBaseColumns = (sourceNames: Record<string, string>): ColumnsType<Job> => [
  {
    key: "rowNum",
    title: "#",
    align: "center",
    render: (_: unknown, __: Job, index: number) => index + 1,
  },
  {
    key: "title",
    title: "Title",
    dataIndex: "title",
    ellipsis: true,
    render: (title: string, record: Job) =>
      record.url ? (
        <a
          href={record.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{ color: "inherit", textDecoration: "none" }}
          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
        >
          <strong>{title}</strong>
        </a>
      ) : (
        <strong>{title}</strong>
      ),
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
    render: (source: Job["source"]) => (
      <Tag color={getSourceColor(source)}>{sourceNames[source] ?? source}</Tag>
    ),
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
    title: "Scraped",
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
    () => new Map<string, ColumnType<Job>>(
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
            <Table<Job>
              columns={columns as ColumnsType<Job>}
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
