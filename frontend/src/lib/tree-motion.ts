export const treeGlideMs = 450;
export const treeGlideSec = treeGlideMs / 1000;
export const treeDropPx = 36;

export type EdgeEnd = {
  key: number;
  x: number;
  y: number;
};

export const edgeLink = (parent: EdgeEnd, child: EdgeEnd) => {
  const start = child.key < parent.key ? child : parent;
  const end = start === child ? parent : child;
  return {
    key: `${start.key}-${end.key}`,
    x1: start.x,
    y1: start.y,
    x2: end.x,
    y2: end.y,
    dropStart: start.key === child.key,
  };
};
