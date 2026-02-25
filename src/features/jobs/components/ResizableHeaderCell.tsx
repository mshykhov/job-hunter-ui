import { useRef, useCallback } from "react";

interface ResizableHeaderCellProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  width: number;
  onResize: (width: number) => void;
}

const MIN_COL_WIDTH = 50;

export const ResizableHeaderCell = ({
  width,
  onResize,
  children,
  style,
  ...rest
}: ResizableHeaderCellProps) => {
  const startX = useRef(0);
  const startWidth = useRef(0);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      startX.current = e.clientX;
      startWidth.current = width;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      const onMouseMove = (ev: MouseEvent) => {
        const delta = ev.clientX - startX.current;
        const newWidth = Math.max(MIN_COL_WIDTH, startWidth.current + delta);
        onResize(newWidth);
      };

      const onMouseUp = () => {
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [width, onResize],
  );

  if (!width) {
    return (
      <th style={style} {...rest}>
        {children}
      </th>
    );
  }

  return (
    <th style={{ ...style, position: "relative" }} {...rest}>
      {children}
      <div
        className="column-resize-handle"
        onMouseDown={handleMouseDown}
      />
    </th>
  );
};
