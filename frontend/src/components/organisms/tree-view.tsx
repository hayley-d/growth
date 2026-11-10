import { AnimatePresence, motion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { type AvlNode, layoutTree, type NodeState } from "@shared/avl";
import {
  TreeNode,
  treeNodeLabelHeight,
  treeNodePad,
  treeNodeRadius,
} from "@/components/molecules/tree-node";
import { edgeLink, treeDropPx, treeGlideMs, treeGlideSec } from "@/lib/tree-motion";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

type TreeViewProperties = {
  root: AvlNode | null;
  nodeStates?: Record<number, NodeState>;
  showHeight?: boolean;
  showBalance?: boolean;
  manual?: boolean;
  selectedKey?: number | null;
  onSelectKey?: (nodeKey: number) => void;
  slots?: readonly TreeViewSlot[];
  activeSlotId?: string | null;
  className?: string;
};

export type TreeViewSlot = {
  id: string;
  x: number;
  y: number;
};

type PlacedNode = {
  key: number;
  x: number;
  y: number;
  parentKey: number | null;
  cx: number;
  cy: number;
};

type SnapshotEdgeProperties = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  dropStart: boolean;
  instant: boolean;
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

const extent = (points: readonly { cx: number; cy: number }[], labelHeight: number) => {
  if (points.length === 0) return { width: 120, height: 80 };
  let maxCx = 0;
  let maxCy = 0;
  for (const point of points) {
    if (point.cx > maxCx) maxCx = point.cx;
    if (point.cy > maxCy) maxCy = point.cy;
  }
  return {
    width: maxCx + treeNodePad + treeNodeRadius,
    height: maxCy + treeNodePad + treeNodeRadius + labelHeight,
  };
};

const sameExtent = (
  left: readonly { cx: number; cy: number }[],
  right: readonly { cx: number; cy: number }[],
  labelHeight: number,
) => {
  const a = extent(left, labelHeight);
  const b = extent(right, labelHeight);
  return a.width === b.width && a.height === b.height;
};

function SnapshotEdge({ x1, y1, x2, y2, dropStart, instant }: SnapshotEdgeProperties) {
  const glide = { duration: instant ? 0 : treeGlideSec, ease: "easeInOut" as const };
  return (
    <motion.line
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      initial={
        instant
          ? false
          : {
              x1,
              y1: dropStart ? y1 - treeDropPx : y1,
              x2,
              y2: dropStart ? y2 : y2 - treeDropPx,
              opacity: 0,
            }
      }
      animate={{ x1, y1, x2, y2, opacity: 1 }}
      transition={glide}
    />
  );
}

export function TreeView({
  root,
  nodeStates = {},
  showHeight = false,
  showBalance = false,
  manual = false,
  selectedKey = null,
  onSelectKey,
  slots = [],
  activeSlotId = null,
  className,
}: TreeViewProperties) {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [ready, setReady] = useState(false);
  const instant = !ready || reduced;
  const layout = layoutTree(root);
  const facts = factsByKey(root);
  const labelHeight = treeNodeLabelHeight(showHeight, showBalance);
  const verticalStep = treeNodeRadius * 2 + rowGap + labelHeight;
  const placed: PlacedNode[] = layout.map((position) => ({
    ...position,
    cx: treeNodePad + treeNodeRadius + position.x * columnGap,
    cy: treeNodePad + treeNodeRadius + position.y * verticalStep,
  }));
  const byKey = new Map(placed.map((position) => [position.key, position]));
  const signature = placed
    .map((position) => `${position.key}:${position.cx}:${position.cy}`)
    .join(";");
  const frame = useRef({ placed, instant });
  frame.current = { placed, instant };
  const previousPlaced = useRef(placed);
  const [cover, setCover] = useState(placed);
  const placedSlots = slots.map((slot) => ({
    ...slot,
    cx: treeNodePad + treeNodeRadius + slot.x * columnGap,
    cy: treeNodePad + treeNodeRadius + slot.y * verticalStep,
  }));
  const { width, height } = extent([...cover, ...placedSlots], labelHeight);

  useEffect(() => {
    setReady(true);
  }, []);

  useLayoutEffect(() => {
    const next = frame.current.placed;
    const currentSignature = next
      .map((position) => `${position.key}:${position.cx}:${position.cy}`)
      .join(";");
    if (currentSignature !== signature) return;
    const previous = previousPlaced.current;
    const held = [...previous, ...next];
    setCover((current) => (sameExtent(current, held, labelHeight) ? current : held));
    if (frame.current.instant) {
      previousPlaced.current = next;
      setCover((current) => (sameExtent(current, next, labelHeight) ? current : next));
      return;
    }
    const id = window.setTimeout(() => {
      previousPlaced.current = next;
      setCover(next);
    }, treeGlideMs);
    return () => {
      window.clearTimeout(id);
      previousPlaced.current = [...previousPlaced.current, ...next];
    };
  }, [labelHeight, signature]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      role={manual ? "group" : "img"}
      aria-label={root ? "Tree" : "Empty tree"}
      fontFamily="inherit"
      className={cn("block h-full w-full text-foreground", className)}
    >
      <AnimatePresence initial={false}>
        {placed.map((position) => {
          if (position.parentKey === null) return null;
          const parent = byKey.get(position.parentKey);
          if (!parent) return null;
          const link = edgeLink(
            { key: parent.key, x: parent.cx, y: parent.cy },
            { key: position.key, x: position.cx, y: position.cy },
          );
          const glide = { duration: instant ? 0 : treeGlideSec, ease: "easeInOut" as const };
          return (
            <motion.g key={link.key} exit={{ opacity: 0 }} transition={glide}>
              <SnapshotEdge
                x1={link.x1}
                y1={link.y1}
                x2={link.x2}
                y2={link.y2}
                dropStart={link.dropStart}
                instant={instant}
              />
            </motion.g>
          );
        })}
      </AnimatePresence>
      <AnimatePresence initial={false}>
        {placed.map((position) => {
          const fact = facts.get(position.key);
          return (
            <motion.g
              key={position.key}
              initial={instant ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: instant ? 0 : treeGlideSec, ease: "easeInOut" }}
            >
              <TreeNode
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
                instant={instant}
                onSelect={onSelectKey}
              />
            </motion.g>
          );
        })}
      </AnimatePresence>
      {placedSlots.map((slot) => {
        const active = slot.id === activeSlotId;
        return (
          <g key={slot.id} data-drop="slot" data-slot-id={slot.id}>
            <circle
              cx={slot.cx}
              cy={slot.cy}
              r={treeNodeRadius - 2}
              fill={active ? "var(--primary)" : "var(--background)"}
              stroke="var(--primary)"
              strokeWidth={active ? 3 : 2}
              strokeDasharray={active ? undefined : "4 3"}
            />
            <path
              d={`M ${slot.cx - 6} ${slot.cy} H ${slot.cx + 6} M ${slot.cx} ${slot.cy - 6} V ${slot.cy + 6}`}
              stroke={active ? "var(--primary-foreground)" : "var(--primary)"}
              strokeWidth={2.5}
              strokeLinecap="round"
              pointerEvents="none"
            />
          </g>
        );
      })}
    </svg>
  );
}
