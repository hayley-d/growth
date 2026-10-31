import { type AvlNode, layoutTree } from "@shared/avl";
import type { NodeState } from "@shared/engine";
import { TreeEdge } from "@/components/atoms/tree-edge";
import {
  TreeNode,
  treeNodeLabelHeight,
  treeNodePad,
  treeNodeRadius,
} from "@/components/molecules/tree-node";
import { cn } from "@/lib/utils";

type TreeViewProperties = {
  root: AvlNode | null;
  nodeStates?: Record<number, NodeState>;
  showHeight?: boolean;
  showBalance?: boolean;
  manual?: boolean;
  selectedKey?: number | null;
  onSelectKey?: (nodeKey: number) => void;
  className?: string;
};

const columnGap = 64;
const rowGap = 40;

const childHeight = (node: AvlNode | null) => node?.height ?? 0;

const factsByKey = (root: AvlNode | null) => {
  const facts = new Map<number, { height: number; balance: number }>();
  const visit = (node: AvlNode | null) => {
    if (!node) return;
    visit(node.left);
    visit(node.right);
    facts.set(node.key, {
      height: node.height,
      balance: childHeight(node.left) - childHeight(node.right),
    });
  };
  visit(root);
  return facts;
};

export function TreeView({
  root,
  nodeStates = {},
  showHeight = false,
  showBalance = false,
  manual = false,
  selectedKey = null,
  onSelectKey,
  className,
}: TreeViewProperties) {
  const layout = layoutTree(root);
  const facts = factsByKey(root);
  const labelHeight = treeNodeLabelHeight(showHeight, showBalance);
  const verticalStep = treeNodeRadius * 2 + rowGap + labelHeight;
  const maxX = layout.reduce((max, position) => Math.max(max, position.x), 0);
  const maxY = layout.reduce((max, position) => Math.max(max, position.y), 0);
  const width = layout.length === 0 ? 120 : treeNodePad * 2 + treeNodeRadius * 2 + maxX * columnGap;
  const height =
    layout.length === 0
      ? 80
      : treeNodePad * 2 + treeNodeRadius * 2 + maxY * verticalStep + labelHeight;
  const placed = layout.map((position) => ({
    ...position,
    cx: treeNodePad + treeNodeRadius + position.x * columnGap,
    cy: treeNodePad + treeNodeRadius + position.y * verticalStep,
  }));
  const byKey = new Map(placed.map((position) => [position.key, position]));

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      role={manual ? "group" : "img"}
      aria-label={root ? "Tree" : "Empty tree"}
      fontFamily="inherit"
      className={cn("block h-full w-full text-foreground", className)}
    >
      {placed.map((position) => {
        if (position.parentKey === null) return null;
        const parent = byKey.get(position.parentKey);
        if (!parent) return null;
        return (
          <TreeEdge
            key={position.key}
            fromX={parent.cx}
            fromY={parent.cy}
            toX={position.cx}
            toY={position.cy}
          />
        );
      })}
      {placed.map((position) => {
        const fact = facts.get(position.key);
        return (
          <TreeNode
            key={position.key}
            x={position.cx}
            y={position.cy}
            nodeKey={position.key}
            height={fact?.height ?? 1}
            balance={fact?.balance ?? 0}
            state={nodeStates[position.key]}
            showHeight={showHeight}
            showBalance={showBalance}
            manual={manual}
            selected={selectedKey === position.key}
            onSelect={onSelectKey}
          />
        );
      })}
    </svg>
  );
}
