import { createContext, type ReactNode, useContext } from "react";

import type { TreeMode } from "@shared/avl";

const TreeModeContext = createContext<TreeMode>("avl");

export function TreeModeProvider({ mode, children }: { mode: TreeMode; children: ReactNode }) {
  return <TreeModeContext.Provider value={mode}>{children}</TreeModeContext.Provider>;
}

export const useTreeMode = (): TreeMode => useContext(TreeModeContext);
