import { createContext, useContext } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { Resizable } from "react-resizable";
import type { ResizeCallbackData } from "react-resizable";

export interface DragIndexState {
  active: string | number;
  over: string | number | undefined;
}

export const DragIndexContext = createContext<DragIndexState>({ active: "", over: "" });

interface HeaderCellProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  id?: string;
  width?: number;
  minWidth?: number;
  onResizeWidth?: (width: number) => void;
}

interface BodyCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  id?: string;
}

const dragActiveStyle = (dragState: DragIndexState, id: string): React.CSSProperties => {
  const { active, over } = dragState;
  if (active === id) return { opacity: 0.5 };
  if (over === id && active !== over) {
    return { borderInlineStart: "2px dashed var(--ant-color-primary, #4f46e5)" };
  }
  return {};
};

const SortableResizableCell = ({
  id,
  width,
  minWidth = 50,
  onResizeWidth,
  children,
  style,
  ...rest
}: HeaderCellProps) => {
  const dragState = useContext(DragIndexContext);
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({ id: id! });

  const thStyle: React.CSSProperties = {
    ...style,
    cursor: "grab",
    position: "relative",
    ...(isDragging ? { zIndex: 9999, userSelect: "none" } : {}),
    ...dragActiveStyle(dragState, id!),
  };

  const th = (
    <th ref={setNodeRef} style={thStyle} {...attributes} {...listeners} {...rest}>
      {children}
    </th>
  );

  if (!width || !onResizeWidth) return th;

  return (
    <Resizable
      width={width}
      height={0}
      minConstraints={[minWidth, 0]}
      axis="x"
      onResize={(_: React.SyntheticEvent, { size }: ResizeCallbackData) => onResizeWidth(size.width)}
      handle={
        <span
          className="column-resize-handle"
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        />
      }
      draggableOpts={{ enableUserSelectHack: false }}
    >
      {th}
    </Resizable>
  );
};

export const ResizableHeaderCell = ({ id, width, minWidth, onResizeWidth, ...rest }: HeaderCellProps) => {
  if (!id) return <th {...rest} />;
  return <SortableResizableCell id={id} width={width} minWidth={minWidth} onResizeWidth={onResizeWidth} {...rest} />;
};

export const DraggableBodyCell = ({ id, style, ...rest }: BodyCellProps) => {
  const dragState = useContext(DragIndexContext);
  if (!id) return <td style={style} {...rest} />;
  return <td {...rest} style={{ ...style, ...dragActiveStyle(dragState, id) }} />;
};
