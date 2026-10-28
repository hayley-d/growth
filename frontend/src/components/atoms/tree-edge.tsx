type TreeEdgeProperties = {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  opacity?: number;
};

export function TreeEdge({ fromX, fromY, toX, toY, opacity = 1 }: TreeEdgeProperties) {
  return (
    <line
      x1={fromX}
      y1={fromY}
      x2={toX}
      y2={toY}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      opacity={opacity}
    />
  );
}
