export type PresetOperation = { kind: "insert"; key: number } | { kind: "delete"; key: number };

export type Preset = {
  name: string;
  keys: number[];
  operation: PresetOperation;
};

export const presets: readonly Preset[] = [
  {
    name: "Insert causes a left-left rotation",
    keys: [30, 20],
    operation: { kind: "insert", key: 10 },
  },
  {
    name: "Insert causes a right-right rotation",
    keys: [10, 20],
    operation: { kind: "insert", key: 30 },
  },
  {
    name: "Insert causes a left-right rotation",
    keys: [30, 10],
    operation: { kind: "insert", key: 20 },
  },
  {
    name: "Insert causes a right-left rotation",
    keys: [10, 30],
    operation: { kind: "insert", key: 20 },
  },
  {
    name: "Delete a leaf",
    keys: [20, 10, 30],
    operation: { kind: "delete", key: 10 },
  },
  {
    name: "Delete a node with one child",
    keys: [20, 10, 30, 40],
    operation: { kind: "delete", key: 30 },
  },
  {
    name: "Delete a node with two children",
    keys: [20, 10, 30, 25, 40],
    operation: { kind: "delete", key: 20 },
  },
];
