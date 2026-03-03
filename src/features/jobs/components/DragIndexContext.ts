import { createContext } from "react";

export interface DragIndexState {
  active: string | number;
  over: string | number | undefined;
}

export const DragIndexContext = createContext<DragIndexState>({ active: "", over: "" });
