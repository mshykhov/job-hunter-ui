import { useState, useCallback, useRef, useEffect } from "react";
import { createStorage } from "@/lib/storage";

interface PanelState {
  width: number;
}

const MIN_WIDTH = 350;
const MAX_WIDTH = 800;

const storage = createStorage<PanelState>("job-hunter-detail-panel", 1, { width: 480 });

export const useResizablePanel = () => {
  const [width, setWidth] = useState(() => {
    const { width: w } = storage.load();
    return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, w));
  });
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const onDragStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isDragging.current = true;
      startX.current = e.clientX;
      startWidth.current = width;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [width],
  );

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = startX.current - e.clientX;
      const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth.current + delta));
      setWidth(newWidth);
    };

    const onMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  useEffect(() => {
    storage.save({ width });
  }, [width]);

  return { width, onDragStart };
};
