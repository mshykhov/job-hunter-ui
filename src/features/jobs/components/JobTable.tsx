import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { DragEndEvent, DragOverEvent } from "@dnd-kit/core";
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { Table } from "antd";
import type { ColumnsType, ColumnType } from "antd/es/table";
import type { ExpandableConfig } from "antd/es/table/interface";

import { useSourceNames } from "../hooks/useSourceNames";
import type { ColumnKey, TableDensity } from "../hooks/useTableSettings";
import { FLEX_COLUMN, MIN_COLUMN_WIDTHS } from "../hooks/useTableSettings";
import type { JobGroup } from "../types";
import { DragIndexContext, type DragIndexState } from "./DragIndexContext";
import { buildBaseColumns } from "./jobTableColumns";
import { DraggableBodyCell, ResizableHeaderCell } from "./ResizableHeaderCell";

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
