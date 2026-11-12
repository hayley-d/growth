import type { TreeMode } from "@shared/avl";

export type { TreeMode };

export type Unit = {
  id: string;
  title: string;
  position: number;
  treeMode: TreeMode;
};

export type NewUnit = {
  title: string;
  position: number;
  treeMode?: TreeMode;
};

export type UnitChanges = Partial<NewUnit>;
