import { useEffect, useMemo, useRef, useState } from "react";

import { type AvlNode, insertKey, layoutTree, removeKey, toKeys } from "@shared/avl";
import { TreeEdge } from "@/components/atoms/tree-edge";
import { TreeNodeCircle } from "@/components/atoms/tree-node-circle";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

type GrowingAvlTreeProperties = {
  seed: number;
  delay?: number;
  maxSize?: number;
  className?: string;
};

type NodePoint = {
  key: number;
  x: number;
  y: number;
  parentKey: number | null;
  parentX: number;
  parentY: number;
  opacity: number;
};

const viewWidth = 220;
const viewHeight = 110;
const nodeSpacing = 23;
const levelSpacing = 26;
const topPadding = 14;
const nodeRadius = 7;
const minSize = 2;
const largestKey = 99;
const stepDuration = 1400;
const tweenDuration = 650;

const allKeys = Array.from({ length: largestKey }, (_, index) => index + 1);

const nodeColours = [
  { fill: "var(--primary)", stroke: "var(--primary-foreground)" },
  { fill: "var(--secondary)", stroke: "var(--secondary-foreground)" },
  { fill: "var(--accent)", stroke: "var(--accent-foreground)" },
] as const;

const toNodeColour = (key: number) => nodeColours[key % nodeColours.length] ?? nodeColours[0];

const createRandom = (seed: number) => {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) % 2147483648;
    return state / 2147483648;
  };
};

const insertRandomKey = (root: AvlNode | null, random: () => number) => {
  const keys = toKeys(root);
  const unusedKeys = allKeys.filter((key) => !keys.includes(key));
  const key = unusedKeys[Math.floor(random() * unusedKeys.length)];
  return key === undefined ? root : insertKey(root, key);
};

const buildTree = (size: number, random: () => number) => {
  let root: AvlNode | null = null;
  for (let count = 0; count < size; count += 1) root = insertRandomKey(root, random);
  return root;
};

const toPoints = (root: AvlNode | null): NodePoint[] => {
  const layout = layoutTree(root);
  const offset = viewWidth / 2 - ((layout.length - 1) * nodeSpacing) / 2;
  const placed = layout.map((position) => ({
    key: position.key,
    x: offset + position.x * nodeSpacing,
    y: topPadding + position.y * levelSpacing,
    parentKey: position.parentKey,
  }));
  const placedByKey = new Map(placed.map((point) => [point.key, point]));
  return placed.map((point) => {
    const parent = point.parentKey === null ? undefined : placedByKey.get(point.parentKey);
    return { ...point, parentX: parent?.x ?? point.x, parentY: parent?.y ?? point.y, opacity: 1 };
  });
};

const isSamePlace = (from: NodePoint, to: NodePoint) =>
  from.x === to.x &&
  from.y === to.y &&
  from.parentX === to.parentX &&
  from.parentY === to.parentY &&
  from.opacity === to.opacity;

const easeInOut = (progress: number) =>
  progress < 0.5 ? 2 * progress * progress : 1 - (-2 * progress + 2) ** 2 / 2;

const blend = (from: number, to: number, amount: number) => from + (to - from) * amount;

function usePageVisible() {
  const [isVisible, setIsVisible] = useState(() => document.visibilityState === "visible");
  useEffect(() => {
    const update = () => setIsVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  return isVisible;
}

function useAvlCycle(seed: number, delay: number, maxSize: number, isRunning: boolean) {
  const randomReference = useRef(createRandom(seed));
  const rootReference = useRef<AvlNode | null>(null);
  const isGrowingReference = useRef(true);
  const [root, setRoot] = useState<AvlNode | null>(null);

  useEffect(() => {
    if (!isRunning) return;
    const step = () => {
      const keys = toKeys(rootReference.current);
      if (keys.length >= maxSize) isGrowingReference.current = false;
      if (keys.length <= minSize) isGrowingReference.current = true;
      const random = randomReference.current;
      const next = isGrowingReference.current
        ? insertRandomKey(rootReference.current, random)
        : removeKey(rootReference.current, keys[Math.floor(random() * keys.length)] ?? 0);
      rootReference.current = next;
      setRoot(next);
    };
    let intervalId: ReturnType<typeof setInterval> | undefined;
    const timeoutId = setTimeout(() => {
      step();
      intervalId = setInterval(step, stepDuration);
    }, delay);
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [delay, maxSize, isRunning]);

  return root;
}

function useTweenedPoints(targets: NodePoint[], isAnimated: boolean) {
  const [points, setPoints] = useState<NodePoint[]>(targets);
  const currentReference = useRef<NodePoint[]>(targets);

  useEffect(() => {
    const starting = new Map(currentReference.current.map((point) => [point.key, point]));
    const targetKeys = new Set(targets.map((point) => point.key));
    const entering = targets.map((target) => {
      const parent = target.parentKey === null ? undefined : starting.get(target.parentKey);
      const from = starting.get(target.key) ?? {
        ...target,
        x: parent?.x ?? target.x,
        y: parent?.y ?? target.y,
        parentX: parent?.x ?? target.parentX,
        parentY: parent?.y ?? target.parentY,
        opacity: 0,
      };
      return { from, to: target };
    });
    const leaving = currentReference.current
      .filter((point) => !targetKeys.has(point.key))
      .map((point) => ({ from: point, to: { ...point, opacity: 0 } }));
    const moves = [...entering, ...leaving];

    if (!isAnimated || moves.every(({ from, to }) => isSamePlace(from, to))) {
      currentReference.current = targets;
      setPoints(targets);
      return;
    }

    let frameId = 0;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startTime) / tweenDuration);
      const amount = easeInOut(progress);
      const frame = moves.map(({ from, to }) => ({
        ...to,
        parentKey: to.parentKey ?? from.parentKey,
        x: blend(from.x, to.x, amount),
        y: blend(from.y, to.y, amount),
        parentX: blend(from.parentX, to.parentX, amount),
        parentY: blend(from.parentY, to.parentY, amount),
        opacity: blend(from.opacity, to.opacity, amount),
      }));
      currentReference.current = progress < 1 ? frame : targets;
      setPoints(currentReference.current);
      if (progress < 1) frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [targets, isAnimated]);

  return points;
}

export function GrowingAvlTree({
  seed,
  delay = 0,
  maxSize = 8,
  className,
}: GrowingAvlTreeProperties) {
  const size = Math.min(Math.max(maxSize, minSize + 1), largestKey);
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isVisible = usePageVisible();
  const [staticTree] = useState(() => buildTree(size, createRandom(seed)));
  const cycledTree = useAvlCycle(seed, delay, size, isVisible && !prefersReducedMotion);
  const root = prefersReducedMotion ? staticTree : cycledTree;
  const targets = useMemo(() => toPoints(root), [root]);
  const points = useTweenedPoints(targets, !prefersReducedMotion);

  return (
    <svg
      viewBox={`0 0 ${viewWidth} ${viewHeight}`}
      aria-hidden="true"
      className={cn("text-muted-foreground", className)}
    >
      {points.map((point) =>
        point.parentKey === null ? null : (
          <TreeEdge
            key={point.key}
            fromX={point.parentX}
            fromY={point.parentY}
            toX={point.x}
            toY={point.y}
            opacity={point.opacity}
          />
        ),
      )}
      {points.map((point) => {
        const colour = toNodeColour(point.key);
        return (
          <TreeNodeCircle
            key={point.key}
            x={point.x}
            y={point.y}
            radius={nodeRadius * (0.4 + 0.6 * point.opacity)}
            fill={colour.fill}
            stroke={colour.stroke}
            opacity={point.opacity}
          />
        );
      })}
    </svg>
  );
}
