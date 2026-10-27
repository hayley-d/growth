import { useEffect, useMemo, useRef, useState } from "react";

import { type AvlNode, insertKey, layoutTree, removeKey, toKeys } from "@/lib/avl";
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

const createRandom = (seed: number) => {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) % 2147483648;
    return state / 2147483648;
  };
};

const pickUnusedKey = (keys: number[], random: () => number) => {
  let key = 1 + Math.floor(random() * largestKey);
  while (keys.includes(key)) key = 1 + Math.floor(random() * largestKey);
  return key;
};

const buildTree = (size: number, random: () => number) => {
  let root: AvlNode | null = null;
  for (let count = 0; count < size; count += 1)
    root = insertKey(root, pickUnusedKey(toKeys(root), random));
  return root;
};

const toPoints = (root: AvlNode | null): NodePoint[] => {
  const layout = layoutTree(root);
  const offset = viewWidth / 2 - ((layout.length - 1) * nodeSpacing) / 2;
  return layout.map((position) => ({
    key: position.key,
    x: offset + position.x * nodeSpacing,
    y: topPadding + position.y * levelSpacing,
    parentKey: position.parentKey,
    opacity: 1,
  }));
};

const easeInOut = (progress: number) =>
  progress < 0.5 ? 2 * progress * progress : 1 - (-2 * progress + 2) ** 2 / 2;

const blend = (from: number, to: number, amount: number) => from + (to - from) * amount;

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return prefersReducedMotion;
}

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
        ? insertKey(rootReference.current, pickUnusedKey(keys, random))
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

function useTweenedPoints(targets: NodePoint[]) {
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
        opacity: 0,
      };
      return { from, to: target };
    });
    const leaving = currentReference.current
      .filter((point) => !targetKeys.has(point.key))
      .map((point) => ({ from: point, to: { ...point, opacity: 0 } }));
    const moves = [...entering, ...leaving];

    let frameId = 0;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startTime) / tweenDuration);
      const amount = easeInOut(progress);
      const frame = moves.map(({ from, to }) => ({
        ...to,
        x: blend(from.x, to.x, amount),
        y: blend(from.y, to.y, amount),
        opacity: blend(from.opacity, to.opacity, amount),
      }));
      currentReference.current = progress < 1 ? frame : targets;
      setPoints(currentReference.current);
      if (progress < 1) frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [targets]);

  return points;
}

export function GrowingAvlTree({
  seed,
  delay = 0,
  maxSize = 8,
  className,
}: GrowingAvlTreeProperties) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isVisible = usePageVisible();
  const [staticTree] = useState(() => buildTree(maxSize, createRandom(seed)));
  const cycledTree = useAvlCycle(seed, delay, maxSize, isVisible && !prefersReducedMotion);
  const root = prefersReducedMotion ? staticTree : cycledTree;
  const targets = useMemo(() => toPoints(root), [root]);
  const tweened = useTweenedPoints(targets);
  const points = prefersReducedMotion ? targets : tweened;
  const pointsByKey = new Map(points.map((point) => [point.key, point]));

  return (
    <svg
      viewBox={`0 0 ${viewWidth} ${viewHeight}`}
      aria-hidden="true"
      className={cn("text-muted-foreground", className)}
    >
      {points.map((point) => {
        const parent = point.parentKey === null ? undefined : pointsByKey.get(point.parentKey);
        if (!parent) return null;
        return (
          <line
            key={`${parent.key}-${point.key}`}
            x1={parent.x}
            y1={parent.y}
            x2={point.x}
            y2={point.y}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            opacity={Math.min(point.opacity, parent.opacity)}
          />
        );
      })}
      {points.map((point) => (
        <circle
          key={point.key}
          cx={point.x}
          cy={point.y}
          r={nodeRadius * (0.4 + 0.6 * point.opacity)}
          fill="var(--primary)"
          stroke="var(--primary-foreground)"
          strokeWidth="1.5"
          opacity={point.opacity}
        />
      ))}
    </svg>
  );
}
