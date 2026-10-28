type TreeNodeCircleProperties = {
  x: number;
  y: number;
  radius: number;
  fill: string;
  stroke: string;
  opacity?: number;
};

export function TreeNodeCircle({
  x,
  y,
  radius,
  fill,
  stroke,
  opacity = 1,
}: TreeNodeCircleProperties) {
  return (
    <circle
      cx={x}
      cy={y}
      r={radius}
      fill={fill}
      stroke={stroke}
      strokeWidth="1.5"
      opacity={opacity}
    />
  );
}
