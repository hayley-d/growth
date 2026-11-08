export const treeGlideMs = 450;
export const treeGlideSec = treeGlideMs / 1000;
export const treeDropPx = 36;
export const treeEdgeStaggerMs = 120;
export const treeEdgeDrawMs = 280;
export const treeEdgeDrawSec = treeEdgeDrawMs / 1000;

export type LightPoint = {
  key: number;
  x: number;
  parentKey: number | null;
};

export const lightOrder = (points: readonly LightPoint[], lit: ReadonlySet<number>): number[] => {
  const children = new Map<number | null, LightPoint[]>();
  for (const point of points) {
    const siblings = children.get(point.parentKey);
    if (siblings) siblings.push(point);
    else children.set(point.parentKey, [point]);
  }
  for (const siblings of children.values()) siblings.sort((left, right) => left.x - right.x);

  const order: number[] = [];
  const walk = (parentKey: number | null) => {
    for (const child of children.get(parentKey) ?? []) {
      if (lit.has(child.key)) order.push(child.key);
      walk(child.key);
    }
  };
  walk(null);
  return order;
};

export const lightDelayMs = (
  order: readonly number[],
  previouslyLit: ReadonlySet<number>,
  instant: boolean,
): Map<number, number> => {
  const delays = new Map<number, number>();
  if (instant) return delays;
  let rank = 0;
  for (const key of order) {
    if (previouslyLit.has(key)) continue;
    delays.set(key, rank * treeEdgeStaggerMs);
    rank += 1;
  }
  return delays;
};

export const coverHoldMs = (newLights: number, instant: boolean) => {
  if (instant) return 0;
  const lights = newLights === 0 ? 0 : (newLights - 1) * treeEdgeStaggerMs + treeEdgeDrawMs;
  return Math.max(treeGlideMs, lights);
};
