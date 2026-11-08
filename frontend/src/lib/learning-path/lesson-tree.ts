export type LessonNode = {
  index: number;
  parent: number | null;
  depth: number;
};

export type MapLayout = "sideways" | "top-down";

export type MapPosition = {
  x: number;
  y: number;
};

const routeFromRoot = (count: number, index: number): number[] => {
  const route: number[] = [];
  let low = 0;
  let high = count - 1;
  while (low <= high) {
    const middle = Math.ceil((low + high) / 2);
    route.push(middle);
    if (middle === index) break;
    if (index < middle) high = middle - 1;
    else low = middle + 1;
  }
  return route;
};

export const buildLessonTree = (count: number): LessonNode[] =>
  Array.from({ length: count }, (_, index) => {
    const route = routeFromRoot(count, index);
    return { index, parent: route.at(-2) ?? null, depth: route.length - 1 };
  });

const pathBetween = (count: number, from: number, to: number): number[] => {
  const fromRoute = routeFromRoot(count, from);
  const toRoute = routeFromRoot(count, to);
  let shared = 0;
  while (fromRoute[shared] !== undefined && fromRoute[shared] === toRoute[shared]) shared += 1;
  return [...fromRoute.slice(shared - 1).reverse(), ...toRoute.slice(shared)];
};

export const walkToLesson = (count: number, current: number): number[] => {
  if (count === 0) return [];
  const walk = [0];
  for (let index = 0; index < current; index += 1) {
    walk.push(...pathBetween(count, index, index + 1).slice(1));
  }
  return walk;
};

export const lessonPositions = (nodes: readonly LessonNode[], layout: MapLayout): MapPosition[] => {
  const levels = Math.max(0, ...nodes.map((node) => node.depth)) + 1;
  return nodes.map((node) => {
    const along = ((node.index + 0.5) / nodes.length) * 100;
    const across = ((node.depth + 0.5) / levels) * 100;
    return layout === "top-down" ? { x: along, y: across } : { x: across, y: along };
  });
};
